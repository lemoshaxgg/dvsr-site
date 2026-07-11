import { listOpenTasks } from '~/server/utils/rfdb'

// Все открытые задачи (для счётчика/панели напоминаний)
export default defineEventHandler(async () => {
  try {
    return await listOpenTasks()
  } catch {
    return []
  }
})
