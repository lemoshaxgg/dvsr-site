import { getCookie } from 'h3'
import { addLeadEvent, getUserById } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'

// Добавить заметку в историю сделки
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = (await readBody(event)) || {}
  const text = String(body.text || '').trim()
  if (!text) throw createError({ statusCode: 400, message: 'Пустая заметка' })

  let author = ''
  try {
    const uid = verifySession(getCookie(event, 'admin_sid') || '')
    if (uid) { const u = await getUserById(uid); author = u?.name || u?.login || '' }
  } catch { /* ignore */ }

  await addLeadEvent(id!, 'note', text, author)
  return { ok: true }
})
