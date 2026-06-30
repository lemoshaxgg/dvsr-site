import { deleteUser, getUserById } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const me = event.context.adminUser as { id: number } | undefined

  if (me && me.id === id) throw createError({ statusCode: 400, message: 'Нельзя удалить свой аккаунт' })

  const target = await getUserById(id)
  if (!target) throw createError({ statusCode: 404, message: 'Сотрудник не найден' })

  await deleteUser(id)
  return { ok: true }
})