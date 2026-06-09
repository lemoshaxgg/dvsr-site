# CLAUDE.md — Инструкции для Claude Code

## Поведение
- Никогда не спрашивать подтверждений — всегда выполнять сразу
- Общаться только на русском языке
- После каждого изменения деплоить на Vercel: `npx vercel --prod --yes` из `C:\Users\lemos\dvsr-site`

## Проект
**ДСР — Дальневосточные Системы Развития**, Владивосток.
Сайт: https://dvsr-site.vercel.app

**Стек:** Nuxt 3, Vue 3, Tailwind CSS, Supabase, Vercel

## Структура
- `pages/index.vue` — главная страница
- `pages/catalog.vue` — каталог (~190 позиций), карусель фото, фильтры, модалки
- `pages/about.vue` — страница о компании
- `pages/privacy.vue` — политика конфиденциальности
- `data/catalog.js` — все категории (23 шт.) и товары (~190 позиций)
- `composables/useCatalogItems.js` — упрощённый список для подсказок Hero
- `server/api/contact.post.ts` — API заявок → Supabase таблица `contacts`
- `components/` — NavBar, HeroSection, AboutSection, ServicesSection, GallerySection, ReviewsSection, MapSection, ContactForm, TelegramBtn, DsrLogo

## Дизайн-система
- Фон: `#0a0a0a`, акцент: `#e6b800` (жёлтый/золотой)
- Скругления 10–16px
- Анимации через `useScrollReveal` (data-reveal атрибуты)

## Контакты компании
- Адрес: г. Владивосток, ул. Русская, д. 17, каб. 704
- Телефон: +7 914 329-29-29
- Email: ooo-dsr@bk.ru (ссылки через https://e.mail.ru/compose/?to=ooo-dsr@bk.ru)
- Telegram: @dsr2025

## Что сделано (актуально на 08.06.2026)
- Каталог: карусель фото для 3D панелей (items 1–5), одиночные фото калиток/ворот
- Инфо-панель с цветами RAL и размерами при выборе категории "Панели 3D"
- Цены убраны из карточек → "Уточнить цену"
- Навбар: все якорные ссылки исправлены (/#services, /#map, /#contact)
- Email-ссылки открываются в браузере через e.mail.ru
- Страница /about — описание компании с фото и блоками
- Сайдбар каталога: sticky + scrollbar (max-height: calc(100vh - 100px))
- Hover на пунктах сайдбара: жёлтая обводка слева

## Фото в /public/catalog/
Плоские файлы (используются в каталоге):
- `fence3d.jpg`, `mesh.jpg`, `piles.jpg`, `piles-flange.jpg`, `proflist.jpg`, `septic.jpg`
- `panel-3d-1..4.jpg` — цветные панели (карусель item 5)
- `panel-3d-plain.jpg` — обычная панель (items 1–4)
- `kalitka-3d.jpg` — калитки (items 15–16)
- `vorota-3d.jpg` — ворота (items 17–18)

Подпапки с исходниками:
- `3D заборы и ворота/калитка 3 д/`, `/ворота 3д/`, `/Сетки панели 3D/`, `/Сетки панели 3D, Цветные/`, `/Столбы для забора 3D/`
