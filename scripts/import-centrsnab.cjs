// Импорт сантехники «Центр Снабжения» (partners/Оптовый прайс (2).xls) в каталог ДСР.
// Иерархия: главные разделы (отступ 0) → подгруппы (отступ >0) → товары (с ценой).
// Товары раскладываются по СУЩЕСТВУЮЩИМ категориям ДСР (pipe/plumbing/plastic/boiler/hatches/hardware).
// basePrice=fixedPrice=цена продажи (закупка×наценка, округл.10), buyPrice=закупка.
// Запуск: node scripts/import-centrsnab.cjs [--dry]   (--dry = без записи)
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DRY = process.argv.includes('--dry');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'partners', 'Оптовый прайс (2).xls');
const OUT = path.join(ROOT, 'data', 'catalog-centrsnab.js');
const ID_START = 40000;

const sell = (buy, m) => (buy > 0 ? Math.round((buy * m) / 10) * 10 : null);
const fmt = (v) => Number(v).toLocaleString('ru-RU');
const ICON = { pipe: '🔧', plumbing: '🚿', plastic: '🧵', boiler: '🔥', hatches: '🕳️', hardware: '🔩' };
const norm = (u) => {
  const s = String(u || '').trim().toLowerCase();
  if (/пог|^м\.?$/.test(s)) return 'м';
  if (/компл/.test(s)) return 'компл';
  if (/уп/.test(s)) return 'уп';
  if (/рул/.test(s)) return 'рул';
  if (/пар/.test(s)) return 'пар';
  if (/кг/.test(s)) return 'кг';
  return 'шт';
};

// Маршрутизация: (главный раздел, подгруппа, название) -> {cat, sub, markup} | null(skip)
function route(major, group, name) {
  const M = major.toLowerCase();
  const g = (group + ' ' + name).toLowerCase();
  const P = (sub, mk) => ({ cat: 'pipe', sub, markup: mk });

  if (/электрика/.test(M)) return null; // мелочь — пропускаем

  // Арматура
  if (/вентил|клапан/.test(M)) return P(/клапан/.test(g) ? 'pipe_check' : 'pipe_valve', 1.28);
  if (/задвижк|затвор/.test(M)) return P('pipe_gate', 1.28);
  if (/краны латунные|краны шаровые/.test(M)) return P('pipe_ball', 1.28);

  // Детали трубопровода — расщепляем по подгруппе
  if (/детали трубопровода/.test(M)) {
    if (/метиз|болт|гайк|шайб|шпильк|анкер/.test(g)) return { cat: 'hardware', sub: null, markup: 1.25 };
    if (/фильтр/.test(g)) return P('pipe_filter', 1.28);
    return P('pipe_other', 1.18); // отводы, переходы, тройники, фланцы, фитинги, муфты, хомуты
  }

  // Канализация — труба vs люки/шахты
  if (/канализац/.test(M)) {
    if (/люк|дождеприЁмник|дождеприемник/.test(g)) {
      const sub = /полимер/.test(g) ? 'hatch_polymer' : /чугун/.test(g) ? 'hatch_iron' : 'hatch_polymer';
      return { cat: 'hatches', sub, markup: 1.30 };
    }
    if (/шахт/.test(g)) return { cat: 'hatches', sub: 'hatch_shaft', markup: 1.30 };
    return { cat: 'plastic', sub: 'pp_pipe', markup: 1.18 }; // труба, гофра
  }

  // Трубы
  if (/полипропилен/.test(M)) return { cat: 'plastic', sub: 'pp_pipe', markup: 1.18 };
  if (/полиэтилен/.test(M)) return { cat: 'plastic', sub: 'pnd', markup: 1.18 };
  if (/метапол/.test(M)) return { cat: 'plastic', sub: 'pp_pipe', markup: 1.18 };

  // Метизы / расходка
  if (/метиз|круги отрезные|хомуты металл/.test(M)) return { cat: 'hardware', sub: null, markup: 1.25 };

  // Отопление
  if (/котлы|радиатор|тепл(ые|ый) пол/.test(M)) return { cat: 'boiler', sub: null, markup: 1.22 };

  // Сантехника
  if (/санфаянс|водонагрев|насос|прибор|теплоизоляц|хозтовар/.test(M)) return { cat: 'plumbing', sub: null, markup: 1.30 };

  // По умолчанию — трубопроводная арматура, прочее
  return P('pipe_other', 1.18);
}

