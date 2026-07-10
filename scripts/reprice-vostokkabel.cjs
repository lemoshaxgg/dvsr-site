// Пересчёт цен Восток Кабель по прайсу поставщика с наценкой по группам.
// Источник закупки: partners/востоккабель.xls (Код | Наименование | Опт.цена с НДС).
// basePrice = fixedPrice = ЦЕНА ПРОДАЖИ (закупка × наценка группы, округл. до 10).
//   (так исторически: basePrice показывается напрямую в модалке заказа/сортировке)
// buyPrice = чистая закупка — для будущих пересчётов, показом не читается.
// Запуск: node scripts/reprice-vostokkabel.cjs
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const PRICE_FILE = path.join(ROOT, 'partners', 'востоккабель.xls');
const OUT = path.join(ROOT, 'data', 'catalog-vostokkabel.js');

const vk = require('../data/catalog-vostokkabel.js');
const categories = vk.vkCategories;
const subcats = vk.vkSubcategories;
const items = vk.vkItems.slice();

// Наценка по группам (утверждено пользователем)
const MARKUP = {
  vk_auto: 1.30, vk_electro: 1.30, vk_cable_access: 1.35, cable: 1.08,
  vk_lighting: 1.25, vk_shields: 1.12, vk_tools: 1.20,
  vk_meters: 1.20, vk_soldering: 1.20, vk_security: 1.20, vk_climate: 1.20,
};
const DEFAULT_MARKUP = 1.20;
const markupFor = (cat) => MARKUP[cat] || DEFAULT_MARKUP;
const sell = (buy, m) => (buy > 0 ? Math.round((buy * m) / 10) * 10 : null);
const fmt = (v) => Number(v).toLocaleString('ru-RU');

// Инференс категории по названию (для новых позиций)
function inferCat(name) {
  const s = name.toLowerCase();
  if (/кабель|провод|витая пара|ввг|кгтп|\bкг\b|\bпвс\b|ппгнг|пнсв|аввг|вббш|\bрк\b/.test(s)) return 'cable';
  if (/автомат|\bдиф\b|дифф|авдт|\bузо\b|контактор|пускатель|выключатель нагрузки|разъединитель|расцепител/.test(s)) return 'vk_auto';
  if (/бокс|щрн|щрв|\bщит|корпус\b|шкаф/.test(s)) return 'vk_shields';
  if (/розетк|выключатель|переключатель|рамка|глосса|бланка|механизм|диммер|светорегулятор|вилка|\bбра\b|клемм|wago|сжим/.test(s)) return 'vk_electro';
  if (/лампа|светильник|прожектор|\bled\b|светодиод|патрон|стартер|дроссель/.test(s)) return 'vk_lighting';
  if (/бокорез|кабелерез|стриппер|плоскогубц|длинногубц|отверт|\bбур\b|диск отрезной|клещи|кримпер|обжим|пистолет/.test(s)) return 'vk_tools';
  if (/гильза|дюбель|хомут|кабель.?канал|наконечник|\bзажим|арматура сип|бирк|изолятор|изолент|дин.?рейк|стяжк|\bмуфта|гофр|скоба|бандаж|герметик|канифоль|припой|термоусад|\bтут\b|лоток|тройник|консоль|кронштейн|держатель|коробка|гвозд|лента монтаж/.test(s)) return 'vk_cable_access';
  if (/датчик|\bреле|таймер|счётчик|счетчик|прибор|индикатор|тестер|мультиметр|трансформатор тока|звонок/.test(s)) return 'vk_meters';
  return null;
}

// иконка по категории — берём у существующего товара группы, иначе из vkCategories
const iconByCat = {};
for (const it of items) if (it.category && !iconByCat[it.category] && it.icon) iconByCat[it.category] = it.icon;
for (const c of categories) if (!iconByCat[c.id] && c.icon) iconByCat[c.id] = c.icon;
const iconFor = (cat) => iconByCat[cat] || '⚡';

function subFor(cat, name) {
  const s = name.toLowerCase();
  if (cat === 'cable') return /провод|\bпвс\b|\bпв\b/.test(s) ? 'wire' : 'cable_power';
  if (cat === 'vk_auto') {
    if (/\bдиф\b|дифф|авдт|\bузо\b/.test(s)) return 'vk_auto_uzo';
    if (/контактор|пускатель/.test(s)) return 'vk_auto_cont';
    if (/\bреле|таймер/.test(s)) return 'vk_auto_relay';
    return 'vk_auto_avt';
  }
  if (cat === 'vk_electro') {
    if (/розетк/.test(s)) return 'vk_el_socket';
    if (/клемм|зажим|wago|сжим/.test(s)) return 'vk_el_term';
    if (/вилка|удлинит/.test(s)) return 'vk_el_plug';
    return 'vk_el_other';
  }
  if (cat === 'vk_cable_access') {
    if (/кабель.?канал|короб/.test(s)) return 'vk_ca_duct';
    if (/хомут|скоба|стяжк|бандаж/.test(s)) return 'vk_ca_clamp';
    if (/гофр/.test(s)) return 'vk_ca_pipe';
    if (/лоток/.test(s)) return 'vk_ca_tray';
    return 'vk_ca_other';
  }
  const arr = subcats[cat];
  return arr && arr.length ? arr[0].id : undefined;
}

