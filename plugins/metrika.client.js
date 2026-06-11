export default defineNuxtPlugin(() => {
  const { metrikaId } = useRuntimeConfig().public
  if (!metrikaId) return

  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments)
  }
  window.ym.l = +new Date()

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)

  script.onload = () => {
    ym(metrikaId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
  }

  const noscript = document.createElement('noscript')
  noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute;left:-9999px" alt="" /></div>`
  document.body.appendChild(noscript)
})
