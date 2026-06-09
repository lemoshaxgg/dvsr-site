import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone, email, message, item_title, item_price } = body

  if (!name || !phone || !message) {
    throw createError({ statusCode: 400, message: 'Заполните обязательные поля' })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { error } = await supabase
    .from('contacts')
    .insert({
      name,
      phone,
      email: email || null,
      message,
      item_title: item_title || null,
      item_price: item_price || null,
    })

  if (error) {
    console.error('Supabase error:', error)
    throw createError({ statusCode: 500, message: 'Ошибка сохранения заявки' })
  }

  return { ok: true }
})
