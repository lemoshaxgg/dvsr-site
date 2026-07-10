// Удаление ТОЧНЫХ дублей ПримСтройХаба против ядра ДСР.
// Дубль = та же категория + одинаковый набор ЧИСЕЛ (размеров) + Jaccard(слов)>=0.7.
// Это отличает ТОПАС 5 / ТОПАС-С 5 / ТОПАС 5 Long (НЕ дубли) от точных повторов.
// node scripts/dedup-psh.cjs        — сухой прогон (показать)
// node scripts/dedup-psh.cjs --apply — удалить и перезаписать data/catalog-psh.js
const fs = require('fs');
const path = require('path');
const core = require('../data/catalog.js');
const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

const BOILER = new Set(['для', 'забора', 'забор', 'размер', 'артикул', 'шт', 'мм', 'см', 'м', 'по', 'твердотопливный', 'твердотопливные']);
function parse(s) {
  // дефис сохраняем внутри слов (ТОПАС-С ≠ ТОПАС!)
  const toks = String(s).toLowerCase().replace(/ё/g, 'е')
    .replace(/[×хx*]/g, ' ').replace(/,(\d)/g, '.$1')
    .replace(/[^a-zа-я0-9.\- ]/gi, ' ').split(/\s+/)
    .map((t) => t.replace(/^-+|-+$/g, '')).filter(Boolean);
  const nums = new Set(), words = new Set();
  for (const t of toks) {
    if (/^\d+(\.\d+)?$/.test(t)) nums.add(t);
    else if (!BOILER.has(t) && (t.length >= 2 || /-/.test(t))) words.add(t);
  }
  return { nums, words };
}
const eqSet = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };

const coreBy = {};
for (const it of core.items) (coreBy[it.category] = coreBy[it.category] || []).push({ it, ...parse(it.title) });

const psh = require('../data/catalog-psh.js').pshItems;
const dupes = [];
const keep = [];
for (const p of psh) {
  const pp = parse(p.title);
  const cands = coreBy[p.category] || [];
  let hit = null;
  for (const c of cands) {
    if (eqSet(pp.nums, c.nums) && jac(pp.words, c.words) >= 0.8) { hit = c.it; break; }
  }
  if (hit) dupes.push({ p, core: hit });
  else keep.push(p);
}

console.log('Всего ПСХ:', psh.length, '| дублей ядра:', dupes.length, '| останется:', keep.length);
const byCat = {};
dupes.forEach((d) => byCat[d.p.category] = (byCat[d.p.category] || 0) + 1);
console.log('Дубли по категориям:', JSON.stringify(byCat));
console.log('\n--- УДАЛЯЕМЫЕ дубли (ПСХ → уже есть в ядре) ---');
dupes.forEach((d) => console.log(`  #${d.p.id} [${d.p.category}] ${d.p.title.slice(0, 44)}  ←дубль→  ${d.core.title.slice(0, 40)}`));

if (!APPLY) { console.log('\n[DRY] не записано. Проверь список выше.'); process.exit(0); }

const header = fs.readFileSync(path.join(ROOT, 'data', 'catalog-psh.js'), 'utf8').split('export const pshItems')[0];
fs.writeFileSync(path.join(ROOT, 'data', 'catalog-psh.js'),
  header + 'export const pshItems = [\n' + keep.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]\n', 'utf8');
console.log('\nЗаписано. Осталось ПСХ:', keep.length);
