export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_sid', { path: '/' })
  deleteCookie(event, 'admin_role', { path: '/' })
  return { ok: true }
})