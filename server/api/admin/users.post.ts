import { createUser, getUserByLogin } from '~/server/utils/rfdb'
import { hashPassword } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { login, name, password, role } = (await readBody(event)) || {}

  const loginS = String(login || '').trim().toLowerCase()
  const nameS = String(name || '').trim().slice(0, 100)
  const roleS = role === 'admin' ? 'admin' : 'manager'

  if (!/^[a-z0-9_.-]{3,30}$/.test(loginS)) {
    throw createError({ statusCode: 400, message: 'Логин: 3–30 символов, латиница/цифры/._-' })
  }
  if (!password || String(password).length < 6) {
    throw createError({ statusCode: 400, message: 'Пароль минимум 6 символов' })
  }
  if (await getUserByLogin(loginS)) {
    throw createError({ statusCode: 409, message: 'Такой логин уже существует' })
  }

  await createUser({ login: loginS, name: nameS || loginS, pass_hash: hashPassword(String(password)), role: roleS })
  return { ok: true }
})