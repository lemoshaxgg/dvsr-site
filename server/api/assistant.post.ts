import { searchCatalog, categoryLabels } from '~/server/utils/assistantCatalog'

// YandexGPT (Yandex Cloud Foundation Models). Ключи в env Timeweb:
//   YANDEX_API_KEY   — API-ключ сервисного аккаунта
//   YANDEX_FOLDER_ID — идентификатор каталога Yandex Cloud
const GPT_MODEL = process.env.YANDEX_GPT_MODEL || 'yandexgpt-lite' // или 'yandexgpt' (умнее, дороже)
const ENDPOINT = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'

const SYSTEM_BASE = `Ты — вежливый ИИ-консультант компании ДСР (Дальневосточные Системы Развития), Владивосток, сайт dsr-dv.ru.

О компании:
- Поставка и монтаж: заборы 3D, сваи, септики, кабель, металлопрокат, котлы, стройматериалы и оборудование (каталог ~4500 позиций).
- Адрес: г. Владивосток, ул. Русская, д. 17, каб. 704
- Телефон: +7 914 329-29-29
- Email: ooo-dsr@bk.ru
- Telegram: @dsr2025

Категории каталога: ${categoryLabels.join(', ')}.

Правила:
- Отвечай кратко, по-деловому, только про ДСР (товары, услуги, доставка, контакты). На посторонние темы вежливо возвращай к тематике компании.
- Про товары, цены и наличие отвечай ТОЛЬКО по блоку «Товары из каталога» ниже, если он есть. Не выдумывай товары и цены.
- Цены ориентировочные. Если цену нужно уточнить или клиент хочет заказать — предложи оставить заявку или позвонить +7 914 329-29-29.
- Если подходящих товаров нет — честно скажи и предложи связаться с менеджером.
- Пиши на русском обычным текстом, без Markdown.`

export default defineEventHandler(async (event) => {
  const folder = process.env.YANDEX_FOLDER_ID
  const apiKey = process.env.YANDEX_API_KEY
  if (!folder || !apiKey) {
    throw createError({ statusCode: 503, message: 'Ассистент не настроен' })
  }

  const body = (await readBody(event)) || {}
  const history = Array.isArray(body.messages) ? body.messages : []

  // Санитизация истории: только user/assistant + текст, лимиты
  let msgs = history
    .slice(-12)
    .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m: any) => ({ role: m.role as 'user' | 'assistant', text: String(m.content).slice(0, 2000) }))

  // YandexGPT ожидает начало диалога с пользователя — срезаем приветствие ассистента
  while (msgs.length && msgs[0].role === 'assistant') msgs = msgs.slice(1)

  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') {
    throw createError({ statusCode: 400, message: 'Нужно сообщение пользователя' })
  }

  // Поиск товаров по последнему сообщению и подкладывание результатов модели
  const lastUser = msgs[msgs.length - 1].text
  const hits = searchCatalog(lastUser, 8)
  const context = hits.length
    ? '\n\nТовары из каталога по запросу пользователя (используй эти данные для ответа о наличии и ценах):\n' +
      hits.map((h) => `— ${h.title} — ${h.price}${h.unit ? ' / ' + h.unit : ''} (${h.category})`).join('\n')
    : ''

  const payload = {
    modelUri: `gpt://${folder}/${GPT_MODEL}/latest`,
    completionOptions: { stream: false, temperature: 0.3, maxTokens: '1000' },
    messages: [{ role: 'system', text: SYSTEM_BASE + context }, ...msgs],
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Api-Key ${apiKey}` },
      body: JSON.stringify(payload),
    })
    const raw = await res.text()
    if (!res.ok) {
      console.error('yandexgpt error:', res.status, raw.slice(0, 400))
      throw createError({ statusCode: 500, message: 'Ошибка ассистента' })
    }
    const data: any = JSON.parse(raw)
    const reply = data?.result?.alternatives?.[0]?.message?.text?.trim()
    return { reply: reply || 'Извините, не удалось сформировать ответ. Позвоните +7 914 329-29-29.' }
  } catch (e: any) {
    if (e?.statusCode) throw e
    console.error('assistant error:', e?.message || e)
    throw createError({ statusCode: 500, message: 'Ошибка ассистента' })
  }
})