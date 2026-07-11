import { isMailConfigured, syncMailToLeads } from '~/server/utils/mailImap'

// Фоновая проверка входящей почты → заявки в CRM. Работает, только если задан IMAP.
// Интервал: MAIL_POLL_MINUTES (по умолчанию 5 мин). Первый прогон через 30с после старта.
export default defineNitroPlugin(() => {
  if (!isMailConfigured()) return
  const minutes = Math.max(1, Number(process.env.MAIL_POLL_MINUTES || 5))

  const run = async () => {
    try {
      const r = await syncMailToLeads()
      if (r.imported) console.log(`[mailPoll] заявок из почты создано: ${r.imported} (проверено ${r.checked})`)
      else if (!r.ok && r.reason && r.reason !== 'busy') console.warn('[mailPoll] ', r.reason)
    } catch (e: any) {
      console.error('[mailPoll] error:', e?.message || e)
    }
  }

  setTimeout(run, 30_000)
  setInterval(run, minutes * 60_000)
  console.log(`[mailPoll] включён: проверка почты каждые ${minutes} мин`)
})