// ---- парсинг иерархии ----
const wb = XLSX.readFile(SRC);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, blankrows: false });
const indent = (s) => { const m = String(s).match(/^\s*/); return m ? m[0].length : 0; };

let major = '', group = '', id = ID_START;
const csItems = [];
const stat = { total: 0, skipped: 0, zero: 0, byCat: {}, byMajor: {} };
const samples = {};

for (const r of rows.slice(3)) {
  const raw = r[0];
  if (raw == null) continue;
  const price = r[1] != null && !isNaN(+r[1]) ? +r[1] : null;
  const ind = indent(raw);
  const text = String(raw).trim();
  if (price == null) { // заголовок
    if (ind === 0) { major = text; group = ''; }
    else group = text;
    continue;
  }
  // товар
  const rt = route(major, group, text);
  if (!rt) { stat.skipped++; continue; }
  stat.total++;
  stat.byCat[rt.cat] = (stat.byCat[rt.cat] || 0) + 1;
  stat.byMajor[major] = (stat.byMajor[major] || 0) + 1;
  const buy = Math.round(price * 100) / 100;
  const s = sell(buy, rt.markup);
  if (!s) stat.zero++;
  const it = {
    id: id++,
    category: rt.cat,
    ...(rt.sub ? { sub: rt.sub } : {}),
    icon: ICON[rt.cat] || '🔧',
    title: text,
    price: s ? `от ${fmt(s)} ₽` : 'Уточнить',
    basePrice: s || null,
    ...(s ? { fixedPrice: s } : {}),
    buyPrice: buy > 0 ? buy : 0,
    unit: norm(r[2]),
    description: group ? `${group}. ${text}` : text,
    ...(group ? { subLabel: group } : {}),
  };
  csItems.push(it);
  // собрать примеры для калибровки
  const key = /кран/.test(major.toLowerCase()) ? 'кран' : /санфаянс/.test(major.toLowerCase()) ? 'санфаянс' : /канализац/.test(major.toLowerCase()) ? 'канализация' : /радиатор/.test(major.toLowerCase()) ? 'радиатор' : null;
  if (key && !samples[key]) samples[key] = { title: text, buy, markup: rt.markup, sell: s };
}

// ---- отчёт ----
console.log('Товаров заведено:', stat.total, '| пропущено (Электрика):', stat.skipped, '| «Уточнить»:', stat.zero);
console.log('По категориям ДСР:', JSON.stringify(stat.byCat));
console.log('Примеры для калибровки:');
for (const [k, v] of Object.entries(samples)) console.log('  ', k, '|', v.title.slice(0, 50), '| закуп', v.buy, '×', v.markup, '=', v.sell, '₽');

if (DRY) { console.log('\n[DRY] файл не записан.'); process.exit(0); }

// ---- запись data/catalog-centrsnab.js ----
const itemsJson = '[\n' + csItems.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]';
const header =
  '// Каталог сантехники «Центр Снабжения» (partners/Оптовый прайс).\n' +
  '// Разложен по категориям ДСР: pipe/plumbing/plastic/boiler/hatches/hardware.\n' +
  '// Наценка: арматура +28%, сталь/труба +18%, изделия +30%, метизы +25%, отопление +22%.\n' +
  '// Закупка в buyPrice. ID: 40000+.\n\n';
fs.writeFileSync(OUT, header + 'export const csItems = ' + itemsJson + '\n', 'utf8');
console.log('\nЗаписано:', path.relative(ROOT, OUT), '| позиций:', csItems.length);
