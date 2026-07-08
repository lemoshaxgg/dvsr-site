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

const MARKUP = 1.15
function sellPrice(it) {
  if (it.fixedPrice) return Math.round(it.fixedPrice)
  if (it.basePrice) return Math.round((it.basePrice * MARKUP) / 10) * 10
  return null
}

const all = [...items, ...vkItems, ...sigItems, ...pdItems]
let withPrice = 0
const rows = all.map(it => {
  const price = sellPrice(it)
  if (price) withPrice++
  return {
    'Наименование': it.title || '',
    'Артикул': it.art || '',
    'Категория': catMap[it.category] || it.category || '',
    'Цена, ₽': price ?? '',
    'Ед. изм.': it.unit || 'шт',
    'Описание': (it.description || '').replace(/\s+/g, ' ').trim(),
  }
})

const ws = XLSX.utils.json_to_sheet(rows, {
  header: ['Наименование', 'Артикул', 'Категория', 'Цена, ₽', 'Ед. изм.', 'Описание'],
})
ws['!cols'] = [{ wch: 55 }, { wch: 12 }, { wch: 26 }, { wch: 12 }, { wch: 9 }, { wch: 70 }]
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Прайс ДСР')

const out = 'Прайс ДСР Фарпост.xlsx'
XLSX.writeFile(wb, out)
console.log('Готово:', out)
console.log('Всего позиций:', all.length, '| с ценой:', withPrice, '| без цены (Уточнить):', all.length - withPrice)
