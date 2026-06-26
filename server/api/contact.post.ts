import { createClient } from '@supabase/supabase-js'

// Экранирование пользовательского ввода для Telegram parse_mode: HTML
function escapeHtml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

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

defineRouteMeta({
  openAPI: {
    tags: ['Заявки'],
    summary: 'Отправить заявку с сайта',
    description:
      'Сохраняет заявку в Supabase и отправляет уведомление в Telegram. Обязательные поля: name, phone, message.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'phone', 'message'],
            properties: {
              name: { type: 'string', description: 'Имя клиента' },
              phone: { type: 'string', description: 'Телефон' },
              email: { type: 'string', description: 'Email (необязательно)' },
              message: { type: 'string', description: 'Комментарий' },
              item_title: { type: 'string', description: 'Название товара (необязательно)' },
              item_price: { type: 'string', description: 'Цена товара (необязательно)' },
            },
          },
        },
      },
    },
    responses: {
      200: { description: 'Заявка принята' },
      400: { description: 'Не заполнены обязательные поля' },
      429: { description: 'Слишком много заявок' },
      500: { description: 'Ошибка сохранения заявки' },
    },
  },
})

// Примитивный rate-limit по IP. В serverless живёт в пределах тёплого инстанса —
// это не замена WAF, но отсекает простой флуд.
const hits = new Map<string, number[]>()
const WINDOW = 60_000
const MAX_PER_WINDOW = 5

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone, email, message, item_title, item_price, company } = body || {}

  // Honeypot: скрытое поле, которое заполняют только боты — тихо принимаем и выходим
  if (company) return { ok: true }

  if (!name || !phone || !message) {
    throw createError({ statusCode: 400, message: 'Заполните обязательные поля' })
  }

  // Серверная валидация и обрезка длины (клиентский maxlength обходится)
  const nameS  = String(name).trim().slice(0, 100)
  const phoneS = String(phone).trim().slice(0, 20)
  const emailS = email ? String(email).trim().slice(0, 100) : null
  const messageS = String(message).trim().slice(0, 1000)
  const itemTitleS = item_title ? String(item_title).trim().slice(0, 200) : null
  const itemPriceS = item_price ? String(item_price).trim().slice(0, 100) : null

  if (nameS.length < 2) {
    throw createError({ statusCode: 400, message: 'Некорректное имя' })
  }
  if (!/^[\d\s+\-()]{7,20}$/.test(phoneS)) {
    throw createError({ statusCode: 400, message: 'Некорректный телефон' })
  }
  if (emailS && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailS)) {
    throw createError({ statusCode: 400, message: 'Некорректный email' })
  }

  // Rate-limit по IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW)
  if (recent.length >= MAX_PER_WINDOW) {
    throw createError({ statusCode: 429, message: 'Слишком много заявок. Попробуйте позже.' })
  }
  recent.push(now)
  hits.set(ip, recent)

  const row = {
    name: nameS,
    phone: phoneS,
    email: emailS,
    message: messageS,
    item_title: itemTitleS,
    item_price: itemPriceS,
  }

  // Supabase — основное хранилище (Timeweb недоступен с Vercel)
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  try {
    const { error } = await supabase.from('contacts').insert(row)
    if (error) throw error
  } catch (e: any) {
    console.error('Supabase error:', e?.message ?? e)
    throw createError({ statusCode: 500, message: 'Ошибка сохранения заявки' })
  }

  const lines = [
    '🔔 <b>Новая заявка с сайта ДСР</b>',
    '',
    itemTitleS ? `📦 <b>Товар:</b> ${escapeHtml(itemTitleS)}` : null,
    itemPriceS ? `💰 <b>Цена:</b> ${escapeHtml(itemPriceS)}` : null,
    `👤 <b>Клиент:</b> ${escapeHtml(nameS)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(phoneS)}`,
    emailS ? `✉️ <b>Email:</b> ${escapeHtml(emailS)}` : null,
    messageS && messageS !== '—' ? `💬 <b>Комментарий:</b> ${escapeHtml(messageS)}` : null,
  ]

  await sendTelegram(lines.filter(Boolean).join('\n'))

  return { ok: true }
})
