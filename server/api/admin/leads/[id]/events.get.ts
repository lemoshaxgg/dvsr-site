import { getLeadEvents } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  try {
    return await getLeadEvents(id!)
  } catch {
    return []
  }
})
