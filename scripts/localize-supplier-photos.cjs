// Локализует фото поставщиков (signaldv.ru у Сигнала, primstroyhab.ru у ПримСтройХаба)
// к нам в public/catalog/products/{id}.jpg и переписывает photo в data/catalog-sig.js /
// data/catalog-psh.js на /catalog/products/{id}.jpg. Это чинит «нет фото» на Фарпосте
// (наш домен отдаёт картинки) и убирает утечку доменов поставщиков.
// node scripts/localize-supplier-photos.cjs [--limit N] [--only sig|psh]
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const ROOT = path.join(__dirname, '..');
const PDIR = path.join(ROOT, 'public', 'catalog', 'products');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const argLimit = (() => { const i = process.argv.indexOf('--limit'); return i > 0 ? Number(process.argv[i + 1]) : 0; })();
const only = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : ''; })();

const TARGETS = [
  { key: 'sig', file: path.join(ROOT, 'data', 'catalog-sig.js'), items: require('../data/catalog-sig.js').sigItems, host: /signaldv\.ru/i },
  { key: 'psh', file: path.join(ROOT, 'data', 'catalog-psh.js'), items: require('../data/catalog-psh.js').pshItems, host: /primstroyhab\.ru/i },
].filter((t) => !only || t.key === only);

const primary = (it) => it.photo || (it.photos && it.photos[0]) || '';

async function pool(arr, limit, fn) {
  let i = 0; let ok = 0; let fail = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < arr.length) { const it = arr[i++]; (await fn(it)) ? ok++ : fail++; if ((ok + fail) % 200 === 0) console.log(`  …${ok + fail}/${arr.length} (ok ${ok}, fail ${fail})`); }
  }));
  return { ok, fail };
}

async function download(url, dest, tries = 3) {
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Referer: new URL(url).origin }, signal: AbortSignal.timeout(30000) });
      if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 1500 * (t + 1))); continue; }
      if (!r.ok) return false;
      const tmp = dest + '.tmp';
      await pipeline(r.body, fs.createWriteStream(tmp));
      if (fs.statSync(tmp).size < 900) { fs.unlinkSync(tmp); return false; } // битый/заглушка
      fs.renameSync(tmp, dest);
      return true;
    } catch { await new Promise((s) => setTimeout(s, 1200 * (t + 1))); }
  }
  return false;
}

(async () => {
  if (!fs.existsSync(PDIR)) fs.mkdirSync(PDIR, { recursive: true });
  for (const T of TARGETS) {
    let list = T.items.filter((it) => T.host.test(primary(it)));
    if (argLimit) list = list.slice(0, argLimit);
    console.log(`\n=== ${T.key}: к локализации ${list.length} фото (${T.file.split(/[\\/]/).pop()}) ===`);

    const remap = new Map(); // oldUrl → /catalog/products/{id}.jpg (для успешно скачанных)
    const { ok, fail } = await pool(list, 4, async (it) => {
      const dest = path.join(PDIR, `${it.id}.jpg`);
      const url = primary(it);
      if (fs.existsSync(dest)) { remap.set(url, `/catalog/products/${it.id}.jpg`); return true; }
      const good = await download(url, dest);
      if (good) remap.set(url, `/catalog/products/${it.id}.jpg`);
      return good;
    });
    console.log(`  скачано/уже было: ${ok}, не удалось: ${fail}`);

    // переписываем photo-URL в .js (сохраняя BOM, если был)
    const buf = fs.readFileSync(T.file);
    const hasBom = buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    let text = buf.toString('utf8').replace(/^﻿/, '');
    let replaced = 0;
    for (const [oldUrl, local] of remap) {
      if (text.includes(oldUrl)) { text = text.split(oldUrl).join(local); replaced++; }
    }
    fs.writeFileSync(T.file, (hasBom ? '﻿' : '') + text, 'utf8');
    console.log(`  переписано URL в ${T.file.split(/[\\/]/).pop()}: ${replaced}`);
  }
  console.log('\nГотово. Дальше: node scripts/gen-catalog-json.mjs → пересобрать public/data/*.json');
})();
