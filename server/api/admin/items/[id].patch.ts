import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const itemId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event) || {}
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  const payload = {
    item_id: itemId,
    category: body.category,
    sub: body.sub,
    title: body.title,
    description: body.description,
    unit: body.unit,
    photo: body.photo,
    is_hidden: body.is_hidden ?? false,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('catalog_cms').upsert(payload, { onConflict: 'item_id' })
  if (error) throw createError({ statusCode: 500, message: error.message })
  return { ok: true }
})