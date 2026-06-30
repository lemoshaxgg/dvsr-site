import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto'

// ── Хэширование паролей (scrypt, без внешних зависимостей) ──
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || '').split(':')
  if (!salt || !hash) return false
  const test = scryptSync(password, salt, 64)
  const hashBuf = Buffer.from(hash, 'hex')
  return hashBuf.length === test.length && timingSafeEqual(hashBuf, test)
}

// ── Подпись сессий (cookie admin_sid = "<userId>.<hmac>") ──
function sessionSecret(): string {
  return process.env.ADMIN_PASSWORD || 'dsr-fallback-secret'
}

export function signSession(userId: number): string {
  const sig = createHmac('sha256', sessionSecret()).update(`u:${userId}`).digest('hex')
  return `${userId}.${sig}`
}

// Возвращает userId если подпись валидна, иначе null
export function verifySession(token: string): number | null {
  if (!token) return null
  const idx = token.lastIndexOf('.')
  if (idx < 0) return null
  const uid = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = createHmac('sha256', sessionSecret()).update(`u:${uid}`).digest('hex')
  const a = Buffer.from(sig.padEnd(expected.length, '\0').slice(0, expected.length))
  const b = Buffer.from(expected)
  if (sig.length !== expected.length || !timingSafeEqual(a, b)) return null
  const n = Number(uid)
  return Number.isInteger(n) && n > 0 ? n : null
}