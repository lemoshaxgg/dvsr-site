import { listTasksForLead } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  try {
    return await listTasksForLead(id!)
  } catch {
    return []
  }
})
