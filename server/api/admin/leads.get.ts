import { isRfDbConfigured, getRfPool, ensureTable } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status && query.status !== 'all' ? String(query.status) : null

  if (!isRfDbConfigured()) return []

  try {
    await ensureTable()
    const pool = getRfPool()
    let sql = 'SELECT * FROM contacts'
    const params: string[] = []
    if (status) { sql += ' WHERE status = $1'; params.push(status) }
    sql += ' ORDER BY created_at DESC'
    const { rows } = await pool.query(sql, params)
    return rows
  } catch (e) {
    console.error('RF DB leads error:', e)
    return []
  }
})