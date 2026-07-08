import { getRfPool } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const me = event.context.adminUser as { role: string } | undefined
  if (!me || me.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Удалять заявки может только владелец' })
  }

  const id = getRouterParam(event, 'id')
  const pool = getRfPool()
  await pool.query('DELETE FROM contacts WHERE id = $1', [id])
  return { ok: true }
})