import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { insertLeadDedup, existingSeenExtIds, markMailSeen, deleteLeadByExtId } from './rfdb'

// Чтение входящей почты по IMAP и автосоздание заявок в CRM.
// ENV: MAIL_IMAP_USER, MAIL_IMAP_PASS (пароль для внешних приложений!),
//      MAIL_IMAP_HOST (по умолч. imap.mail.ru), MAIL_IMAP_PORT (993).
// Парсинг письма в заявку — через YandexGPT (те же YANDEX_API_KEY/YANDEX_FOLDER_ID).

const HOST = process.env.MAIL_IMAP_HOST || 'imap.mail.ru'
const PORT = Number(process.env.MAIL_IMAP_PORT || 993)
const SCAN_LAST = 40   // сколько последних писем просматривать за проход
const MAX_NEW = 15     // не больше стольких новых заявок за проход (лимит GPT)

export function isMailConfigured(): boolean {
  return !!(process.env.MAIL_IMAP_USER && process.env.MAIL_IMAP_PASS)
}

const PHONE_RE = /(?:\+7|8)[\s\-()]*\d(?:[\s\-()]*\d){9}/

// Эвристика спама/не-заявки (фолбэк, если ИИ недоступен)
const SPAM_RE = /\b(seo|сео|продвижени|раскрутк|реклам|рассылк|подписк|newsletter|unsubscribe|отпис|вебинар|инвестиц|казино|заработок|marketing|promo|уведомлени)\b/i
function looksLikeSpam(subject: string, fromEmail: string, text: string): boolean {
  if (/noreply|no-reply|no_reply|donotreply|do-not-reply|mailer-daemon|postmaster|notif|newsletter|team@|news@|robot@|support@mail|@farpost/i.test(fromEmail)) return true
  return SPAM_RE.test(subject + ' ' + text.slice(0, 600))
}

// ── ИИ-фильтр: заявка или мусор + разбор в поля заявки (YandexGPT) ──
async function parseEmail(subject: string, text: string, fromName: string, fromEmail: string) {
  const fallback = {
    is_lead: !looksLikeSpam(subject, fromEmail, text),
    name: fromName || (fromEmail.split('@')[0] || 'Клиент'),
    phone: (text.match(PHONE_RE)?.[0] || '').trim(),
    message: ((subject ? subject + '. ' : '') + text).slice(0, 1000).trim() || subject || '(письмо без текста)',
  }
  const folder = process.env.YANDEX_FOLDER_ID
  const apiKey = process.env.YANDEX_API_KEY
  if (!folder || !apiKey) return fallback

  const prompt =
    'Ты — фильтр входящей почты строительной компании ДСР (Владивосток: стройматериалы, заборы, септики, кабель, оборудование, услуги). ' +
    'Реши, это ЗАЯВКА/обращение потенциального КЛИЕНТА (запрос цены, заказ, вопрос о товаре/услуге, желание купить/сотрудничать как покупатель) — или НЕТ. ' +
    'НЕ заявка: спам, рекламные предложения чужих услуг (SEO, продвижение сайта, реклама), рассылки/новости, авто-уведомления сервисов (Farpost, Mail.ru, соцсети, банки), системные письма. ' +
    'Верни СТРОГО JSON без пояснений и markdown: {"is_lead":true или false,"name":"имя или пусто","phone":"+7XXXXXXXXXX или пусто","message":"краткая суть запроса, 1-3 предложения"}.\n\n' +
    `От: ${fromName} <${fromEmail}>\nТема: ${subject}\nТекст письма:\n${text.slice(0, 3000)}`

  try {
    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Api-Key ${apiKey}` },
      body: JSON.stringify({
        modelUri: `gpt://${folder}/${process.env.YANDEX_GPT_MODEL || 'yandexgpt-lite'}/latest`,
        completionOptions: { stream: false, temperature: 0.1, maxTokens: '500' },
        messages: [{ role: 'user', text: prompt }],
      }),
    })
    if (!res.ok) return fallback
    const data: any = await res.json()
    const reply: string = data?.result?.alternatives?.[0]?.message?.text?.trim() || ''
    const m = reply.replace(/```json|```/g, '').match(/\{[\s\S]*\}/)
    if (!m) return fallback
    const p = JSON.parse(m[0])
    return {
      is_lead: p.is_lead === true || p.is_lead === 'true',
      name: String(p.name || fallback.name).trim().slice(0, 100) || fallback.name,
      phone: String(p.phone || fallback.phone).trim().slice(0, 20),
      message: String(p.message || fallback.message).trim().slice(0, 1000) || fallback.message,
    }
  } catch {
    return fallback
  }
}

