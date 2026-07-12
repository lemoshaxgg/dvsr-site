// Фото сантехники с vl.cs27.ru (Центр Снабжения, Bitrix) → public/catalog/products/{id}.jpg
// У товаров cs нет артикула → матч по НАЗВАНИЮ: модельный код (15кч18п) + размеры + слова.
// Точность важнее полноты: сомнительные не берём.
// node scripts/scrape-cs-photos.cjs [--apply]   (без --apply только считает, не качает)
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { pipeline } = require('stream/promises');

const ROOT = path.join(__dirname, '..');
const PDIR = path.join(ROOT, 'public', 'catalog', 'products');
const BASE = 'https://vl.cs27.ru';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
const APPLY = process.argv.includes('--apply');

async function getHtml(url) {
  try { const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(40000) }); return r.ok ? await r.text() : null; }
  catch { return null; }
}
async function pool(items, limit, fn) {
  let i = 0; await Promise.all(Array.from({ length: limit }, async () => { while (i < items.length) await fn(items[i++]); }));
}

// ── токенизация названия ──
const STOP = new Set(['для', 'под', 'мм', 'см', 'ду', 'ру', 'dn', 'pn', 'шт', 'гост', 'gost', 'с', 'и', 'по', 'на', 'из', 'центр', 'снабжения', 'картинка']);
function toks(name) {
  const s = String(name).toLowerCase().replace(/ё/g, 'е').replace(/[«»"|]/g, ' ').replace(/[×хx*]/g, ' ').replace(/,(\d)/g, '.$1');
  const raw = s.replace(/[^a-zа-я0-9.\- ]/gi, ' ').split(/\s+/).filter(Boolean);
  const nums = new Set(), codes = new Set(), words = new Set();
  for (const t of raw) {
    if (/^\d+(\.\d+)?$/.test(t)) nums.add(t);
    else if (/[a-zа-я]/i.test(t) && /\d/.test(t) && t.length >= 4) codes.add(t.replace(/-/g, '')); // модельный код (15кч18п)
    else if (!STOP.has(t) && t.length >= 4) words.add(t);
  }
  return { nums, codes, words };
}
const eqSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const subset = (a, b) => [...a].every((x) => b.has(x));
const shared = (a, b) => { for (const x of a) if (b.has(x)) return true; return false; };
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };

function cleanName(alt) {
  return String(alt || '').replace(/^\s*картинка\s*/i, '').replace(/\s*\|\s*Центр.*$/i, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

(async () => {
  // 1) категории
  const home = fs.readFileSync(path.join(ROOT, 'partners', 'cs', 'home.html'), 'utf8');
  const cats = [...new Set((home.match(/\/catalog\/[a-z0-9_-]+\//g) || []))];
  console.log('Категорий:', cats.length);

  // 2) обход + сбор товаров сайта {name, img, tok}
  const site = [];
  await pool(cats, 8, async (slug) => {
    for (let page = 1; page <= 10; page++) {
      const html = await getHtml(`${BASE}${slug}${page > 1 ? `?PAGEN_1=${page}` : ''}`);
      if (!html) break;
      const $ = cheerio.load(html);
      const cards = $('.item_block');
      if (!cards.length) break;
      cards.each((_, el) => {
        const $e = $(el);
        const img = $e.find('a.thumb img, .image_wrapper_block img').first();
        const src = img.attr('src') || img.attr('data-src') || '';
        const name = cleanName(img.attr('alt') || $e.find('.item-title, [class*=title]').first().text());
        if (src && name && !/no_photo|noimage|placeholder/i.test(src)) site.push({ name, img: src.startsWith('http') ? src : BASE + src, ...toks(name) });
      });
      if (cards.length < 20) break;
    }
  });
  console.log('Товаров на сайте собрано:', site.length);

  // 3) матч cs-товаров
  const cs = require('../data/catalog-centrsnab.js').csItems;
  let matched = 0, downloaded = 0, exists = 0;
  const preview = [];
  const jobs = cs.map((it) => ({ it, t: toks(it.title) }));
  await pool(jobs, 8, async ({ it, t }) => {
    let best = null, bestScore = 0;
    for (const s of site) {
      let ok = false, score = 0;
      // сильный сигнал: общий модельный код + совпадение размеров
      if (t.codes.size && shared(t.codes, s.codes) && (eqSet(t.nums, s.nums) || subset(t.nums, s.nums))) { ok = true; score = 0.9 + jac(t.words, s.words) * 0.1; }
      // иначе: точное совпадение размеров + сильное совпадение слов
      else if (t.nums.size && eqSet(t.nums, s.nums) && jac(t.words, s.words) >= 0.6) { ok = true; score = jac(t.words, s.words); }
      if (ok && score > bestScore) { bestScore = score; best = s; }
    }
    if (!best) return;
    matched++;
    if (preview.length < 12) preview.push(`  ${it.title.slice(0, 40)}  ⇐  ${best.name.slice(0, 40)}`);
    if (!APPLY) return;
    const dest = path.join(PDIR, `${it.id}.jpg`);
    if (fs.existsSync(dest)) { exists++; return; }
    try {
      const r = await fetch(best.img, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(40000) });
      if (r.ok) { await pipeline(r.body, fs.createWriteStream(dest)); downloaded++; }
    } catch {}
  });
  console.log('Сматчено cs-товаров:', matched, 'из', cs.length);
  console.log('Примеры матчей:'); preview.forEach((p) => console.log(p));
  if (APPLY) console.log('Скачано фото:', downloaded, '| уже было:', exists);
  else console.log('[DRY] качать: node scripts/scrape-cs-photos.cjs --apply');
})();
