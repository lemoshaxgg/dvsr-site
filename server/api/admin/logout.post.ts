export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_sid', { path: '/' })
  return { ok: true }
})