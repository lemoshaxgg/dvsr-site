// Сопоставление товаров ПримСтройХаб с ядром каталога ДСР (data/catalog.js).
// Цель: у совпавших товаров ДСР обновить цену = цена ПримСтройХаб БЕЗ наценки;
// несовпавшие товары ПСХ = новые. Матч по (категория ДСР + похожесть названия/размеров).
// Dry-отчёт: node scripts/match-psh.cjs   (ничего не пишет)
const fs = require('fs');
const path = require('path');
const core = require('../data/catalog.js');

// psh catId -> категория ДСР
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

const STOP = new Set(['для', 'без', 'мм', 'см', 'м', 'размер', 'артикул', 'с', 'и', 'на', 'до', 'от', 'в', 'шт']);
function tokens(s) {
  const t = String(s).toLowerCase()
    .replace(/[×хx*]/g, ' ') // разделители размеров
    .replace(/,(\d)/g, '.$1')
    .replace(/[^a-zа-я0-9. ]/gi, ' ')
    .split(/\s+/).filter(Boolean)
    .filter((w) => !STOP.has(w) && w.length >= 2);
  return new Set(t);
}
function score(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'partners', 'psh', 'products.json'), 'utf8'));
// добавим категорию ДСР и токены каждому товару ПСХ
for (const p of products) { p.dsr = CAT[p.catId] || null; p.tok = tokens(p.name); }

// индекс товаров ПСХ по категории ДСР
const byCat = {};
for (const p of products) if (p.dsr) (byCat[p.dsr] = byCat[p.dsr] || []).push(p);

const TH = 0.34;
const used = new Set();
const matches = [];
let noMatch = 0;
for (const it of core.items) {
  const cands = byCat[it.category] || [];
  const itok = tokens(it.title + ' ' + (it.description || ''));
  let best = null, bestS = 0;
  for (const p of cands) {
    if (used.has(p.prodId)) continue;
    const s = score(itok, p.tok);
    if (s > bestS) { bestS = s; best = p; }
  }
  if (best && bestS >= TH) {
    used.add(best.prodId);
    matches.push({ id: it.id, cat: it.category, title: it.title, old: it.basePrice, psh: best.price, pshName: best.name, s: bestS });
  } else noMatch++;
}
const newPsh = products.filter((p) => p.dsr && !used.has(p.prodId));
const skipped = products.filter((p) => !p.dsr);

console.log('Ядро ДСР:', core.items.length, '| товаров ПСХ:', products.length);
console.log('Совпало (обновим цену ядра):', matches.length, '| ядро без матча:', noMatch);
console.log('Новых ПСХ (заведём отдельно):', newPsh.length, '| без категории (skip):', skipped.length);
console.log('\n--- Примеры совпадений (id | было basePrice → цена ПСХ | score) ---');
matches.slice(0, 18).forEach((m) => console.log(`  #${m.id} [${m.cat}] ${String(m.old).padStart(6)} → ${String(m.psh).padStart(6)}  s=${m.s.toFixed(2)} | ${m.title.slice(0, 42)}`));
console.log('\n--- Новые ПСХ по категориям ---');
const nc = {}; newPsh.forEach((p) => nc[p.dsr] = (nc[p.dsr] || 0) + 1);
Object.entries(nc).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log('  ', String(n).padStart(4), c));
console.log('\n--- Спорные совпадения (низкий score 0.34–0.45) ---');
matches.filter((m) => m.s < 0.45).slice(0, 12).forEach((m) => console.log(`  s=${m.s.toFixed(2)} | ДСР: ${m.title.slice(0, 38)} ↔ ПСХ: ${m.pshName.slice(0, 42)}`));
