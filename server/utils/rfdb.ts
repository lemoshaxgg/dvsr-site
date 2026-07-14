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
  // Воронка (amoCRM-стиль): этап сделки. Мигрируем из старого status.
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS stage TEXT`)
  await db.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS assignee TEXT`)
  await db.query(`
    UPDATE contacts SET stage = CASE
      WHEN status = 'in_work' THEN 'contacted'
      WHEN status = 'done'    THEN 'won'
      WHEN status = 'spam'    THEN 'lost'
      ELSE 'new' END
    WHERE stage IS NULL`)
  tableReady = true
}

// Удалить заявку, заведённую из письма (для автоочистки спама после переклассификации)
export async function deleteLeadByExtId(extId: string): Promise<number> {
  await ensureTable()
  const { rowCount } = await getPool().query(`DELETE FROM contacts WHERE ext_id = $1 AND source = 'email'`, [extId])
  return rowCount || 0
}

// ── Обработанные письма (заявка/не-заявка) — чтобы не гонять спам через ИИ повторно ──
let mailSeenReady = false
export async function ensureMailSeenTable(): Promise<void> {
  if (mailSeenReady) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS mail_seen (
      ext_id     TEXT PRIMARY KEY,
      is_lead    BOOLEAN NOT NULL DEFAULT false,
      subject    TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
  mailSeenReady = true
}
export async function existingSeenExtIds(ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set()
  await ensureMailSeenTable()
  const { rows } = await getPool().query('SELECT ext_id FROM mail_seen WHERE ext_id = ANY($1)', [ids])
  return new Set(rows.map((r: any) => r.ext_id))
}
export async function markMailSeen(extId: string, isLead: boolean, subject: string): Promise<void> {
  await ensureMailSeenTable()
  await getPool().query(
    `INSERT INTO mail_seen (ext_id, is_lead, subject) VALUES ($1, $2, $3) ON CONFLICT (ext_id) DO NOTHING`,
    [extId, isLead, String(subject || '').slice(0, 300)],
  )
}

// ── История сделки (таймлайн: заметки, смены этапа, письма, звонки) ──
let eventsTableReady = false
export async function ensureEventsTable(): Promise<void> {
  if (eventsTableReady) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS lead_events (
      id         BIGSERIAL PRIMARY KEY,
      contact_id BIGINT NOT NULL,
      kind       TEXT NOT NULL,
      text       TEXT NOT NULL DEFAULT '',
      author     TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
  await getPool().query(`CREATE INDEX IF NOT EXISTS lead_events_contact_idx ON lead_events (contact_id)`)
  eventsTableReady = true
}

export async function addLeadEvent(contactId: number | string, kind: string, text: string, author = ''): Promise<void> {
  await ensureEventsTable()
  await getPool().query(
    `INSERT INTO lead_events (contact_id, kind, text, author) VALUES ($1, $2, $3, $4)`,
    [contactId, kind, String(text || '').slice(0, 2000), String(author || '').slice(0, 100)],
  )
}

export async function getLeadEvents(contactId: number | string): Promise<any[]> {
  await ensureEventsTable()
  const { rows } = await getPool().query(
    `SELECT id, kind, text, author, created_at FROM lead_events WHERE contact_id = $1 ORDER BY created_at ASC`,
    [contactId],
  )
  return rows
}

// Время ответа: секунды от создания заявки до первого действия менеджера
// (первое событие в таймлайне). sinceIso = null → за всё время.
export async function getResponseTimeSecs(sinceIso: string | null): Promise<number[]> {
  await ensureEventsTable()
  const { rows } = await getPool().query(
    `SELECT EXTRACT(EPOCH FROM (fe.first_at - c.created_at)) AS sec
       FROM contacts c
       JOIN (SELECT contact_id, MIN(created_at) AS first_at FROM lead_events GROUP BY contact_id) fe
         ON fe.contact_id = c.id
      WHERE fe.first_at > c.created_at
        AND ($1::timestamptz IS NULL OR c.created_at >= $1)`,
    [sinceIso],
  )
  return rows.map((r: any) => Number(r.sec)).filter((n: number) => n > 0 && Number.isFinite(n))
}

// ── Задачи и напоминания по сделкам ──
let tasksTableReady = false
export async function ensureTasksTable(): Promise<void> {
  if (tasksTableReady) return
  const db = getPool()
  await db.query(`
    CREATE TABLE IF NOT EXISTS lead_tasks (
      id         BIGSERIAL PRIMARY KEY,
      contact_id BIGINT NOT NULL,
      title      TEXT NOT NULL,
      due_at     TIMESTAMPTZ,
      done       BOOLEAN NOT NULL DEFAULT false,
      assignee   TEXT,
      author     TEXT NOT NULL DEFAULT '',
      notified   BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
  await db.query(`CREATE INDEX IF NOT EXISTS lead_tasks_contact_idx ON lead_tasks (contact_id)`)
  await db.query(`CREATE INDEX IF NOT EXISTS lead_tasks_open_idx ON lead_tasks (done, due_at)`)
  tasksTableReady = true
}

export async function addTask(row: { contact_id: number | string; title: string; due_at?: string | null; assignee?: string | null; author?: string }): Promise<any> {
  await ensureTasksTable()
  const { rows } = await getPool().query(
    `INSERT INTO lead_tasks (contact_id, title, due_at, assignee, author) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [row.contact_id, String(row.title).slice(0, 300), row.due_at || null, row.assignee || null, row.author || ''],
  )
  return rows[0]
}

export async function listTasksForLead(contactId: number | string): Promise<any[]> {
  await ensureTasksTable()
  const { rows } = await getPool().query(
    `SELECT * FROM lead_tasks WHERE contact_id = $1 ORDER BY done ASC, due_at ASC NULLS LAST, created_at ASC`,
    [contactId],
  )
  return rows
}

export async function listOpenTasks(): Promise<any[]> {
  await ensureTasksTable()
  const { rows } = await getPool().query(
    `SELECT t.*, c.name AS contact_name FROM lead_tasks t JOIN contacts c ON c.id = t.contact_id
     WHERE t.done = false ORDER BY t.due_at ASC NULLS LAST, t.created_at ASC`,
  )
  return rows
}

export async function setTask(id: number | string, fields: { done?: boolean; title?: string; due_at?: string | null }): Promise<void> {
  await ensureTasksTable()
  const sets: string[] = []
  const vals: unknown[] = []
  let i = 1
  if (fields.done !== undefined)   { sets.push(`done = $${i++}`);   vals.push(fields.done); if (fields.done) { sets.push(`notified = true`) } }
  if (fields.title !== undefined)  { sets.push(`title = $${i++}`);  vals.push(String(fields.title).slice(0, 300)) }
  if (fields.due_at !== undefined) { sets.push(`due_at = $${i++}`); vals.push(fields.due_at || null); sets.push(`notified = false`) }
  if (!sets.length) return
  vals.push(id)
  await getPool().query(`UPDATE lead_tasks SET ${sets.join(', ')} WHERE id = $${i}`, vals)
}

export async function dueTasksToNotify(): Promise<any[]> {
  await ensureTasksTable()
  const { rows } = await getPool().query(
    `SELECT t.*, c.name AS contact_name, c.phone AS contact_phone
     FROM lead_tasks t JOIN contacts c ON c.id = t.contact_id
     WHERE t.done = false AND t.notified = false AND t.due_at IS NOT NULL AND t.due_at <= now()`,
  )
  return rows
}

export async function markTaskNotified(id: number | string): Promise<void> {
  await getPool().query(`UPDATE lead_tasks SET notified = true WHERE id = $1`, [id])
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
