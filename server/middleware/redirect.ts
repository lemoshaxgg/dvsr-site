// 301-редирект со старого домена (*.vercel.app) на основной dsr-dv.ru.
// Сигнал поисковикам о переезде сайта + устранение дубля контента.
export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || ''
  if (host.includes('vercel.app')) {
    const path = event.node.req.url || '/'
    return sendRedirect(event, `https://dsr-dv.ru${path}`, 301)
  }
})
