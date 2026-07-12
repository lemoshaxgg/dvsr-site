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

function sellPrice(it: any): number | null {
  if (it.fixedPrice) return Math.round(it.fixedPrice)
  if (it.basePrice) return Math.round((it.basePrice * MARKUP) / 10) * 10
  return null
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
const xml = (s: any) => clean(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function photo(it: any): string {
  const p = it.photo || (it.photos && it.photos[0]) || ''
  if (!p) return ''
  return /^https?:/i.test(p) ? p : SITE + (p.startsWith('/') ? p : '/' + p)
}

let cache = ''
let cacheAt = 0

function build(): string {
  const all = [...items, ...vkItems, ...sigItems, ...pdItems, ...csItems, ...pshItems]
  const priced = all.filter((it) => sellPrice(it))

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
    return `<offer id="${xml(art)}" available="true">`
      + `<name>${xml(it.title)}</name>`
      + `<price>${sellPrice(it)}</price><currencyId>RUB</currencyId>`
      + `<categoryId>${catId[label]}</categoryId>`
      + (pic ? `<picture>${xml(pic)}</picture>` : '')
      + `<vendorCode>${xml(art)}</vendorCode>`
      + (it.unit ? `<param name="Ед. изм.">${xml(it.unit)}</param>` : '')
      + `<description>${xml(it.description || it.title)}</description>`
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
