import { getRfPool, ensureCatalogCmsTable } from '~/server/utils/rfdb'
import { items as jsItems, categories as jsCategories, subcategories as jsSubs } from '~/data/catalog.js'

export default defineEventHandler(async () => {
  let overrides: Record<string, unknown>[] = []
  try {
    await ensureCatalogCmsTable()
    const pool = getRfPool()
    const { rows } = await pool.query('SELECT * FROM catalog_cms')
    overrides = rows
  } catch {}

  const overrideMap = new Map(
    overrides.filter((o) => o.item_id).map((o) => [Number(o.item_id), o])
  )

  const merged = jsItems.map((item) => {
    const ov = overrideMap.get(item.id)
    return ov ? { ...item, ...ov, _cms: true } : { ...item, is_hidden: false, _cms: false }
  })

  const custom = overrides.filter((o) => !o.item_id)

  return { items: merged, custom, categories: jsCategories, subcategories: jsSubs }
})