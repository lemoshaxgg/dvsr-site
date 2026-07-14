// YML-фид для Яндекс.Вебмастер → Товары (блок «Предложения магазинов»).
// ~50 ходовых позиций с хорошей маржой по 5 направлениям. Цена = закупка × порог наценки.
// ВСЕ картинки — только с нашего домена (dsr-dv.ru): внешние (в т.ч. с доменов
// поставщиков) скачиваются локально, чтобы НЕ палить источники в публичном фиде.
// node scripts/gen-yandex-products-feed.cjs
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://dsr-dv.ru';
const PDIR = path.join(ROOT, 'public', 'catalog', 'products');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
const core = require('../data/catalog.js').items;
const vk = require('../data/catalog-vostokkabel.js').vkItems;
const sig = require('../data/catalog-sig.js').sigItems;
const psh = require('../data/catalog-psh.js').pshItems;

// закупка: buyPrice(vk/sig) → basePrice(ядро=ПСХ) → fixedPrice(psh)
const buyOf = (i) => i.buyPrice || i.basePrice || i.fixedPrice || null;
// розница по порогам наценки от закупки
function retail(buy) {
  let m = 1.25;
  if (buy > 150000) m = 1.12; else if (buy >= 30000) m = 1.18;
  return Math.round((buy * m) / 10) * 10;
}
const validPhoto = (p) => p && (/^https:\/\//i.test(p) || /^\/catalog\//.test(p));

// Картинка ТОЛЬКО с нашего домена. Внешние (поставщик и пр.) скачиваем в
// /catalog/products/{id}.jpg и отдаём как SITE/... . Если скачать не удалось —
// null (оффер пропускаем, но НИКОГДА не отдаём чужой домен).
async function resolvePicture(it) {
  const p = it.photo;
  if (!p) return null;
  if (/^\/catalog\//.test(p)) return SITE + p;              // уже локальный путь
  if (/^https:\/\/dsr-dv\.ru/i.test(p)) return p;           // уже наш домен
  const dest = path.join(PDIR, `${it.id}.jpg`);
  const localUrl = `${SITE}/catalog/products/${it.id}.jpg`;
  if (fs.existsSync(dest)) return localUrl;                  // локализовано ранее
  try {
    const r = await fetch(p, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return null;
    await pipeline(r.body, fs.createWriteStream(dest));
    return localUrl;
  } catch { return null; }
}

const BRANDS = ['TDM', 'IEK', 'DEKraft', 'DKC', 'CHINT', 'Schneider', 'Legrand', 'Lezard', 'ABB', 'EKF', 'КЭАЗ', 'ZOTA', 'СТЭН', 'Каракан', 'ТОПАС', 'ТВЕРЬ', 'Малахит', 'ТОПОЛЬ', 'Аэробокс', 'ФлоТенк', 'FloTenk'];
function vendorOf(title) {
  const t = String(title);
  for (const b of BRANDS) if (new RegExp('\\b' + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(t)) return b;
  return '';
}

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const xml = (s) => clean(s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── отбор по направлениям ──
const excluded = []; // {dir, id, title} — нет валидного фото

function pick(dir, pool, filter, limit) {
  const cand = pool.filter((i) => buyOf(i) && filter(i))
    .sort((a, b) => (buyOf(b) - buyOf(a))); // дороже = выше маржа
  const out = [];
  for (const i of cand) {
    if (out.length >= limit) break;
    if (!validPhoto(i.photo)) { excluded.push({ dir, id: i.id, title: i.title }); continue; }
    out.push({ ...i, _dir: dir });
  }
  return out;
}

// Ходовые жилые септики: Топас/Тверь/ЖУК/ШАР в диапазоне 50–350к (без промышленных ТОПАЭРО за 1.4 млн)
const septic = pick('Септики', [...psh, ...core], (i) => i.category === 'septic'
  && /септик|топас|тверь|жук|шар|скараб|топол|малахит|биопурит/i.test(i.title)
  && !/топаэро/i.test(i.title)
  && buyOf(i) >= 50000 && buyOf(i) <= 350000, 12);
const piles  = pick('Сваи',    [...core, ...psh], (i) => i.category === 'piles' && /сва|винтов|забивн/i.test(i.title), 10);
const nerzh  = pick('Нержавейка', core, (i) => i.category === 'rail', 5);
const elec   = pick('Электрика', vk, (i) => buyOf(i) >= 300 && ['vk_auto', 'vk_shields', 'vk_electro', 'vk_meters'].includes(i.category), 14);
const fire   = pick('Пожарное', sig, (i) => i.category === 'sigfire' && (i.fixedPrice || i.basePrice || 0) > 2000, 11);

const DIRS = [
  { id: 1, name: 'Септики и очистные сооружения', items: septic },
  { id: 2, name: 'Сваи винтовые и забивные', items: piles },
  { id: 3, name: 'Нержавеющие ограждения и прокат', items: nerzh },
  { id: 4, name: 'Электрика и автоматика', items: elec },
  { id: 5, name: 'Пожарное оборудование', items: fire },
];

(async () => {
  // ── сборка YML ──
  const catLines = DIRS.map((d) => `<category id="${d.id}">${xml(d.name)}</category>`);
  const offers = [];
  const noPic = []; // не удалось локализовать картинку → оффер пропущен (чтобы не палить домен)
  for (const d of DIRS) {
    for (const it of d.items) {
      const pic = await resolvePicture(it);
      if (!pic) { noPic.push({ dir: d.name, id: it.id, title: it.title }); continue; }
      const price = retail(buyOf(it));
      const vend = vendorOf(it.title);
      offers.push(
        `<offer id="${it.id}" available="true">`
        + `<name>${xml(it.title)}</name>`
        + `<price>${price}</price><currencyId>RUB</currencyId>`
        + `<categoryId>${d.id}</categoryId>`
        + `<picture>${xml(pic)}</picture>`
        + `<url>${SITE}/catalog/${it.id}</url>`
        + (vend ? `<vendor>${xml(vend)}</vendor>` : '')
        + `<description>${xml(it.description || it.title)}</description>`
        + `</offer>`,
      );
    }
  }

  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const feed = `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<yml_catalog date="${date}">\n<shop>\n`
    + `<name>ДСР</name>\n<company>ООО «Дальневосточные Системы Развития»</company>\n<url>${SITE}</url>\n`
    + `<currencies><currency id="RUB" rate="1"/></currencies>\n`
    + `<categories>\n${catLines.join('\n')}\n</categories>\n`
    + `<offers>\n${offers.join('\n')}\n</offers>\n`
    + `</shop>\n</yml_catalog>\n`;

  fs.writeFileSync(path.join(ROOT, 'public', 'yandex-products-feed.yml'), feed, 'utf8');

  // ── отчёт ──
  console.log('=== ФИД СОБРАН: public/yandex-products-feed.yml ===');
  let total = 0;
  for (const d of DIRS) { console.log('  ' + d.name.padEnd(38) + d.items.length + ' поз.'); total += d.items.length; }
  console.log('  Офферов в фиде: ' + offers.length + ' (из ' + total + ' отобранных)');
  console.log('\n=== Отсеяно на отборе (нет валидного фото): ' + excluded.length + ' ===');
  console.log('=== Пропущено (картинка не локализовалась): ' + noPic.length + ' ===');
  noPic.forEach((e) => console.log('  [' + e.dir + '] #' + e.id + ' ' + e.title.slice(0, 45)));

  console.log('\n=== ПРОВЕРКА: доменов поставщиков в фиде быть не должно ===');
  const leaks = (feed.match(/signaldv|primstroyhab|westwerk|demidov|interkabel|Сигнал|ПримСтройХаб/gi) || []);
  console.log(leaks.length ? '  !!! НАЙДЕНО: ' + [...new Set(leaks)].join(', ') : '  чисто — только dsr-dv.ru');

  console.log('\n=== СВЕРКА ЦЕН ПО СЕПТИКАМ (закупка → +наценка → итог) ===');
  septic.slice(0, 4).forEach((it) => {
    const b = buyOf(it), r = retail(b), m = Math.round((r / b - 1) * 100);
    console.log('  ' + it.title.slice(0, 40).padEnd(40) + ' | закупка ' + b + ' ₽ → +' + m + '% → ' + r + ' ₽');
  });
})();
