import { ensureTable, insertContactRf } from '~/server/utils/rfdb'

export default defineEventHandler(async () => {
  try {
    await ensureTable()
    await insertContactRf({
      name: 'Test',
      phone: '+7 914 000-00-00',
      email: null,
      message: 'contact-test',
      item_title: null,
      item_price: null,
    })
    return { ok: true }
  } catch (e: any) {
    return {
      ok: false,
      message: e?.message,
      code: e?.code,
      name: e?.name,
      str: String(e),
      json: JSON.stringify(e),
    }
  }
})