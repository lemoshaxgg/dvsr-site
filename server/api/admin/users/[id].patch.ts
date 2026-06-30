import { updateUser, getUserById } from '~/server/utils/rfdb'
import { hashPassword } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = (await readBody(event)) || {}
  const me = event.context.adminUser as { id: number; role: string } | undefined

  const target = await getUserById(id)
  if (!target) throw createError({ statusCode: 404, message: 'Сотрудник не найден' })

  const fields: { name?: string; pass_hash?: string; role?: string; is_active?: boolean } = {}

  if (body.name !== undefined) fields.name = String(body.name).trim().slice(0, 100)
  if (body.role !== undefined) fields.role = body.role === 'admin' ? 'admin' : 'manager'
  if (body.is_active !== undefined) fields.is_active = !!body.is_active
  if (body.password) {
    if (String(body.password).length < 6) throw createError({ statusCode: 400, message: 'Пароль минимум 6 символов' })
    fields.pass_hash = hashPassword(String(body.password))
  }

  // Нельзя отключить или разжаловать самого себя (чтобы не потерять доступ)
  if (me && me.id === id) {
    if (fields.is_active === false) throw createError({ statusCode: 400, message: 'Нельзя отключить свой аккаунт' })
    if (fields.role === 'manager') throw createError({ statusCode: 400, message: 'Нельзя снять с себя роль владельца' })
  }

  await updateUser(id, fields)
  return { ok: true }
})