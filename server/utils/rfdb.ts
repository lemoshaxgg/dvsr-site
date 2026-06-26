import { Pool } from 'pg'

// Подключение к РФ-Postgres (например, Yandex Cloud Managed PostgreSQL).
// Локализация ПД в РФ (152-ФЗ ст. 18 ч. 5). Включается, как только задан RF_DATABASE_URL.
//
// ENV:
//   RF_DATABASE_URL  — строка подключения postgres://user:pass@host:6432/db
//   RF_DB_CA         — (опц.) PEM-сертификат CA провайдера (для Yandex Cloud sslmode=verify-full)
//
// Если RF_DATABASE_URL не задан — функция isRfDbConfigured() вернёт false,
// и обработчик заявок использует прежний путь (Supabase) до завершения переезда.

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
    ssl: ca
      ? { ca, rejectUnauthorized: true }
      : { rejectUnauthorized: false },
  })
  return pool
}

let tableReady = false

async function ensureTable(): Promise<void> {
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
