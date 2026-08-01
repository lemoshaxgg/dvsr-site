import { isMailConfigured, syncMailToLeads } from '~/server/utils/mailImap'

// Фоновая проверка входящей почты → заявки в CRM. Работает, только если задан IMAP.
// Интервал: MAIL_POLL_MINUTES (по умолчанию 5 мин). Первый прогон через 30с после старта.
export default defineNitroPlugin(() => {
  // ⛔ ВРЕМЕННО ВЫКЛЮЧЕН. Поллер тянул из почты письма ЦЕЛИКОМ (с вложениями) и парсил
  // их — на маленьком тарифе это раздувало память, контейнер убивало по OOM → крэш-петля
  // → сайт лежал. Плюс он всё равно не пускается на Mail.ru (протух пароль внешнего
  // приложения). Включить обратно после починки почты: задать env MAIL_POLL_ENABLED=1.
  if (process.env.MAIL_POLL_ENABLED !== '1') {
    console.log('[mailPoll] выключен (для включения задайте env MAIL_POLL_ENABLED=1)')
    return
  }
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
