import { getCookie } from 'h3'
import { getUserById } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  if (!process.env.ADMIN_PASSWORD) throw createError({ statusCode: 503 })

  const userId = verifySession(getCookie(event, 'admin_sid') || '')
  if (!userId) throw createError({ statusCode: 401 })

  const user = await getUserById(userId)
  if (!user || !user.is_active) throw createError({ statusCode: 401 })

  return { id: user.id, login: user.login, name: user.name, role: user.role }
})