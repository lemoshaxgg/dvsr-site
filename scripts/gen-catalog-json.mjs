// Дамп партнёрских каталогов из .js в public/data/*.json (их грузит публичный каталог).
// catalog-items.json НЕ трогаем — это отдельный статичный набор (id 1000–3112).
// Запуск: node scripts/gen-catalog-json.mjs
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { vkItems } from '../data/catalog-vostokkabel.js'
import { sigItems } from '../data/catalog-sig.js'
import { pdItems } from '../data/catalog-plastdv.js'
import { csItems } from '../data/catalog-centrsnab.js'
import { pshItems } from '../data/catalog-psh.js'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')
const dump = (name, arr) => {
  writeFileSync(join(OUT, name), JSON.stringify(arr), 'utf8')
  console.log(name, '→', arr.length, 'позиций')
}
dump('catalog-vk.json', vkItems)
dump('catalog-sig.json', sigItems)
dump('catalog-pd.json', pdItems)
dump('catalog-cs.json', csItems)
dump('catalog-psh.json', pshItems)
console.log('Готово.')
