import { createHmac } from 'crypto'

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event) || {}
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) throw createError({ statusCode: 503, message: 'Панель не настроена' })
  if (!password || password !== adminPassword)
    throw createError({ statusCode: 401, message: 'Неверный пароль' })

  const token = createHmac('sha256', adminPassword).update('dsr-admin').digest('hex')

  setCookie(event, 'admin_sid', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return { ok: true }
})
