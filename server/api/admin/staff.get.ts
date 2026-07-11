import { listUsers } from '~/server/utils/rfdb'

// Список сотрудников для назначения ответственного (минимум полей).
export default defineEventHandler(async () => {
  try {
    const users = await listUsers()
    return users
      .filter((u: any) => u.is_active)
      .map((u: any) => ({ id: u.id, name: u.name || u.login, login: u.login, role: u.role }))
  } catch {
    return []
  }
})
