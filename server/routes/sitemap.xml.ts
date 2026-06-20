import { items } from '../../data/catalog.js'
import { posts } from '../../data/blog.js'

export default defineEventHandler((event) => {
  const base = 'https://dsr-dv.ru'

  const staticPages = [
    { url: '/',           changefreq: 'weekly',  priority: '1.0' },
    { url: '/catalog',    changefreq: 'daily',   priority: '0.9' },
    { url: '/about',      changefreq: 'monthly', priority: '0.7' },
    { url: '/promotions', changefreq: 'weekly',  priority: '0.8' },
    { url: '/blog',       changefreq: 'weekly',  priority: '0.7' },
    { url: '/privacy',    changefreq: 'yearly',  priority: '0.3' },
  ]

  const catalogPages = items.map(i => ({
    url: `/catalog/${i.id}`,
    changefreq: 'monthly',
    priority: '0.6',
  }))

  const blogPages = posts.map(p => ({
    url: `/blog/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  }))

  const all = [...staticPages, ...catalogPages, ...blogPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url>
    <loc>${base}${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
