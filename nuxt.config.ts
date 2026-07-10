// Content-Security-Policy под реальные ресурсы сайта (Метрика, Google Fonts, Яндекс.Карта, внешние фото товаров)
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://mc.yandex.ru",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self' https://mc.yandex.ru",
  "frame-src https://yandex.ru https://*.yandex.ru https://mc.yandex.ru",
  "upgrade-insecure-requests",
].join('; ')

const securityHeaders = {
  'Content-Security-Policy': csp,
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'X-Powered-By': '',
}

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    // Пред-сжатие public-ассетов (в т.ч. /data/*.json ~4.5 МБ) в gzip+brotli.
    // Сервер отдаёт сжатыми при Accept-Encoding → каталог грузится в разы быстрее.
    compressPublicAssets: { gzip: true, brotli: true },
    experimental: {
      openAPI: true,
    },
    openAPI: {
      meta: {
        title: 'ДСР API',
        description: 'API сайта «Дальневосточные Системы Развития» — приём заявок с форм.',
        version: '1.0.0',
      },
      // Не публиковать OpenAPI/Swagger/Scalar в проде (закрытие /_openapi.json, /_scalar, /_swagger)
      production: false,
    },
  },
  // Заголовки безопасности на все маршруты
  routeRules: {
    '/**': { headers: securityHeaders },
  },
  runtimeConfig: {
    public: {
      metrikaId: process.env.NUXT_PUBLIC_METRIKA_ID || '',
    },
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Дальневосточные Системы Развития',
      meta: [
        { name: 'description', content: 'Дальневосточные Системы Развития — надёжный партнёр для вашего бизнеса' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})
