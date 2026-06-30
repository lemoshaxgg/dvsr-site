import { getUserByLogin } from '~/server/utils/rfdb'
import { verifyPassword, signSession } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { login, password } = (await readBody(event)) || {}

  if (!process.env.ADMIN_PASSWORD) throw createError({ statusCode: 503, message: 'Панель не настроена' })
  if (!login || !password) throw createError({ statusCode: 400, message: 'Введите логин и пароль' })

  const user = await getUserByLogin(String(login).trim().toLowerCase())
  if (!user || !verifyPassword(String(password), user.pass_hash)) {
    throw createError({ statusCode: 401, message: 'Неверный логин или пароль' })
  }
  if (!user.is_active) {
    throw createError({ statusCode: 403, message: 'Доступ отключён. Обратитесь к администратору.' })
  }

  setCookie(event, 'admin_sid', signSession(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return { ok: true, role: user.role, name: user.name }
})