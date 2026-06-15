export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  }
})
