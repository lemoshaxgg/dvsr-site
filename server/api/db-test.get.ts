export default defineEventHandler(async () => {
  const { Pool } = await import('pg')
  const pool = new Pool({
    host: process.env.RF_DB_HOST,
    port: Number(process.env.RF_DB_PORT || 5432),
    database: process.env.RF_DB_NAME,
    user: process.env.RF_DB_USER,
    password: process.env.RF_DB_PASSWORD,
    connectionTimeoutMillis: 5000,
    ssl: { rejectUnauthorized: false },
  })
  try {
    const { rows } = await pool.query('SELECT NOW() as time')
    await pool.end()
    return { ok: true, time: rows[0].time, env: {
      host: process.env.RF_DB_HOST || 'NOT SET',
      port: process.env.RF_DB_PORT || 'NOT SET',
      name: process.env.RF_DB_NAME || 'NOT SET',
      user: process.env.RF_DB_USER || 'NOT SET',
      password: process.env.RF_DB_PASSWORD ? '***SET***' : 'NOT SET',
    }}
  } catch (e: any) {
    await pool.end().catch(() => {})
    return { ok: false, error: e?.message, env: {
      host: process.env.RF_DB_HOST || 'NOT SET',
      port: process.env.RF_DB_PORT || 'NOT SET',
      name: process.env.RF_DB_NAME || 'NOT SET',
      user: process.env.RF_DB_USER || 'NOT SET',
      password: process.env.RF_DB_PASSWORD ? '***SET***' : 'NOT SET',
    }}
  }
})