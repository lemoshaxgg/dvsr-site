import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

  let q = supabase.from('contacts').select('*').order('created_at', { ascending: false })
  if (query.status && query.status !== 'all') q = q.eq('status', String(query.status))

  const { data, error } = await q
  if (error) throw createError({ statusCode: 500, message: error.message })
  return data || []
})
