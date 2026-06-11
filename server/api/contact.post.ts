import { createClient } from '@supabase/supabase-js'

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body: { chat_id: chatId, text, parse_mode: 'HTML' },
    })
  } catch (e) {
    console.error('Telegram error:', e)
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone, email, message, item_title, item_price } = body

  if (!name || !phone || !message) {
    throw createError({ statusCode: 400, message: 'Заполните обязательные поля' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { error } = await supabase
    .from('contacts')
    .insert({
      name,
      phone,
      email: email || null,
      message,
      item_title: item_title || null,
      item_price: item_price || null,
    })

  if (error) {
    console.error('Supabase error:', error)
    throw createError({ statusCode: 500, message: 'Ошибка сохранения заявки' })
  }

  const lines = [
    '🔔 <b>Новая заявка с сайта ДСР</b>',
    '',
    item_title ? `📦 <b>Товар:</b> ${item_title}` : null,
    item_price ? `💰 <b>Цена:</b> ${item_price}` : null,
    `👤 <b>Клиент:</b> ${name}`,
    `📞 <b>Телефон:</b> ${phone}`,
    email ? `✉️ <b>Email:</b> ${email}` : null,
    message && message !== '—' ? `💬 <b>Комментарий:</b> ${message}` : null,
  ]

  await sendTelegram(lines.filter(Boolean).join('\n'))

  return { ok: true }
})
