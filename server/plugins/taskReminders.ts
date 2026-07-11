import { isRfDbConfigured, dueTasksToNotify, markTaskNotified } from '~/server/utils/rfdb'

// Напоминания по задачам: раз в минуту ищем наступившие сроки → Telegram.
export default defineNitroPlugin(() => {
  if (!isRfDbConfigured()) return
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const run = async () => {
    try {
      const due = await dueTasksToNotify()
      for (const t of due) {
        if (token && chatId) {
          const text = [
            '⏰ <b>Напоминание по сделке</b>',
            '',
            `📋 <b>${esc(t.title)}</b>`,
            t.contact_name ? `👤 Клиент: ${esc(t.contact_name)}` : null,
            t.contact_phone && t.contact_phone !== '—' ? `📞 ${esc(t.contact_phone)}` : null,
          ].filter(Boolean).join('\n')
          try {
            await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST', body: { chat_id: chatId, text, parse_mode: 'HTML' },
            })
          } catch { /* ignore */ }
        }
        await markTaskNotified(t.id)
      }
    } catch (e: any) {
      console.error('[taskReminders] error:', e?.message || e)
    }
  }

  setTimeout(run, 45_000)
  setInterval(run, 60_000)
})
