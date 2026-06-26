import { createClient } from '@supabase/supabase-js'
import { isRfDbConfigured, getRfPool } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status && query.status !== 'all' ? String(query.status) : null

  if (isRfDbConfigured()) {
    const pool = getRfPool()
    let sql = 'SELECT * FROM contacts'
    const params: string[] = []
    if (status) { sql += ' WHERE status = $1'; params.push(status) }
    sql += ' ORDER BY created_at DESC'
    const { rows } = await pool.query(sql, params)
    return rows
  }

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  let q = supabase.from('contacts').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw createError({ statusCode: 500, message: error.message })
  return data || []
})