import { getCookie } from 'h3'
import { addTask, addLeadEvent, getUserById } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'

// Создать задачу/напоминание по сделке
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = (await readBody(event)) || {}
  const title = String(body.title || '').trim()
  if (!title) throw createError({ statusCode: 400, message: 'Пустая задача' })

  let author = ''
  try {
    const uid = verifySession(getCookie(event, 'admin_sid') || '')
    if (uid) { const u = await getUserById(uid); author = u?.name || u?.login || '' }
  } catch { /* ignore */ }

  const task = await addTask({ contact_id: id!, title, due_at: body.due_at || null, assignee: body.assignee || null, author })
  try {
    const due = body.due_at ? ' → срок ' + new Date(body.due_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''
    await addLeadEvent(id!, 'task', `Задача: ${title}${due}`, author)
  } catch { /* ignore */ }
  return task
})
