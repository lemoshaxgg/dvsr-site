import { Pool } from 'pg'

// Подключение к РФ-Postgres (Timeweb Cloud, 152-ФЗ).
// ENV:
//   RF_DATABASE_URL — строка подключения postgres://user:pass@host:5432/db
//   RF_DB_CA        — (опц.) PEM-сертификат CA провайдера

let pool: Pool | null = null

export function isRfDbConfigured(): boolean {
  return !!process.env.RF_DATABASE_URL
}

export function getRfPool(): Pool { return getPool() }

function getPool(): Pool {
  if (pool) return pool
  const ca = process.env.RF_DB_CA
  pool = new Pool({
    connectionString: process.env.RF_DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    ssl: ca
      ? { ca, rejectUnauthorized: true }
      : { rejectUnauthorized: false },
  })
  return pool
}

let tableReady = false
let cmsTableReady = false

export async function ensureTable(): Promise<void> {
  if (tableReady) return
  await getPool().query(`
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
  tableReady = true
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
