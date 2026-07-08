import Anthropic from '@anthropic-ai/sdk'
import { searchCatalog, categoryLabels } from '~/server/utils/assistantCatalog'

const MODEL = 'claude-haiku-4-5'
const MAX_TURNS = 4 // защита от бесконечного цикла tool-use

const SYSTEM = `Ты — вежливый ИИ-консультант компании ДСР (Дальневосточные Системы Развития), Владивосток. Отвечаешь посетителям сайта dsr-dv.ru.

О компании:
- Поставка и монтаж: заборы 3D, сваи, септики, кабель, металлопрокат, котлы, стройматериалы и оборудование (каталог ~4500 позиций).
- Адрес: г. Владивосток, ул. Русская, д. 17, каб. 704
- Телефон: +7 914 329-29-29
- Email: ooo-dsr@bk.ru
- Telegram: @dsr2025

Категории каталога: ${categoryLabels.join(', ')}.

Правила:
- Отвечай кратко, по-деловому, только про ДСР (товары, услуги, доставка, контакты). На посторонние темы вежливо возвращай к тематике компании.
- Когда спрашивают про конкретный товар, цену или наличие — ОБЯЗАТЕЛЬНО вызывай инструмент search_catalog и отвечай по его результатам. Не выдумывай товары и цены.
- Цены ориентировочные. Если у позиции «уточнить у менеджера» или клиент хочет заказать — предложи оставить заявку или позвонить +7 914 329-29-29.
- Если ничего не нашлось — честно скажи и предложи связаться с менеджером.
- Пиши на русском, без Markdown-разметки (обычный текст).`

const tools: Anthropic.Tool[] = [
  {
    name: 'search_catalog',
    description:
      'Поиск товаров в каталоге ДСР по ключевым словам. Возвращает до 8 совпадений с ценами. Вызывай при любом вопросе про конкретный товар, цену или наличие.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Ключевые слова, например "кабель ВВГ 3х2.5", "септик 2000", "профлист"',
        },
      },
      required: ['query'],
    },
  },
]

export default defineEventHandler(async (event) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw createError({ statusCode: 503, message: 'Ассистент не настроен' })
  }

  const body = (await readBody(event)) || {}
  const history = Array.isArray(body.messages) ? body.messages : []

  // Санитизация истории: только user/assistant + текст, лимиты
  const messages: Anthropic.MessageParam[] = history
    .slice(-12)
    .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    throw createError({ statusCode: 400, message: 'Нужно сообщение пользователя' })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        tools,
        messages,
      })

      if (res.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: res.content })
        const results: Anthropic.ToolResultBlockParam[] = []
        for (const block of res.content) {
          if (block.type === 'tool_use' && block.name === 'search_catalog') {
            const query = String((block.input as any)?.query || '')
            const hits = searchCatalog(query)
            results.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(hits.length ? hits : { note: 'ничего не найдено' }),
            })
          }
        }
        messages.push({ role: 'user', content: results })
        continue
      }

      // Обычный ответ
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim()
      return { reply: text || 'Извините, не удалось сформировать ответ. Позвоните +7 914 329-29-29.' }
    }
    return { reply: 'Уточните запрос, пожалуйста, или свяжитесь с менеджером: +7 914 329-29-29.' }
  } catch (e: any) {
    console.error('assistant error:', e?.message || e)
    throw createError({ statusCode: 500, message: 'Ошибка ассистента' })
  }
})