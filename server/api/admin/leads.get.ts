import { createClient } from '@supabase/supabase-js'
import { isRfDbConfigured, getRfPool, ensureTable } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status && query.status !== 'all' ? String(query.status) : null

  // Всегда тянем из Supabase (там старые заявки)
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  let q = supabase.from('contacts').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data: supaData } = await q
  const supaLeads = supaData || []

  // Если RF база настроена — добавляем новые заявки оттуда
  if (isRfDbConfigured()) {
    try {
      await ensureTable()
      const pool = getRfPool()
      let sql = 'SELECT * FROM contacts'
      const params: string[] = []
      if (status) { sql += ' WHERE status = $1'; params.push(status) }
      sql += ' ORDER BY created_at DESC'
      const { rows: rfLeads } = await pool.query(sql, params)

      // Объединяем: RF-заявки первыми (новые), Supabase-заявки следом
      // Убираем дубликаты по phone+created_at на случай тестовых заявок
      const rfKeys = new Set(rfLeads.map((r: any) => r.phone + '|' + r.created_at))
      const uniqueSupaLeads = supaLeads.filter(l => !rfKeys.has(l.phone + '|' + l.created_at))

      return [...rfLeads, ...uniqueSupaLeads]
    } catch (e) {
      console.error('RF DB leads error:', e)
      // fallback — только Supabase
    }
  }

  return supaLeads
})