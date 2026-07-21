import { items, categories } from '~/data/catalog.js'
import { vkItems, vkCategories } from '~/data/catalog-vostokkabel.js'
import { sigItems, sigCategories } from '~/data/catalog-sig.js'
import { pdItems, pdCategories } from '~/data/catalog-plastdv.js'
import { csItems } from '~/data/catalog-centrsnab.js'
import { pshItems } from '~/data/catalog-psh.js'

// Динамический YML-прайс для авто-обновления Farpost (Ссылка на прайс-лист).
// Всегда актуален (берёт текущие данные каталога). Кэш 1 час.
const SITE = 'https://dsr-dv.ru'
const MARKUP = 1.15

// Защитный дисклеймер под каждым товаром: цена не является публичной офертой.
const DISCLAIMER =
  'Цены и наличие указаны ориентировочно и не являются публичной офертой (ст. 437 ГК РФ). ' +
  'Уточняйте актуальную стоимость и наличие товара у менеджеров ДСР: +7 914 329-29-29.'

// Мелкие позиции (провода/кабель и фитинги) отпускаются только оптом.
const WHOLESALE_MAX = 500
const VOLUME_NOTE =
  'Только оптом, от 50 шт (50 м). Мелкие позиции отпускаются партией; ' +
  'стоимость за меньшее количество уточняйте у менеджеров.'

// Оставляем дешёвую (≤500) мелочь только для проводов/кабеля и фитингов.
const FIT_KW = /фитинг|муфт|тройник|отвод|переход|ниппель|сгон|американк|крестовин|заглушк|футорк|штуцер|уплотнительн|компрессионн/i
const keepCheap = (it: any): boolean =>
  it.category === 'cable' || it.category === 'pd_fittings' || FIT_KW.test(it.title || '')

function sellPrice(it: any): number | null {
  let p = it.fixedPrice ? Math.round(it.fixedPrice)
    : it.basePrice ? Math.round((it.basePrice * MARKUP) / 10) * 10 : null
  // Защита наценки: у копеечной мелочи округление базы «до 10 вниз» опускало цену
  // ниже закупки. Для позиций ≤500 держим пол «не ниже закупки × наценка».
  if (p != null && p <= 500 && it.buyPrice) p = Math.max(p, Math.ceil((it.buyPrice * MARKUP) / 10) * 10)
  return p
}

const catMap: Record<string, string> = {}
for (const arr of [categories, vkCategories, sigCategories, pdCategories] as any[]) {
  for (const c of arr || []) if (c && c.id) catMap[c.id] = c.label || c.id
}

const ENT: Record<string, string> = { quot: '"', amp: '&', lt: '<', gt: '>', nbsp: ' ', laquo: '«', raquo: '»', apos: "'" }
function clean(s: any): string {
  return String(s || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ').trim()
}
// экранирование + удаление недопустимых для XML управляющих символов
const xml = (s: any) => clean(s)
  .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function photo(it: any): string {
  const p = it.photo || (it.photos && it.photos[0]) || ''
  if (!p) return ''
  return /^https?:/i.test(p) ? p : SITE + (p.startsWith('/') ? p : '/' + p)
}

let cache = ''
let cacheAt = 0

function build(): string {
  const all = [...items, ...vkItems, ...sigItems, ...pdItems, ...csItems, ...pshItems]
  const priced = all.filter((it) => { const p = sellPrice(it); return p != null && (p > 500 || keepCheap(it)) })

  const catId: Record<string, number> = {}
  let ci = 1
  const catLines: string[] = []
  for (const it of priced) {
    const label = catMap[it.category] || it.category || 'Прочее'
    if (!catId[label]) { catId[label] = ci++; catLines.push(`<category id="${catId[label]}">${xml(label)}</category>`) }
  }

  const seen = new Set<string>()
  const offers = priced.map((it) => {
    let art = (it.art && String(it.art).trim()) || `ДСР-${it.id}`
    if (seen.has(art)) art = `${art}-${it.id}`
    seen.add(art)
    const label = catMap[it.category] || it.category || 'Прочее'
    const pic = photo(it)
    const price = sellPrice(it)!
    const note = (price <= WHOLESALE_MAX ? VOLUME_NOTE + ' ' : '') + DISCLAIMER
    return `<offer id="${xml(art)}" available="true">`
      + `<name>${xml(it.title)}</name>`
      + `<price>${price}</price><currencyId>RUB</currencyId>`
      + `<categoryId>${catId[label]}</categoryId>`
      + (pic ? `<picture>${xml(pic)}</picture>` : '')
      + `<vendorCode>${xml(art)}</vendorCode>`
      + (it.unit ? `<param name="Ед. изм.">${xml(it.unit)}</param>` : '')
      + `<description>${xml((it.description || it.title) + '. ' + note)}</description>`
      + `</offer>`
  })

  const date = new Date().toISOString().slice(0, 16).replace('T', ' ')
  return `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<yml_catalog date="${date}">\n<shop>\n`
    + `<name>ДСР</name>\n<company>ООО «Дальневосточные Системы Развития»</company>\n<url>${SITE}</url>\n`
    + `<currencies><currency id="RUB" rate="1"/></currencies>\n`
    + `<categories>\n${catLines.join('\n')}\n</categories>\n`
    + `<offers>\n${offers.join('\n')}\n</offers>\n`
    + `</shop>\n</yml_catalog>\n`
}

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  const now = Date.now()
  if (!cache || now - cacheAt > 3_600_000) { cache = build(); cacheAt = now }
  return cache
})
