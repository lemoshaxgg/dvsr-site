import { getCookie } from 'h3'
import { getUserById } from '~/server/utils/rfdb'
import { verifySession } from '~/server/utils/adminAuth'
import { syncMailToLeads, isMailConfigured } from '~/server/utils/mailImap'

// Ручная проверка почты из CRM: читает новые письма → заводит заявки.
export default defineEventHandler(async (event) => {
  if (!process.env.ADMIN_PASSWORD) throw createError({ statusCode: 503 })

  const userId = verifySession(getCookie(event, 'admin_sid') || '')
  if (!userId) throw createError({ statusCode: 401 })
  const user = await getUserById(userId)
  if (!user || !user.is_active) throw createError({ statusCode: 401 })

  if (!isMailConfigured()) {
    return { ok: false, reason: 'not_configured', imported: 0, checked: 0 }
  }

  return await syncMailToLeads()
})
