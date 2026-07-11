// Сбор фото товаров vostokkabel-vl.ru по артикулу (с карточек категорий).
// Артикул берём из title карточки (последний токен), фото — из <img> карточки
// (апгрейдим до оригинала, срезая /cache и размер). НЕ берём логотип/заглушки.
// Скачиваем в public/catalog/products/{id}.jpg для vk-товаров с совпавшим артикулом.
// node scripts/scrape-vk-photos.cjs
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { pipeline } = require('stream/promises');

const ROOT = path.join(__dirname, '..');
const PDIR = path.join(ROOT, 'public', 'catalog', 'products');
const BASE = 'https://vostokkabel-vl.ru';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

async function getHtml(url) {
  try { const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(40000) }); return r.ok ? await r.text() : null; }
  catch { return null; }
}
async function pool(items, limit, fn) {
  let i = 0; const out = [];
  await Promise.all(Array.from({ length: limit }, async () => { while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); } }));
  return out;
}
// нормализованный артикул: только буквы/цифры, без дефисов/регистра (устойчиво к формату)
const normArt = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const isBad = (u) => /no_image|placeholder|logo|banner|nophoto/i.test(u);
const toOriginal = (u) => u.replace('/image/cache/', '/image/').replace(/-\d+x\d+(\.\w+)$/, '$1');

(async () => {
  // 1) категории из меню
  const home = await getHtml(BASE + '/');
  const cats = new Set();
  for (const m of home.matchAll(/href="(https:\/\/vostokkabel-vl\.ru\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)"/g)) {
    const u = m[1];
    if (!/\.(jpg|png|css|js)|index\.php|\/(login|register|cart|checkout|contact|about|blog|news|special|account|information|wishlist)/.test(u)) cats.add(u);
  }
  console.log('Категорий к обходу:', cats.size);

  // 2) обход категорий (?limit=100), собираем art -> img
  const artImg = new Map();
  await pool([...cats], 6, async (cat) => {
    for (let page = 1; page <= 15; page++) {
      const html = await getHtml(`${cat}?limit=100&page=${page}`);
      if (!html) break;
      const $ = cheerio.load(html);
      const cards = $('.product-thumb');
      if (!cards.length) break;
      cards.each((_, el) => {
        const $e = $(el);
        const a = $e.find('a[title]').first();
        const title = a.attr('title') || $e.find('img').attr('alt') || '';
        const src = $e.find('.product-thumb__image img, img.img-responsive').first().attr('src') || '';
        if (!src || isBad(src)) return;
        const keys = new Set();
        // 1) артикул = последний токен подписи
        const tArt = normArt(String(title).trim().split(/\s+/).pop() || '');
        if (tArt.length >= 4) keys.add(tArt);
        // 2) артикул из имени файла картинки (…img-SQ0206-0146-100x100.jpg)
        const um = src.match(/img-([\w-]+?)-\d+x\d+\.\w+$/i) || src.match(/\/([\w-]+?)-\d+x\d+\.\w+$/i);
        if (um) { const uArt = normArt(um[1]); if (uArt.length >= 4) keys.add(uArt); }
        for (const k of keys) if (!artImg.has(k)) artImg.set(k, src);
      });
      if (cards.length < 100) break;
    }
  });
  console.log('Собрано артикул→фото:', artImg.size);

  // 3) матч с vk-товарами по артикулу, скачивание
  const vk = require('../data/catalog-vostokkabel.js').vkItems;
  let ok = 0, miss = 0, exists = 0;
  const targets = vk.filter((i) => i.art);
  await pool(targets, 6, async (it) => {
    const dest = path.join(PDIR, `${it.id}.jpg`);
    if (fs.existsSync(dest)) { exists++; return; }
    const src = artImg.get(normArt(it.art));
    if (!src) { miss++; return; }
    for (const url of [toOriginal(src), src]) {
      try {
        const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(40000) });
        if (!r.ok) continue;
        await pipeline(r.body, fs.createWriteStream(dest));
        ok++; return;
      } catch { /* try next */ }
    }
    miss++;
  });
  console.log('Скачано:', ok, '| уже было:', exists, '| без совпадения артикула:', miss, '| всего vk с арт:', targets.length);
})();
