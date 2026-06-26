import { getRfPool } from '~/server/utils/rfdb'

export default defineEventHandler(async () => {
  const env = {
    RF_DB_HOST: process.env.RF_DB_HOST || 'NOT SET',
    RF_DB_PORT: process.env.RF_DB_PORT || 'NOT SET',
    RF_DB_NAME: process.env.RF_DB_NAME || 'NOT SET',
    RF_DB_USER: process.env.RF_DB_USER || 'NOT SET',
    RF_DB_PASSWORD: process.env.RF_DB_PASSWORD ? `SET (${process.env.RF_DB_PASSWORD.length} chars)` : 'NOT SET',
  }

  try {
    const pool = getRfPool()
    const { rows } = await pool.query('SELECT NOW() as time')
    return { ok: true, time: rows[0].time, env }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e), env }
  }
})