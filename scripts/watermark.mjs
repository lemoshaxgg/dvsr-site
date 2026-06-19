import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_DIR = join(__dirname, '../public')

// Текст водяного знака
const WM_TEXT = '© ДСР'
const WM_FONT_SIZE = 28
const WM_OPACITY = 0.30   // 30% прозрачности

// Генерируем SVG с диагональными повторяющимися надписями
function makeSvgWatermark(w, h) {
  const step = 180   // шаг сетки
  const marks = []

  for (let y = -step; y < h + step; y += step) {
    for (let x = -step; x < w + step; x += step) {
      marks.push(`
        <text
          x="${x}" y="${y}"
          transform="rotate(-35, ${x}, ${y})"
          font-family="Arial, sans-serif"
          font-size="${WM_FONT_SIZE}"
          font-weight="bold"
          fill="white"
          fill-opacity="${WM_OPACITY}"
          stroke="black"
          stroke-width="0.5"
          stroke-opacity="${WM_OPACITY * 0.5}"
          letter-spacing="2"
        >${WM_TEXT}</text>
      `)
    }
  }

  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      ${marks.join('')}
    </svg>
  `)
}

// Рекурсивно собираем все jpg/jpeg/png/webp
async function getImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      files.push(...await getImages(full))
    } else if (/\.(jpe?g|png|webp)$/i.test(e.name)) {
      files.push(full)
    }
  }
  return files
}

async function watermark(filePath) {
  const img = sharp(filePath)
  const { width, height } = await img.metadata()

  const wm = makeSvgWatermark(width, height)

  const outPath = filePath  // перезаписываем оригинал

  await sharp(filePath)
    .composite([{ input: wm, top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toFile(outPath + '.tmp')

  // Заменяем оригинал
  const { rename } = await import('fs/promises')
  await rename(outPath + '.tmp', outPath)

  console.log(`✓ ${basename(filePath)} (${width}×${height})`)
}

const images = await getImages(CATALOG_DIR)
console.log(`Найдено ${images.length} фото, добавляю водяные знаки...\n`)

for (const img of images) {
  try {
    await watermark(img)
  } catch (e) {
    console.error(`✗ ${basename(img)}: ${e.message}`)
  }
}

console.log('\nГотово!')
