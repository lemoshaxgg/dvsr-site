import { getCookie } from 'h3'
import { setTask, addLeadEvent, getUserById, getRfPool } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'

// Отметить задачу выполненной / изменить
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = (await readBody(event)) || {}

  await setTask(id!, { done: body.done, title: body.title, due_at: body.due_at })

  if (body.done === true) {
    try {
      let author = ''
      const uid = verifySession(getCookie(event, 'admin_sid') || '')
      if (uid) { const u = await getUserById(uid); author = u?.name || u?.login || '' }
      const { rows } = await getRfPool().query('SELECT contact_id, title FROM lead_tasks WHERE id = $1', [id])
      if (rows[0]) await addLeadEvent(rows[0].contact_id, 'task', `✔ Задача выполнена: ${rows[0].title}`, author)
    } catch { /* ignore */ }
  }
  return { ok: true }
})
