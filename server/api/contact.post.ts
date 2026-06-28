import { insertContactRf, ensureTable } from '~/server/utils/rfdb'

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
      'Сохраняет заявку в базу данных и отправляет уведомление в Telegram. Обязательные поля: name, phone, message.',
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

const hits = new Map<string, number[]>()
const WINDOW = 60_000
const MAX_PER_WINDOW = 5

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone, email, message, item_title, item_price, company } = body || {}

  if (company) return { ok: true }

  if (!name || !phone || !message) {
    throw createError({ statusCode: 400, message: 'Заполните обязательные поля' })
  }

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

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW)
  if (recent.length >= MAX_PER_WINDOW) {
    throw createError({ statusCode: 429, message: 'Слишком много заявок. Попробуйте позже.' })
  }
  recent.push(now)
  hits.set(ip, recent)

  try {
    await ensureTable()
    await insertContactRf({ name: nameS, phone: phoneS, email: emailS, message: messageS, item_title: itemTitleS, item_price: itemPriceS })
  } catch (e: any) {
    const errMsg = e?.message || (typeof e === 'string' ? e : JSON.stringify(e)) || 'unknown'
    console.error('DB error:', errMsg)
    throw createError({ statusCode: 500, message: errMsg })
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