// Health-check внешних https-фото по «подозрительным» доменам.
// Собирает битые (не 200 / не image) с привязкой к источнику и id.
// node scripts/photo-healthcheck.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// домены под подозрением (из пробы)
const SUSPECT = ['westwerk.su', 'avatars.mds.yandex.net', 'bmskirov.ru', 'sanray73.ru', 'mc.ru', 'www.cs27.ru'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

const SRCS = [
  ['core', require('../data/catalog.js').items],
  ['vk', require('../data/catalog-vostokkabel.js').vkItems],
  ['sig', require('../data/catalog-sig.js').sigItems],
  ['psh', require('../data/catalog-psh.js').pshItems],
  ['json', JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/catalog-items.json'), 'utf8'))],
];

const domOf = (p) => (String(p).match(/^https?:\/\/([^\/]+)/i) || [])[1] || '';
const targets = [];
for (const [src, arr] of SRCS) {
  for (const i of arr || []) {
    if (i && i.photo && /^https:\/\//i.test(i.photo) && SUSPECT.includes(domOf(i.photo))) {
      targets.push({ src, id: i.id, title: i.title, photo: i.photo, dom: domOf(i.photo) });
    }
  }
}

async function check(u) {
  try {
    const r = await fetch(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const ct = r.headers.get('content-type') || '';
    return { ok: r.status === 200 && /image/i.test(ct), status: r.status };
  } catch (e) { return { ok: false, status: 'ERR' }; }
}
async function pool(items, limit, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: limit }, async () => { while (i < items.length) { const idx = i++; await fn(items[idx]); } }));
}

(async () => {
  console.log('Проверяю', targets.length, 'фото на подозрительных доменах...');
  const broken = [];
  let done = 0;
  await pool(targets, 16, async (t) => {
    const r = await check(t.photo);
    if (!r.ok) broken.push({ ...t, status: r.status });
    if (++done % 200 === 0) console.log('  ...', done, '/', targets.length);
  });

  // по домену
  const byDom = {};
  for (const b of broken) byDom[b.dom] = (byDom[b.dom] || 0) + 1;
  // по источнику
  const bySrc = {};
  for (const b of broken) bySrc[b.src] = (bySrc[b.src] || 0) + 1;

  console.log('\n=== БИТЫХ ВСЕГО:', broken.length, 'из', targets.length, '===');
  console.log('\nПо домену:');
  Object.entries(byDom).sort((a, b) => b[1] - a[1]).forEach(([d, c]) => console.log('  ' + String(c).padStart(4) + '  ' + d));
  console.log('\nПо источнику:');
  Object.entries(bySrc).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => console.log('  ' + String(c).padStart(4) + '  ' + s));

  fs.writeFileSync(path.join(ROOT, 'photo-broken.json'), JSON.stringify(broken, null, 0), 'utf8');
  console.log('\nСписок битых → photo-broken.json (', broken.length, 'шт.)');
})();
