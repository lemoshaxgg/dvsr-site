import { items } from '../../data/catalog.js'
import { vkItems } from '../../data/catalog-vostokkabel.js'
import { sigItems } from '../../data/catalog-sig.js'
import { pdItems } from '../../data/catalog-plastdv.js'
import { csItems } from '../../data/catalog-centrsnab.js'
import { pshItems } from '../../data/catalog-psh.js'
import itemsJson from '../../public/data/catalog-items.json'
import { posts } from '../../data/blog.js'

const BASE = 'https://dsr-dv.ru'

let cache = ''
let cacheAt = 0

function build(): string {
  const staticPages = [
    { url: '/',           changefreq: 'weekly',  priority: '1.0' },
    { url: '/catalog',    changefreq: 'daily',   priority: '0.9' },
    { url: '/about',      changefreq: 'monthly', priority: '0.7' },
    { url: '/promotions', changefreq: 'weekly',  priority: '0.8' },
    { url: '/blog',       changefreq: 'weekly',  priority: '0.7' },
    { url: '/privacy',    changefreq: 'yearly',  priority: '0.3' },
  ]

  // ВСЕ карточки товаров: ядро + партнёрские (электрика, Сигнал, ПЭ, сантехника, ПримСтройХаб, интеркабель)
  const seen = new Set<number>()
  const catalogPages: { url: string }[] = []
  for (const src of [items, itemsJson as any[], vkItems, sigItems, pdItems, csItems, pshItems]) {
    for (const i of src || []) {
      if (i && typeof i.id === 'number' && !seen.has(i.id)) {
        seen.add(i.id)
        catalogPages.push({ url: `/catalog/${i.id}` })
      }
    }
  }

  const blogPages = (posts || []).map((p: any) => ({ url: `/blog/${p.slug}` }))

  const lines: string[] = []
  for (const p of staticPages) {
    lines.push(`  <url><loc>${BASE}${p.url}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`)
  }
  for (const p of catalogPages) {
    lines.push(`  <url><loc>${BASE}${p.url}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`)
  }
  for (const p of blogPages) {
    lines.push(`  <url><loc>${BASE}${p.url}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join('\n')}\n</urlset>`
}

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  const now = Date.now()
  if (!cache || now - cacheAt > 3_600_000) { cache = build(); cacheAt = now }
  return cache
})
