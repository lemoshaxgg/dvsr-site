import { createClient } from '@supabase/supabase-js'
import { isRfDbConfigured, getRfPool } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) || {}
  const now = new Date().toISOString()

  if (isRfDbConfigured()) {
    const pool = getRfPool()
    const sets: string[] = ['updated_at = $1']
    const params: unknown[] = [now]
    if (body.status !== undefined) { sets.push(`status = $${params.length + 1}`); params.push(body.status) }
    if (body.notes !== undefined) { sets.push(`notes = $${params.length + 1}`); params.push(body.notes) }
    params.push(id)
    await pool.query(`UPDATE contacts SET ${sets.join(', ')} WHERE id = $${params.length}`, params)
    return { ok: true }
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const updates: Record<string, unknown> = { updated_at: now }
  if (body.status !== undefined) updates.status = body.status
  if (body.notes !== undefined) updates.notes = body.notes
  const { error } = await supabase.from('contacts').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, message: error.message })
  return { ok: true }
})