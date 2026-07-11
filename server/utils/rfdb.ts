import { Pool } from 'pg'
import { hashPassword } from './adminAuth'

// Подключение к РФ-Postgres (Timeweb Cloud, 152-ФЗ).
// ENV (отдельные переменные, без URL-кодирования пароля):
//   RF_DB_HOST, RF_DB_PORT, RF_DB_NAME, RF_DB_USER, RF_DB_PASSWORD

let pool: Pool | null = null

export function isRfDbConfigured(): boolean {
  return !!process.env.RF_DB_HOST
}

export function getRfPool(): Pool { return getPool() }

function getPool(): Pool {
  if (pool) return pool
  pool = new Pool({
    host: process.env.RF_DB_HOST,
    port: Number(process.env.RF_DB_PORT || 5432),
    database: process.env.RF_DB_NAME,
    user: process.env.RF_DB_USER,
    password: process.env.RF_DB_PASSWORD,
    max: 3,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    ssl: false,
  })
  return pool
}

let tableReady = false
let cmsTableReady = false

export async function ensureTable(): Promise<void> {
  if (tableReady) return
  const db = getPool()
  await db.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id          BIGSERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT,
      message     TEXT,
      item_title  TEXT,
      item_price  TEXT,
      status      TEXT NOT NULL DEFAULT 'new',
      notes       TEXT NOT NULL DEFAULT '',
      updated_at  TIMESTAMPTZ,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS item_title TEXT`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS item_price TEXT`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT ''`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'site'`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS ext_id TEXT`)
  await db.query(`CREATE UNIQUE INDEX IF NOT EXISTS contacts_ext_id_uidx ON contacts (ext_id) WHERE ext_id IS NOT NULL`)
  tableReady = true
}

// Какие ext_id (Message-ID писем) уже импортированы — чтобы не заводить дубли заявок
export async function existingExtIds(ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set()
  await ensureTable()
  const { rows } = await getPool().query(
    'SELECT ext_id FROM contacts WHERE ext_id = ANY($1)', [ids],
  )
  return new Set(rows.map((r: any) => r.ext_id))
}

// Вставка заявки из письма (с источником и защитой от дублей по ext_id)
export async function insertLeadDedup(
  row: ContactRow & { source?: string; ext_id?: string | null },
): Promise<boolean> {
  await ensureTable()
  if (row.ext_id) {
    const { rows } = await getPool().query('SELECT 1 FROM contacts WHERE ext_id = $1 LIMIT 1', [row.ext_id])
    if (rows.length) return false
  }
  await getPool().query(
    `INSERT INTO contacts (name, phone, email, message, item_title, item_price, source, ext_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [row.name, row.phone, row.email, row.message, row.item_title, row.item_price, row.source || 'site', row.ext_id || null],
  )
  return true
}

export async function ensureCatalogCmsTable(): Promise<void> {
  if (cmsTableReady) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS catalog_cms (
      id          BIGSERIAL PRIMARY KEY,
      item_id     INTEGER UNIQUE,
      category    TEXT,
      sub         TEXT,
      title       TEXT,
      description TEXT,
      unit        TEXT,
      photo       TEXT,
      is_hidden   BOOLEAN NOT NULL DEFAULT false,
      updated_at  TIMESTAMPTZ
    )
  `)
  cmsTableReady = true
}

export interface ContactRow {
  name: string
  phone: string
  email: string | null
  message: string | null
  item_title: string | null
  item_price: string | null
}

export async function insertContactRf(row: ContactRow): Promise<void> {
  await ensureTable()
  await getPool().query(
    `INSERT INTO contacts (name, phone, email, message, item_title, item_price)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [row.name, row.phone, row.email, row.message, row.item_title, row.item_price],
  )
}

// ── Аккаунты администраторов и менеджеров ──
let usersTableReady = false

export interface AdminUser {
  id: number
  login: string
  name: string
  pass_hash: string
  role: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function ensureAdminUsersTable(): Promise<void> {
  if (usersTableReady) return
  const db = getPool()
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id         BIGSERIAL PRIMARY KEY,
      login      TEXT UNIQUE NOT NULL,
      name       TEXT NOT NULL DEFAULT '',
      pass_hash  TEXT NOT NULL,
      role       TEXT NOT NULL DEFAULT 'manager',
      is_active  BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ
    )
  `)
  // Bootstrap: если нет ни одного владельца — создать из ADMIN_PASSWORD (логин admin)
  const adminPass = process.env.ADMIN_PASSWORD
  if (adminPass) {
    const { rows } = await db.query(`SELECT COUNT(*)::int AS n FROM admin_users WHERE role = 'admin'`)
    if (rows[0].n === 0) {
      await db.query(
        `INSERT INTO admin_users (login, name, pass_hash, role, is_active)
         VALUES ($1, $2, $3, 'admin', true)
         ON CONFLICT (login) DO NOTHING`,
        ['admin', 'Владелец', hashPassword(adminPass)],
      )
    }
  }
  usersTableReady = true
}

export async function getUserByLogin(login: string): Promise<AdminUser | null> {
  await ensureAdminUsersTable()
  const { rows } = await getPool().query('SELECT * FROM admin_users WHERE login = $1', [login])
  return rows[0] || null
}

export async function getUserById(id: number): Promise<AdminUser | null> {
  await ensureAdminUsersTable()
  const { rows } = await getPool().query('SELECT * FROM admin_users WHERE id = $1', [id])
  return rows[0] || null
}

export async function listUsers(): Promise<AdminUser[]> {
  await ensureAdminUsersTable()
  const { rows } = await getPool().query(
    'SELECT id, login, name, role, is_active, created_at FROM admin_users ORDER BY created_at ASC',
  )
  return rows
}

export async function createUser(u: { login: string; name: string; pass_hash: string; role: string }): Promise<void> {
  await ensureAdminUsersTable()
  await getPool().query(
    `INSERT INTO admin_users (login, name, pass_hash, role, is_active)
     VALUES ($1, $2, $3, $4, true)`,
    [u.login, u.name, u.pass_hash, u.role],
  )
}

export async function updateUser(
  id: number,
  fields: { name?: string; pass_hash?: string; role?: string; is_active?: boolean },
): Promise<void> {
  await ensureAdminUsersTable()
  const sets: string[] = []
  const vals: unknown[] = []
  let i = 1
  if (fields.name !== undefined)      { sets.push(`name = $${i++}`); vals.push(fields.name) }
  if (fields.pass_hash !== undefined) { sets.push(`pass_hash = $${i++}`); vals.push(fields.pass_hash) }
  if (fields.role !== undefined)      { sets.push(`role = $${i++}`); vals.push(fields.role) }
  if (fields.is_active !== undefined) { sets.push(`is_active = $${i++}`); vals.push(fields.is_active) }
  if (!sets.length) return
  sets.push(`updated_at = now()`)
  vals.push(id)
  await getPool().query(`UPDATE admin_users SET ${sets.join(', ')} WHERE id = $${i}`, vals)
}

export async function deleteUser(id: number): Promise<void> {
  await ensureAdminUsersTable()
  await getPool().query('DELETE FROM admin_users WHERE id = $1', [id])
}
