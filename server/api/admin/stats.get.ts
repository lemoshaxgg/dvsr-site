import { isRfDbConfigured, getResponseTimeSecs } from '~/server/utils/rfdb'

// Аналитика воронки: время ответа (avg/median) из lead_events за период.
// Остальные метрики (воронка, конверсия, источники, менеджеры, чек) считает
// клиент из уже загруженного списка заявок — здесь только то, что требует БД.
export default defineEventHandler(async (event) => {
  if (!isRfDbConfigured()) return { ok: false, resp: null }
  const q = getQuery(event)
  const days = q.days ? Number(q.days) : null
  const since = days && days > 0 ? new Date(Date.now() - days * 86400000).toISOString() : null
  try {
    const secs = await getResponseTimeSecs(since)
    secs.sort((a, b) => a - b)
    const n = secs.length
    const avgSec = n ? secs.reduce((s, x) => s + x, 0) / n : null
    const medianSec = n ? secs[Math.floor(n / 2)] : null
    return { ok: true, resp: { n, avgSec, medianSec } }
  } catch (e) {
    console.error('stats error:', e)
    return { ok: false, resp: null }
  }
})
