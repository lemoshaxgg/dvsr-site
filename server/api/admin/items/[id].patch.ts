import { getRfPool, ensureCatalogCmsTable } from '~/server/utils/rfdb'

export default defineEventHandler(async (event) => {
  const itemId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event) || {}

  await ensureCatalogCmsTable()
  const pool = getRfPool()

  const payload = [
    itemId,
    body.category ?? null,
    body.sub ?? null,
    body.title ?? null,
    body.description ?? null,
    body.unit ?? null,
    body.photo ?? null,
    body.is_hidden ?? false,
    new Date().toISOString(),
  ]

  await pool.query(
    `INSERT INTO catalog_cms (item_id, category, sub, title, description, unit, photo, is_hidden, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (item_id) DO UPDATE SET
       category = EXCLUDED.category,
       sub = EXCLUDED.sub,
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       unit = EXCLUDED.unit,
       photo = EXCLUDED.photo,
       is_hidden = EXCLUDED.is_hidden,
       updated_at = EXCLUDED.updated_at`,
    payload,
  )

  return { ok: true }
})