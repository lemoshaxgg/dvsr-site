import { createHmac, timingSafeEqual } from 'crypto'
import { getCookie } from 'h3'

export default defineEventHandler((event) => {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) throw createError({ statusCode: 503 })

  const cookie = getCookie(event, 'admin_sid') || ''
  const expected = createHmac('sha256', adminPassword).update('dsr-admin').digest('hex')

  const a = Buffer.from(cookie.padEnd(expected.length, '\0').slice(0, expected.length))
  const b = Buffer.from(expected)
  const valid = cookie.length === expected.length && timingSafeEqual(a, b)

  if (!valid) throw createError({ statusCode: 401 })
  return { ok: true }
})