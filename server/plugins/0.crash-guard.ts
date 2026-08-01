// Страховка процесса. Фоновые задачи (IMAP-поллер почты) при обрыве соединения
// Mail.ru выбрасывают НЕОБРАБОТАННЫЙ промис/исключение мимо try/catch. На Node это
// валит ВЕСЬ процесс → веб-сервер уходит в крэш-петлю, а Timeweb глушит контейнер
// (сайт лежит). Ловим такие ошибки, логируем и НЕ роняем сервер — ошибка изолирована
// в фоне и к обработке HTTP-запросов отношения не имеет.
// Плагин с префиксом «0.» грузится первым — до mailPoll и остальных.
export default defineNitroPlugin(() => {
  process.on('unhandledRejection', (reason: any) => {
    console.error('[crash-guard] unhandledRejection:', reason?.message || String(reason))
  })
  process.on('uncaughtException', (err: any) => {
    console.error('[crash-guard] uncaughtException:', err?.message || String(err))
  })
  console.log('[crash-guard] защита процесса включена')
})
