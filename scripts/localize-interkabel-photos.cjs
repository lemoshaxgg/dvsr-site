// Скачивает http-фото interkabel.com.ru локально (они битые на HTTPS-сайте из-за
// upgrade-insecure-requests — interkabel не отдаёт по https). Сохраняет в
// public/catalog/products/{id}.jpg и правит photo в public/data/catalog-items.json.
// node scripts/localize-interkabel-photos.cjs
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const ROOT = path.join(__dirname, '..');
const JSON_FILE = path.join(ROOT, 'public', 'data', 'catalog-items.json');
const PDIR = path.join(ROOT, 'public', 'catalog', 'products');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

async function pool(items, limit, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) { const idx = i++; await fn(items[idx]); }
  }));
}

(async () => {
  const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  const targets = data.filter((it) => it && it.photo && /^http:\/\/interkabel\.com\.ru/i.test(it.photo));
  console.log('http-interkabel фото к локализации:', targets.length);

  let ok = 0, fail = 0;
  await pool(targets, 8, async (it) => {
    const dest = path.join(PDIR, `${it.id}.jpg`);
    try {
      if (!fs.existsSync(dest)) {
        const r = await fetch(it.photo, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
        if (!r.ok) { fail++; return; }
        await pipeline(r.body, fs.createWriteStream(dest));
      }
      it.photo = `/catalog/products/${it.id}.jpg`; // теперь локальное, с нашего HTTPS
      ok++;
    } catch { fail++; }
  });

  fs.writeFileSync(JSON_FILE, JSON.stringify(data), 'utf8');
  console.log('Локализовано:', ok, '| не удалось:', fail);
})();
