// Прайс-лист для Яндекс Бизнеса (Excel, лист «Товары»).
// Формат (только поля, которые принимает Я.Бизнес): Название | Цена | Категория | Описание.
// (Артикул/Единица/Ссылка на фото Я.Бизнес игнорирует — не включаем.)
// Описание обрезаем до 250 символов (Я.Бизнес длиннее сокращает). Без цены — не включаем.
// Запуск: node scripts/gen-yandex-price.mjs
import XLSX from 'xlsx'
import { items, categories } from '../data/catalog.js'
import { vkItems, vkCategories } from '../data/catalog-vostokkabel.js'
import { sigItems, sigCategories } from '../data/catalog-sig.js'
import { pdItems, pdCategories } from '../data/catalog-plastdv.js'
import { csItems } from '../data/catalog-centrsnab.js'
import { pshItems } from '../data/catalog-psh.js'

const SITE = 'https://dsr-dv.ru'
const catMap = {}
for (const arr of [categories, vkCategories, sigCategories, pdCategories]) {
  for (const c of (arr || [])) if (c && c.id) catMap[c.id] = c.label || c.id
}

const ENTITIES = { quot: '"', amp: '&', lt: '<', gt: '>', nbsp: ' ', laquo: '«', raquo: '»', apos: "'" }
function clean(s) {
  return String(s || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ').trim()
}
const MARKUP = 1.15
function sellPrice(it) {
  if (it.fixedPrice) return Math.round(it.fixedPrice)
  if (it.basePrice) return Math.round((it.basePrice * MARKUP) / 10) * 10
  return null
}
function shortDesc(s) {
  const t = clean(s)
  if (t.length <= 250) return t
  const cut = t.slice(0, 250)
  const i = cut.lastIndexOf(' ')
  return (i > 200 ? cut.slice(0, i) : cut).trim()
}

const all = [...items, ...vkItems, ...sigItems, ...pdItems, ...csItems, ...pshItems]
const priced = all.filter(it => it.fixedPrice || it.basePrice)

const HEADER = ['Название', 'Цена', 'Категория', 'Описание']
const rows = priced.map(it => ({
  'Название': clean(it.title),
  'Цена': sellPrice(it),
  'Категория': clean(catMap[it.category] || it.category),
  'Описание': shortDesc(it.description || it.title),
}))

const ws = XLSX.utils.json_to_sheet(rows, { header: HEADER })
ws['!cols'] = [{ wch: 50 }, { wch: 10 }, { wch: 26 }, { wch: 70 }]
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Товары')
const out = 'Прайс ДСР Яндекс.xlsx'
XLSX.writeFile(wb, out)
console.log('Готово:', out, '| товаров с ценой:', rows.length, '| пропущено без цены:', all.length - priced.length)
