// Пересчёт цен Сигнала: текущая цена = ЗАКУПКА → продажа = закупка×наценка группы.
// basePrice=fixedPrice=цена продажи, buyPrice=закупка. Запуск: node scripts/reprice-sig.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const sig = require('../data/catalog-sig.js');

const MARKUP = {
  sigbiz: 1.30, sigcctv: 1.30, siglandsc: 1.30, sigroad: 1.30, sigfire: 1.30,
  sigppe: 1.35, tanks: 1.25, sighome: 1.30, sigsite: 1.25, sigtech: 1.25,
  sigmarine: 1.30, sigfood: 1.30,
};
const sell = (b, m) => (b > 0 ? Math.round((b * m) / 10) * 10 : null);
const fmt = (v) => Number(v).toLocaleString('ru-RU');

let repriced = 0, zero = 0;
for (const it of sig.sigItems) {
  // закупка: если уже есть buyPrice — берём его (повторный прогон), иначе текущая basePrice
  const buy = it.buyPrice != null ? it.buyPrice : (it.basePrice || 0);
  const m = MARKUP[it.category] || 1.30;
  const s = sell(buy, m);
  it.buyPrice = buy > 0 ? buy : 0;
  if (s) { it.basePrice = s; it.fixedPrice = s; it.price = `от ${fmt(s)} ₽`; repriced++; }
  else { it.basePrice = null; delete it.fixedPrice; it.price = 'Уточнить'; zero++; }
}

const catJson = JSON.stringify(sig.sigCategories, null, 2);
const itemsJson = '[\n' + sig.sigItems.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]';
const header = '// Каталог Сигнал (signaldv.ru). Наценка по группам (закупка×%): бизнес/CCTV/благоустр/дорога/пожар/дом/море/пищ +30%, СИЗ +35%, ёмкости/стройпл/тех +25%. Закупка в buyPrice.\n// Пересчитано 10.07.2026.\n\n';
fs.writeFileSync(path.join(ROOT, 'data', 'catalog-sig.js'),
  header + 'export const sigCategories = ' + catJson + '\n\nexport const sigItems = ' + itemsJson + '\n', 'utf8');

console.log('Пересчитано:', repriced, '| «Уточнить» (нулевая закупка):', zero, '| всего:', sig.sigItems.length);