// ---- читаем прайс поставщика ----
const wb = XLSX.readFile(PRICE_FILE);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, blankrows: false });
const fileMap = new Map();
for (const r of rows.slice(2)) {
  if (r[0] == null || r[1] == null) continue;
  const art = String(r[0]).trim();
  const buy = r[2] != null && !isNaN(+r[2]) ? +r[2] : 0;
  fileMap.set(art, { name: String(r[1]).trim(), buy: Math.round(buy * 100) / 100 });
}

// ---- пересчёт существующих ----
const stat = { fromFile: 0, backedOut: 0, zero: 0, added: 0, catCount: {} };
function applyPrice(it, buy, cat) {
  const m = markupFor(cat);
  it.buyPrice = buy > 0 ? buy : 0;
  const s = sell(buy, m);
  if (s) {
    it.basePrice = s;
    it.fixedPrice = s;
    it.price = `от ${fmt(s)} ₽`;
  } else {
    it.basePrice = null;
    delete it.fixedPrice;
    it.price = 'Уточнить';
    stat.zero++;
  }
}

let maxId = 20000;
for (const it of items) {
  if (typeof it.id === 'number' && it.id > maxId) maxId = it.id;
  const art = it.art != null ? String(it.art).trim() : null;
  let buy;
  if (art && fileMap.has(art)) { buy = fileMap.get(art).buy; stat.fromFile++; }
  else { buy = it.basePrice ? Math.round((it.basePrice / 1.15) * 100) / 100 : 0; stat.backedOut++; }
  applyPrice(it, buy, it.category);
}

// ---- новые позиции (есть в файле, нет в каталоге) ----
const existingArts = new Set(items.filter((i) => i.art != null).map((i) => String(i.art).trim()));
for (const [art, { name, buy }] of fileMap) {
  if (existingArts.has(art)) continue;
  const cat = inferCat(name) || 'vk_cable_access';
  stat.catCount[cat] = (stat.catCount[cat] || 0) + 1;
  const it = {
    id: ++maxId,
    category: cat,
    sub: subFor(cat, name),
    icon: iconFor(cat),
    art,
    title: name,
    price: '',
    basePrice: 0,
    unit: cat === 'cable' ? 'м' : 'шт',
    description: name,
  };
  applyPrice(it, buy, cat);
  items.push(it);
  stat.added++;
}

// ---- сериализация ----
const catJson = JSON.stringify(categories, null, 2);
const subJson = JSON.stringify(subcats, null, 2);
const itemsJson = '[\n' + items.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]';
const header =
  '// Каталог Восток Кабель (vostokkabel-vl.ru)\n' +
  '// Наценка по группам: авто/электроуст +30%, прокладка кабеля +35%, кабель +8%,\n' +
  '// свет +25%, щиты +12%, инструмент +20%, прочее +20%. Закупка в buyPrice.\n' +
  '// Пересчитано из прайса поставщика от 09.07.2026. ID: 20000–29999.\n\n';
const out = header +
  'export const vkCategories = ' + catJson + '\n\n' +
  'export const vkSubcategories = ' + subJson + '\n\n' +
  'export const vkItems = ' + itemsJson + '\n';
fs.writeFileSync(OUT, out, 'utf8'); // без BOM

// ---- отчёт ----
const priced = items.filter((i) => i.basePrice);
const sells = priced.map((i) => i.basePrice);
console.log('Обновлено из файла:', stat.fromFile);
console.log('Пересчитано без файла (back-out):', stat.backedOut);
console.log('Новых добавлено:', stat.added);
console.log('С «Уточнить» (нулевая закупка):', stat.zero);
console.log('Итого позиций:', items.length);
console.log('Категории новых:', JSON.stringify(stat.catCount));
console.log('Диапазон цен продажи:', Math.min(...sells), '…', Math.max(...sells), '₽');
console.log('Файл записан:', path.relative(ROOT, OUT), '(', (out.length / 1e6).toFixed(2), 'МБ )');
