// Подключает уже скачанные фото public/catalog/products/{id}.* к товарам,
// у которых поля photo ещё нет. Затрагивает ядро (catalog.js) и востоккабель.
// node scripts/wire-photos.cjs        — показать сколько подключится
// node scripts/wire-photos.cjs --apply — проставить photo и перезаписать файлы
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const PDIR = path.join(ROOT, 'public', 'catalog', 'products');

const files = new Set(fs.readdirSync(PDIR));
const EXT = ['jpg', 'jpeg', 'png', 'webp'];
function photoFor(id) {
  for (const e of EXT) if (files.has(`${id}.${e}`)) return `/catalog/products/${id}.${e}`;
  return null;
}

function wire(items) {
  let n = 0;
  for (const it of items) {
    if (it.photo || (it.photos && it.photos.length)) continue;
    const p = photoFor(it.id);
    if (p) { if (APPLY) it.photo = p; n++; }
  }
  return n;
}

// востоккабель
const vk = require('../data/catalog-vostokkabel.js');
const nVk = wire(vk.vkItems);
// ядро
const core = require('../data/catalog.js');
const nCore = wire(core.items);

console.log('Подключится фото — востоккабель:', nVk, '| ядро:', nCore);

if (!APPLY) { console.log('[DRY] не записано.'); process.exit(0); }

// перезапись востоккабеля (сохраняем структуру)
const vkHead = fs.readFileSync(path.join(ROOT, 'data', 'catalog-vostokkabel.js'), 'utf8').split('export const vkCategories')[0];
const vkOut = vkHead +
  'export const vkCategories = ' + JSON.stringify(vk.vkCategories, null, 2) + '\n\n' +
  'export const vkSubcategories = ' + JSON.stringify(vk.vkSubcategories, null, 2) + '\n\n' +
  'export const vkItems = [\n' + vk.vkItems.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]\n';
fs.writeFileSync(path.join(ROOT, 'data', 'catalog-vostokkabel.js'), vkOut, 'utf8');

// перезапись ядра (префикс байт-в-байт, items заново)
const raw = fs.readFileSync(path.join(ROOT, 'data', 'catalog.js'), 'utf8');
const prefix = raw.slice(0, raw.indexOf('export const items'));
fs.writeFileSync(path.join(ROOT, 'data', 'catalog.js'),
  prefix + 'export const items = [\n' + core.items.map((i) => '  ' + JSON.stringify(i)).join(',\n') + '\n]\n', 'utf8');

console.log('Записано. Фото проставлено:', nVk + nCore);
