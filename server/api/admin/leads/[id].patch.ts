import { getRfPool } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event) || {}
  const now = new Date().toISOString()

  const pool = getRfPool()
  const sets: string[] = ['updated_at = $1']
  const params: unknown[] = [now]
  if (body.status !== undefined) { sets.push(`status = $${params.length + 1}`); params.push(body.status) }
  if (body.notes !== undefined) { sets.push(`notes = $${params.length + 1}`); params.push(body.notes) }
  params.push(id)
  await pool.query(`UPDATE contacts SET ${sets.join(', ')} WHERE id = $${params.length}`, params)
  return { ok: true }
})