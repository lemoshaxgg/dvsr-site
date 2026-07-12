import XLSX from 'xlsx'
import { items, categories } from '../data/catalog.js'
import { vkItems, vkCategories } from '../data/catalog-vostokkabel.js'
import { sigItems, sigCategories } from '../data/catalog-sig.js'
import { pdItems, pdCategories } from '../data/catalog-plastdv.js'
import { csItems } from '../data/catalog-centrsnab.js'
import { pshItems } from '../data/catalog-psh.js'

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

const DISCLAIMER = 'Цены и наличие ориентировочны и не являются публичной офертой (ст. 437 ГК РФ). Уточняйте стоимость и наличие у менеджеров ДСР: +7 914 329-29-29.'
const WHOLESALE_MAX = 500
const VOLUME_NOTE = 'ВНИМАНИЕ: указана оптовая цена (за объём от 50 шт / 50 м). При меньшем количестве стоимость уточняйте у менеджеров.'
const noteFor = (price) => (price <= WHOLESALE_MAX ? VOLUME_NOTE + ' ' : '') + DISCLAIMER

// Требования Фарпоста: у каждого товара — уникальный артикул, состояние, статус наличия.
const CONDITION = 'Новый'        // все товары новые
const AVAILABILITY = 'в наличии' // поменяйте на 'под заказ', если товар под заказ

const seenArt = new Set()
function article(it) {
  // Родной артикул (Восток Кабель) если есть, иначе ДСР-{id}; гарантируем уникальность
  let a = (it.art && String(it.art).trim()) || `ДСР-${it.id}`
  if (seenArt.has(a)) a = `${a}-${it.id}`
  seenArt.add(a)
  return a
}

const photoUrl = it => (/^https?:/i.test(it.photo || '') ? it.photo : '')

const all = [...items, ...vkItems, ...sigItems, ...pdItems, ...csItems, ...pshItems]

// Фарпост принимает прайс только с конкретными товарами и реальными ценами.
// Позиции без цены — это обобщённые «ассортиментные» строки (Смесители, Насосы,
// Запорная арматура и т.п.) и услуги → в прайс не включаем (иначе отказ).
const priced = all.filter(it => it.fixedPrice || it.basePrice)
const skipped = all.length - priced.length

const rows = priced.map(it => ({
  'Артикул': article(it),
  'Наименование товара': clean(it.title),
  'Состояние': CONDITION,
  'Цена, руб.': sellPrice(it),
  'Наличие': AVAILABILITY,
  'Ед. изм.': it.unit || 'шт',
  'Категория': clean(catMap[it.category] || it.category),
  'Фотография': photoUrl(it),
  'Описание': clean(it.description) + '. ' + noteFor(sellPrice(it)),
}))

const HEADER = ['Артикул', 'Наименование товара', 'Состояние', 'Цена, руб.', 'Наличие', 'Ед. изм.', 'Категория', 'Фотография', 'Описание']
const ws = XLSX.utils.json_to_sheet(rows, { header: HEADER })
ws['!cols'] = [{ wch: 16 }, { wch: 55 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 9 }, { wch: 26 }, { wch: 40 }, { wch: 70 }]
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Прайс ДСР')

const out = 'Прайс ДСР Фарпост.xlsx'
XLSX.writeFile(wb, out)
console.log('Готово:', out)
console.log('В прайсе:', rows.length, 'товаров с ценой | пропущено без цены:', skipped)
