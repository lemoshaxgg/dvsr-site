// Интеграция ПримСтройХаб (эталон рынка, БЕЗ наценки):
//  1) Ядро ДСР (data/catalog.js): снять наценку — fixedPrice=basePrice; у уверенных
//     совпадений (score>=0.5) обновить цену на текущую цену ПСХ.
//  2) Новые товары ПСХ (нет в ядре) -> data/catalog-psh.js (pshItems, id 50000+).
// Запуск: node scripts/import-psh.cjs
const fs = require('fs');
const path = require('path');
const core = require('../data/catalog.js');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://primstroyhab.ru';
const ID_START = 50000;
const fmt = (v) => Number(v).toLocaleString('ru-RU');

const CAT = {
  2: 'fence3d', 4: 'fence3d', 5: 'fence3d', 26: 'fence3d', 41: 'fence3d', 84: 'fence3d',
  3: 'mesh', 50: 'mesh', 51: 'mesh',
  24: 'piles', 25: 'piles', 80: 'piles', 82: 'piles',
  12: 'septic', 13: 'septic', 19: 'septic', 21: 'septic', 22: 'septic', 23: 'septic',
  74: 'septic', 81: 'septic', 87: 'septic', 90: 'septic', 91: 'septic', 92: 'septic',
  101: 'septic', 103: 'septic', 104: 'septic', 105: 'septic', 106: 'septic', 107: 'septic',
  14: 'tanks', 15: 'tanks', 16: 'tanks', 17: 'tanks', 76: 'tanks',
  75: 'kesson', 52: 'cellar', 77: 'fglass', 88: 'fglass',
  85: 'proflist', 98: 'proflist', 53: 'boiler',
  57: 'chimney', 58: 'chimney', 59: 'chimney', 60: 'chimney', 61: 'chimney', 62: 'chimney',
  63: 'chimney', 64: 'chimney', 65: 'chimney', 66: 'chimney', 67: 'chimney', 68: 'chimney',
  69: 'chimney', 70: 'chimney', 71: 'chimney', 72: 'chimney',
  30: 'docke', 31: 'docke', 32: 'docke', 33: 'docke', 34: 'docke', 35: 'docke', 36: 'docke',
  37: 'docke', 38: 'docke', 39: 'docke', 40: 'docke',
  44: 'forged', 45: 'forged', 46: 'forged', 47: 'forged', 48: 'forged',
  93: 'rail', 95: 'rail', 96: 'rail', 97: 'rail',
  9: 'garden', 83: 'services',
};
const ICON = { fence3d: '🔲', mesh: '🕸️', piles: '🔩', septic: '♻️', tanks: '🛢️', kesson: '🕳️', cellar: '🏚️', fglass: '🧊', proflist: '📐', boiler: '🔥', chimney: '🏭', docke: '🧱', forged: '⚜️', rail: '🚧', garden: '🌱', services: '🛠️' };

const STOP = new Set(['для', 'без', 'мм', 'см', 'м', 'размер', 'артикул', 'с', 'и', 'на', 'до', 'от', 'в', 'шт']);
const tokens = (s) => new Set(String(s).toLowerCase().replace(/[×хx*]/g, ' ').replace(/,(\d)/g, '.$1').replace(/[^a-zа-я0-9. ]/gi, ' ').split(/\s+/).filter((w) => w && !STOP.has(w) && w.length >= 2));
function score(a, b) { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); }

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'partners', 'psh', 'products.json'), 'utf8'));
for (const p of products) { p.dsr = CAT[p.catId] || null; p.tok = tokens(p.name); }
const byCat = {};
for (const p of products) if (p.dsr) (byCat[p.dsr] = byCat[p.dsr] || []).push(p);

// --- матч ядро -> ПСХ ---
const used = new Set();
const matchOf = new Map(); // coreId -> psh
for (const it of core.items) {
  const cands = byCat[it.category] || [];
  const itok = tokens(it.title + ' ' + (it.description || ''));
  let best = null, bestS = 0;
  for (const p of cands) { if (used.has(p.prodId)) continue; const s = score(itok, p.tok); if (s > bestS) { bestS = s; best = p; } }
  if (best && bestS >= 0.34) { used.add(best.prodId); matchOf.set(it.id, { p: best, s: bestS }); }
}

// --- 1) правка ядра ---
let priceUpd = 0;
const newItems = core.items.map((it) => {
  const m = matchOf.get(it.id);
  let price = it.basePrice; // по умолчанию — снимаем наценку (показываем basePrice)
  if (m && m.s >= 0.5 && m.p.price > 0 && m.p.price !== it.basePrice) { price = m.p.price; priceUpd++; }
  const out = { ...it, basePrice: price };
  if (price > 0) { out.fixedPrice = price; out.price = `от ${fmt(price)} ₽`; }
  return out;
});
// перезапись data/catalog.js: префикс (categories+subcategories) байт-в-байт, items заново
const raw = fs.readFileSync(path.join(ROOT, 'data', 'catalog.js'), 'utf8');
const cut = raw.indexOf('export const items');
const prefix = raw.slice(0, cut);
const itemsJs = 'export const items = [\n' + newItems.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]\n';
fs.writeFileSync(path.join(ROOT, 'data', 'catalog.js'), prefix + itemsJs, 'utf8');

// --- 2) новые товары ПСХ ---
const newPsh = products.filter((p) => p.dsr && !used.has(p.prodId));
let id = ID_START;
const pshItems = newPsh.map((p) => {
  const price = p.price > 0 ? p.price : null;
  return {
    id: id++, category: p.dsr, icon: ICON[p.dsr] || '📦',
    art: p.art || undefined,
    title: p.name,
    price: price ? `от ${fmt(price)} ₽` : 'Уточнить',
    basePrice: price, ...(price ? { fixedPrice: price } : {}),
    unit: 'шт',
    photo: p.img ? (p.img.startsWith('http') ? p.img : BASE + p.img) : undefined,
    description: p.name, subLabel: p.catName || undefined,
  };
});
const header = '// Каталог ПримСтройХаб (primstroyhab.ru) — эталон рынка, цены БЕЗ наценки (fixedPrice = его цена).\n// Разложен по категориям ядра ДСР. ID: 50000+. Обновлено 10.07.2026.\n\n';
fs.writeFileSync(path.join(ROOT, 'data', 'catalog-psh.js'), header + 'export const pshItems = [\n' + pshItems.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]\n', 'utf8');

console.log('Ядро: обновлено цен (уверенный матч, изменилась):', priceUpd, '| наценка снята со всех', newItems.length);
console.log('Новых ПСХ заведено:', pshItems.length, '| id 50000 –', id - 1);
const nc = {}; pshItems.forEach((i) => nc[i.category] = (nc[i.category] || 0) + 1);
console.log('По категориям:', JSON.stringify(nc));