async function notifyTelegram(name: string, phone: string, email: string, message: string, subject: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = [
    '📧 <b>Новая заявка из ПОЧТЫ</b>',
    '',
    subject ? `📨 <b>Тема:</b> ${esc(subject)}` : null,
    `👤 <b>Клиент:</b> ${esc(name)}`,
    phone && phone !== '—' ? `📞 <b>Телефон:</b> ${esc(phone)}` : null,
    email ? `✉️ <b>Email:</b> ${esc(email)}` : null,
    message ? `💬 <b>Запрос:</b> ${esc(message)}` : null,
  ].filter(Boolean)
  try {
    await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body: { chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML' },
    })
  } catch { /* необязательно */ }
}

let running = false

export async function syncMailToLeads(): Promise<{ ok: boolean; checked: number; imported: number; reason?: string }> {
  if (!isMailConfigured()) return { ok: false, checked: 0, imported: 0, reason: 'not_configured' }
  if (running) return { ok: false, checked: 0, imported: 0, reason: 'busy' }
  running = true

  const client = new ImapFlow({
    host: HOST, port: PORT, secure: true,
    auth: { user: process.env.MAIL_IMAP_USER!, pass: process.env.MAIL_IMAP_PASS! },
    logger: false,
  })

  let checked = 0, imported = 0
  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    try {
      const total = (client.mailbox && (client.mailbox as any).exists) || 0
      if (!total) return { ok: true, checked: 0, imported: 0 }
      const from = Math.max(1, total - SCAN_LAST + 1)

      // 1) быстрый проход по конвертам (без тела) — собираем кандидатов
      const cand: { uid: number; extId: string; fromEmail: string; fromName: string; subject: string }[] = []
      for await (const msg of client.fetch(`${from}:*`, { envelope: true, uid: true })) {
        const env: any = msg.envelope || {}
        const addr = env.from?.[0]
        cand.push({
          uid: msg.uid,
          extId: env.messageId || `uid-${msg.uid}`,
          fromEmail: addr?.address || '',
          fromName: addr?.name || '',
          subject: env.subject || '',
        })
      }

      // 2) отсеиваем уже ОБРАБОТАННЫЕ письма (и заявки, и мусор) — по ext_id
      const seen = await existingSeenExtIds(cand.map((c) => c.extId))
      const fresh = cand.filter((c) => !seen.has(c.extId)).slice(-MAX_NEW)

      // 3) для новых — тянем тело, классифицируем через ИИ, заводим ТОЛЬКО заявки
      for (const c of fresh) {
        checked++
        const one: any = await client.fetchOne(String(c.uid), { source: true }, { uid: true })
        if (!one?.source) continue
        const mail = await simpleParser(one.source)
        const text = (mail.text || (mail.html ? String(mail.html).replace(/<[^>]+>/g, ' ') : '') || '')
          .replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim()
        const subject = c.subject || mail.subject || ''
        const lead = await parseEmail(subject, text, c.fromName, c.fromEmail)

        // запомнить письмо как обработанное (чтобы ИИ не переоценивал его повторно)
        await markMailSeen(c.extId, lead.is_lead, subject)
        if (!lead.is_lead) {
          try { await deleteLeadByExtId(c.extId) } catch { /* убрать ранее заведённый спам */ }
          continue // спам / реклама / уведомление — не заявка
        }

        const ok = await insertLeadDedup({
          name: lead.name || c.fromName || 'Клиент',
          phone: lead.phone || '—',
          email: c.fromEmail || null,
          message: lead.message,
          item_title: (subject ? `✉ ${subject}` : '✉ Письмо').slice(0, 200),
          item_price: null,
          source: 'email',
          ext_id: c.extId,
        })
        if (ok) {
          imported++
          await notifyTelegram(lead.name, lead.phone, c.fromEmail, lead.message, subject)
        }
      }
    } finally {
      lock.release()
    }
    await client.logout()
    return { ok: true, checked, imported }
  } catch (e: any) {
    // Собираем максимально информативную причину (ответ сервера Mail.ru)
    const detail = [
      e?.serverResponseCode,
      e?.responseText,
      e?.authenticationFailed ? 'AUTHENTICATIONFAILED' : null,
      e?.code,
      e?.message,
    ].filter(Boolean).join(' | ')
    console.error('mail sync error:', detail)
    try { await client.logout() } catch { /* ignore */ }
    return { ok: false, checked, imported, reason: detail || 'error' }
  } finally {
    running = false
  }
}
