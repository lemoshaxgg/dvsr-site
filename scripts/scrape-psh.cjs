// Скрапер каталога ПримСтройХаб (primstroyhab.ru) → partners/psh/products.json
// Снимает все категории со страницы /catalog, парсит карточки товаров.
// Категория товара берётся из его URL (/catalog/{catId}_slug/{prodId}_slug.html).
// Запуск: node scripts/scrape-psh.cjs
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'partners', 'psh');
const BASE = 'https://primstroyhab.ru';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

async function getHtml(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(40000) });
      if (r.ok) return await r.text();
    } catch (e) { /* retry */ }
    await new Promise((res) => setTimeout(res, 800));
  }
  return null;
}

// пул с ограничением параллелизма
async function pool(items, limit, fn) {
  const out = []; let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  });
  await Promise.all(workers);
  return out;
}

function parseProducts($, catNames) {
  const list = [];
  $('.item-catalog').each((_, el) => {
    const $e = $(el);
    const a = $e.find('a.h3').first();
    const name = a.find('span').text().replace(/\s+/g, ' ').trim();
    const href = a.attr('href') || '';
    const m = href.match(/\/catalog\/(\d+)[^/]*\/(\d+)_[^/]*\.html/);
    if (!name || !m) return;
    const catId = m[1], prodId = m[2];
    const art = $e.find('.marking').first().text().replace(/арт\.?/i, '').replace(/\s+/g, ' ').trim();
    const priceRaw = $e.find('.price b').first().text().replace(/[^\d]/g, '');
    const price = priceRaw ? +priceRaw : 0;
    const av = $e.find('.price .av, .item-t .av').first().text().trim();
    const styleImg = ($e.find('[style*=productfiles]').attr('style') || '').match(/url\(.([^)]*productfiles[^)]*)./);
    const img = styleImg ? styleImg[1] : '';
    list.push({ prodId, catId, catName: catNames[catId] || '', name, art, price, avail: av, img, url: BASE + href });
  });
  return list;
}

(async () => {
  // 1) категории со страницы /catalog
  const catHtml = fs.readFileSync(path.join(DIR, 'catalog.html'), 'utf8');
  const $c = cheerio.load(catHtml);
  const catUrls = new Map(); // id -> url
  const catNames = {};
  $c('a[href^="/catalog/"]').each((_, a) => {
    const href = $c(a).attr('href');
    const m = href.match(/^\/catalog\/(\d+)(_[^/]*)?\/$/);
    if (m) {
      const name = $c(a).text().replace(/\s+/g, ' ').trim();
      if (!catUrls.has(m[1])) catUrls.set(m[1], BASE + href);
      if (name && !catNames[m[1]]) catNames[m[1]] = name;
    }
  });
  console.log('Категорий к обходу:', catUrls.size);

  // 2) обход категорий
  const urls = [...catUrls.values()];
  const perCat = await pool(urls, 6, async (base) => {
    const acc = [];
    for (let page = 1; page <= 40; page++) {
      const url = page === 1 ? base : `${base}?mode=filter&sort=2&page=${page}`;
      const raw = await getHtml(url);
      if (!raw) break;
      // страница 2+ приходит JSON-ом {"html":"…"}; страница 1 — обычный HTML
      let html = raw;
      if (page > 1) { try { const j = JSON.parse(raw); html = j.html || ''; } catch { html = ''; } }
      const got = parseProducts(cheerio.load(html), catNames);
      if (!got.length) break;
      acc.push(...got);
    }
    return acc;
  });

  // 3) дедуп по prodId
  const byId = new Map();
  for (const arr of perCat) for (const p of arr) if (!byId.has(p.prodId)) byId.set(p.prodId, p);
  const products = [...byId.values()];

  fs.writeFileSync(path.join(DIR, 'products.json'), JSON.stringify(products, null, 0), 'utf8');
  fs.writeFileSync(path.join(DIR, 'categories.json'), JSON.stringify(catNames, null, 2), 'utf8');

  // отчёт
  const byCat = {};
  for (const p of products) byCat[p.catId] = (byCat[p.catId] || 0) + 1;
  const zero = products.filter((p) => !p.price).length;
  console.log('Товаров (уникальных):', products.length, '| без цены:', zero);
  console.log('Топ-15 категорий по кол-ву:');
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([id, n]) => console.log('  ', String(n).padStart(4), id, '—', (catNames[id] || '').slice(0, 45)));
})();
