import { createClient } from '@supabase/supabase-js'
import { items as jsItems, categories as jsCategories, subcategories as jsSubs } from '~/data/catalog.js'

export default defineEventHandler(async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  // Load CMS overrides/additions (table may not exist yet — handle gracefully)
  let overrides: Record<string, unknown>[] = []
  try {
    const { data } = await supabase.from('catalog_cms').select('*')
    overrides = data || []
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