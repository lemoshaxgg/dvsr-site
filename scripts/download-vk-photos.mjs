/**
 * Скачивает фото товаров vostokkabel-vl.ru для нашего каталога.
 * Алгоритм:
 * 1. Загружает все 4 sitemap-product-*.xml → список URL страниц
 * 2. Для каждого vk_ товара из нашего каталога ищет URL по артикулу в slug
 * 3. Открывает страницу товара, достаёт URL фото
 * 4. Скачивает фото в public/catalog/products/{id}.jpg
 */

import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')
const photosDir = join(root, 'public', 'catalog', 'products')

const DELAY = 800   // мс между запросами
const BASE = 'https://vostokkabel-vl.ru'
const CONCURRENCY = 3

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DSR-bot/1.0)' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DSR-bot/1.0)' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const ws = createWriteStream(dest)
  await pipeline(res.body, ws)
}

// --- 1. Загрузить все URL из sitemaps ---
async function getAllProductUrls() {
  const urls = []
  for (let i = 1; i <= 4; i++) {
    console.log(`📄 Загружаю sitemap-product-${i}.xml...`)
    try {
      const xml = await fetchText(`${BASE}/sitemap-product-${i}.xml`)
      const matches = xml.matchAll(/<loc><!\[CDATA\[(https:\/\/vostokkabel-vl\.ru\/[^\]]+)\]\]><\/loc>/g)
      for (const m of matches) urls.push(m[1])
      await sleep(500)
    } catch (e) {
      console.warn(`  ⚠️  sitemap ${i}: ${e.message}`)
    }
  }
  console.log(`✅ Всего URL в sitemap: ${urls.length}`)
  return urls
}

// --- 2. Извлечь URL фото со страницы товара ---
async function getImageUrl(pageUrl) {
  const html = await fetchText(pageUrl)
  // Ищем og:image или первую картинку /image/cache/catalog/
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)
  if (og) return og[1]
  const img = html.match(/\/image\/cache\/catalog\/[^"'\s]+\.jpg/)
  if (img) return BASE + img[0]
  return null
}

// --- 3. Главная логика ---
async function main() {
  const { items } = await import('../data/catalog.js')

  const vkItems = items.filter(i =>
    typeof i.category === 'string' && i.category.startsWith('vk_') && i.art
  )
  console.log(`📦 vk_ товаров с артикулом: ${vkItems.length}`)

  // Фото уже скачанные — пропускаем
  const toProcess = vkItems.filter(i => !existsSync(join(photosDir, `${i.id}.jpg`)))
  console.log(`🔍 Нужно скачать фото: ${toProcess.length}`)

  if (toProcess.length === 0) {
    console.log('✅ Все фото уже есть!')
    return
  }

  // Загружаем все URL из sitemap
  const allUrls = await getAllProductUrls()

  // Для каждого товара — ищем URL по артикулу в slug
  let found = 0, notFound = 0, errors = 0

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i]
    const artStr = String(item.art).toLowerCase().replace(/\s+/g, '-')

    // Ищем URL где слаг содержит артикул
    const pageUrl = allUrls.find(u => {
      const slug = u.split('/').pop().toLowerCase()
      return slug.includes(artStr) || slug.includes(artStr.replace(/-/g, ''))
    })

    if (!pageUrl) {
      // Пробуем по части названия
      const titleWords = item.title.toLowerCase().split(/\s+/).slice(0, 3).join('-')
        .replace(/[^a-zа-яё0-9-]/gi, '')
      notFound++
      if (notFound <= 5) console.log(`  ❓ [${item.id}] не найден: ${item.art} | ${item.title.substring(0,40)}`)
      continue
    }

    try {
      await sleep(DELAY)
      let imgUrl = null
      try { imgUrl = await getImageUrl(pageUrl) } catch {}
      if (!imgUrl) {
        errors++
        continue
      }

      const dest = join(photosDir, `${item.id}.jpg`)
      try {
        await downloadFile(imgUrl.startsWith('http') ? imgUrl : BASE + imgUrl, dest)
      } catch {
        errors++
        continue
      }
      found++
      if (found % 20 === 0 || found <= 3) {
        console.log(`  ✅ [${i+1}/${toProcess.length}] ${item.id}.jpg — ${item.title.substring(0,35)}`)
      }
    } catch (e) {
      errors++
    }
  }

  console.log(`\n📊 Итого:`)
  console.log(`  ✅ Скачано: ${found}`)
  console.log(`  ❓ Не найдено: ${notFound}`)
  console.log(`  ❌ Ошибок: ${errors}`)
}

main().catch(console.error)