import type { RouterConfig } from '@nuxt/schema'

// Скролл: «назад/вперёд» — возвращаем на прежнее место (savedPosition),
// новая навигация — наверх. Ждём завершения страницы/перехода, чтобы не было гонки.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:finish', () => {
        setTimeout(() => {
          if (savedPosition) resolve(savedPosition)
          else if (to.hash) resolve({ el: to.hash, top: 80 })
          else resolve({ top: 0 })
        }, 60)
      })
    })
  },
}
