import { onMounted } from 'vue'

// Один общий IntersectionObserver на всё приложение — вместо отдельного на каждый компонент.
let sharedObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (sharedObserver) return sharedObserver
  if (typeof window === 'undefined') return null
  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          sharedObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  return sharedObserver
}

export function useScrollReveal() {
  onMounted(() => {
    const obs = getObserver()
    if (!obs) return
    // Наблюдаем только ещё не обработанные элементы (помечаем, чтобы не дублировать между компонентами)
    document.querySelectorAll('[data-reveal]:not(.revealed):not([data-reveal-observed])').forEach((el) => {
      el.setAttribute('data-reveal-observed', '')
      obs.observe(el)
    })
  })
}
