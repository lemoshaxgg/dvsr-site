import { getCookie } from 'h3'
import { getRfPool, addLeadEvent, getUserById } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'

const STAGE_LABELS: Record<string, string> = {
  new: 'Новая', contacted: 'Связались', invoice: 'Счёт / КП',
  payment: 'Оплата', won: 'Успешно', lost: 'Отказ',
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = (await readBody(event)) || {}
  const now = new Date().toISOString()
  const pool = getRfPool()

  // автор события (из сессии)
  let author = ''
  try {
    const uid = verifySession(getCookie(event, 'admin_sid') || '')
    if (uid) { const u = await getUserById(uid); author = u?.name || u?.login || '' }
  } catch { /* ignore */ }

  // текущее состояние — для истории изменений
  const { rows } = await pool.query('SELECT stage, status, assignee FROM contacts WHERE id = $1', [id])
  const cur = rows[0] || {}

  const sets: string[] = ['updated_at = $1']
  const params: unknown[] = [now]
  if (body.status   !== undefined) { sets.push(`status = $${params.length + 1}`);   params.push(body.status) }
  if (body.stage    !== undefined) { sets.push(`stage = $${params.length + 1}`);    params.push(body.stage) }
  if (body.assignee !== undefined) { sets.push(`assignee = $${params.length + 1}`); params.push(body.assignee) }
  if (body.notes    !== undefined) { sets.push(`notes = $${params.length + 1}`);    params.push(body.notes) }
  params.push(id)
  await pool.query(`UPDATE contacts SET ${sets.join(', ')} WHERE id = $${params.length}`, params)

  // запись в таймлайн
  try {
    if (body.stage !== undefined && body.stage !== cur.stage) {
      const from = STAGE_LABELS[cur.stage] || cur.stage || '—'
      const to = STAGE_LABELS[body.stage] || body.stage
      await addLeadEvent(id!, 'stage', `Этап: ${from} → ${to}`, author)
    }
    if (body.assignee !== undefined && body.assignee !== cur.assignee) {
      let who = 'снят'
      if (body.assignee) {
        try { const u = await getUserById(Number(body.assignee)); who = u?.name || u?.login || String(body.assignee) }
        catch { who = String(body.assignee) }
      }
      await addLeadEvent(id!, 'assignee', `Ответственный: ${who}`, author)
    }
  } catch { /* история не критична */ }

  return { ok: true }
})
