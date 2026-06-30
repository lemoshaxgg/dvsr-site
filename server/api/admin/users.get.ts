import { listUsers } from '~/server/utils/rfdb'

export default defineEventHandler(async () => {
  return await listUsers()
})