import { getRfPool } from '~/server/utils/rfdb'

export default defineEventHandler(async () => {
  const pool = getRfPool()
  const results: Record<string, unknown> = {}

  try {
    const { rows } = await pool.query('SELECT NOW() as time')
    results.connect = 'OK: ' + rows[0].time
  } catch (e: any) {
    results.connect = 'ERR: ' + e.message
    return { results }
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id         BIGSERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        phone      TEXT NOT NULL,
        email      TEXT,
        message    TEXT,
        item_title TEXT,
        item_price TEXT,
        status     TEXT NOT NULL DEFAULT 'new',
        notes      TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    results.create_table = 'OK'
  } catch (e: any) {
    results.create_table = 'ERR: ' + e.message
  }

  try {
    await pool.query(
      `INSERT INTO contacts (name, phone, email, message) VALUES ($1,$2,$3,$4)`,
      ['test', '+70000000000', null, 'db-test']
    )
    results.insert = 'OK'
  } catch (e: any) {
    results.insert = 'ERR: ' + e.message
  }

  return { results }
})