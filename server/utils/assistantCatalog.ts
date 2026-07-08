// Поиск по каталогу для ИИ-ассистента. Загружается один раз на инстанс.
import { items, categories } from '../../data/catalog.js'
import { vkItems, vkCategories } from '../../data/catalog-vostokkabel.js'
import { sigItems, sigCategories } from '../../data/catalog-sig.js'
import { pdItems, pdCategories } from '../../data/catalog-plastdv.js'

interface RawItem {
  id: number
  category?: string
  title?: string
  unit?: string
  art?: string
  basePrice?: number | null
  fixedPrice?: number | null
}

const MARKUP = 1.15
function sellPrice(it: RawItem): number | null {
  if (it.fixedPrice) return Math.round(it.fixedPrice)
  if (it.basePrice) return Math.round((it.basePrice * MARKUP) / 10) * 10
  return null
}

// Справочник category.id -> label
const catMap: Record<string, string> = {}
for (const arr of [categories, vkCategories, sigCategories, pdCategories] as any[]) {
  for (const c of arr || []) if (c && c.id) catMap[c.id] = c.label || c.id
}

interface IndexedItem {
  title: string
  titleLc: string
  category: string
  unit: string
  price: number | null
}

const all: IndexedItem[] = ([] as RawItem[])
  .concat(items as any, vkItems as any, sigItems as any, pdItems as any)
  .map((it) => ({
    title: (it.title || '').trim(),
    titleLc: (it.title || '').toLowerCase(),
    category: catMap[it.category || ''] || it.category || '',
    unit: it.unit || 'шт',
    price: sellPrice(it),
  }))
  .filter((it) => it.title)

// Список категорий (только с товарами) — для системного промпта
export const categoryLabels: string[] = Array.from(
  new Set(all.map((i) => i.category).filter(Boolean)),
).sort()

export interface CatalogHit {
  title: string
  price: string
  unit: string
  category: string
}

// Поиск: считаем сколько слов запроса встретилось в названии
export function searchCatalog(query: string, limit = 8): CatalogHit[] {
  const q = (query || '').toLowerCase().trim()
  const tokens = q.split(/[\s,]+/).filter((t) => t.length >= 2)
  if (!tokens.length) return []

  const scored = all
    .map((it) => {
      let score = 0
      for (const t of tokens) if (it.titleLc.includes(t)) score++
      if (it.titleLc.includes(q)) score += tokens.length // бонус за точную фразу
      return { it, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.it.price ? 1 : 0) - (a.it.price ? 1 : 0))
    .slice(0, limit)

  return scored.map(({ it }) => ({
    title: it.title,
    price: it.price ? `от ${it.price.toLocaleString('ru-RU')} ₽` : 'уточнить у менеджера',
    unit: it.unit,
    category: it.category,
  }))
}