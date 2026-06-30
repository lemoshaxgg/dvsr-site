import { getCookie } from 'h3'
import { getUserById } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'

// Защищает все /api/admin/* кроме /api/admin/auth и /api/admin/me
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/admin/')) return
  if (path === '/api/admin/auth' || path === '/api/admin/me') return

  if (!process.env.ADMIN_PASSWORD) throw createError({ statusCode: 503, message: 'Admin not configured' })

  const userId = verifySession(getCookie(event, 'admin_sid') || '')
  if (!userId) throw createError({ statusCode: 401, message: 'Не авторизован' })

  const user = await getUserById(userId)
  if (!user || !user.is_active) throw createError({ statusCode: 401, message: 'Не авторизован' })

  // Управление сотрудниками — только владелец
  if (path.startsWith('/api/admin/users') && user.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Недостаточно прав' })
  }

  // Доступно дальше в обработчиках
  event.context.adminUser = { id: user.id, login: user.login, name: user.name, role: user.role }
})