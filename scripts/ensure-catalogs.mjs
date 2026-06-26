import { existsSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')

const stubs = {
  'catalog-vostokkabel.js': `export const vkCategories = []
export const vkSubcategories = {}
export const vkItems = []
`,
  'catalog-plastdv.js': `export const pdCategories = []
export const pdSubcategories = {}
export const pdItems = []
`,
}

for (const [file, content] of Object.entries(stubs)) {
  const p = join(root, file)
  if (!existsSync(p)) {
    console.log(`⚠️  Создаю заглушку ${file}`)
    writeFileSync(p, content)
  } else {
    console.log(`✓ ${file} найден`)
  }
}