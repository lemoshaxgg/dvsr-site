import XLSX from 'xlsx'
import { items, categories } from '../data/catalog.js'
import { vkItems, vkCategories } from '../data/catalog-vostokkabel.js'
import { sigItems, sigCategories } from '../data/catalog-sig.js'
import { pdItems, pdCategories } from '../data/catalog-plastdv.js'

// Единый справочник category.id -> label
const catMap = {}
for (const arr of [categories, vkCategories, sigCategories, pdCategories]) {
  for (const c of (arr || [])) if (c && c.id) catMap[c.id] = c.label || c.id
}

// Декодирование HTML-сущностей (в каталоге Сигнала встречается &quot; и др.)
const ENTITIES = { quot: '"', amp: '&', lt: '<', gt: '>', nbsp: ' ', laquo: '«', raquo: '»', apos: "'" }
function clean(s) {
  return String(s || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
}

const MARKUP = 1.15
function sellPrice(it) {
  if (it.fixedPrice) return Math.round(it.fixedPrice)
  if (it.basePrice) return Math.round((it.basePrice * MARKUP) / 10) * 10
  return null
}

const all = [...items, ...vkItems, ...sigItems, ...pdItems]

// Фарпост принимает прайс только с конкретными товарами и реальными ценами.
// Позиции без цены — это обобщённые «ассортиментные» строки (Смесители, Насосы,
// Запорная арматура и т.п.) и услуги → в прайс не включаем (иначе отказ).
const priced = all.filter(it => it.fixedPrice || it.basePrice)
const skipped = all.length - priced.length

const rows = priced.map(it => ({
  'Наименование': clean(it.title),
  'Артикул': it.art || '',
  'Категория': clean(catMap[it.category] || it.category),
  'Цена, ₽': sellPrice(it),
  'Ед. изм.': it.unit || 'шт',
  'Описание': clean(it.description),
}))

const ws = XLSX.utils.json_to_sheet(rows, {
  header: ['Наименование', 'Артикул', 'Категория', 'Цена, ₽', 'Ед. изм.', 'Описание'],
})
ws['!cols'] = [{ wch: 55 }, { wch: 12 }, { wch: 26 }, { wch: 12 }, { wch: 9 }, { wch: 70 }]
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Прайс ДСР')

const out = 'Прайс ДСР Фарпост.xlsx'
XLSX.writeFile(wb, out)
console.log('Готово:', out)
console.log('В прайсе:', rows.length, 'товаров с ценой | пропущено без цены:', skipped)
