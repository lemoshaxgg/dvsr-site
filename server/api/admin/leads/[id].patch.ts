import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) || {}
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.status !== undefined) updates.status = body.status
  if (body.notes !== undefined) updates.notes = body.notes

  const { error } = await supabase.from('contacts').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, message: error.message })
  return { ok: true }
})