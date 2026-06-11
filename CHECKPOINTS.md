# Точки восстановления

Каждая точка — рабочее состояние сайта, к которому можно откатиться.

## Как откатиться

```powershell
# Посмотреть все точки
git tag -l "checkpoint-*"

# Откатить рабочую папку к точке (без потери истории)
git checkout checkpoint-1 -- .

# Или переключиться полностью на точку
git checkout checkpoint-1
```

---

## checkpoint-1 — Базовый сайт
**Дата:** 2026-06-11  
**Коммит:** 89f0d8f  
**Тег:** `checkpoint-1`

Состояние после первоначального деплоя:
- Nuxt 3 + Vue 3 + Tailwind CSS + Supabase
- Каталог: 190 статических + 2113 товаров из JSON (ленивая загрузка)
- Категории: fence3d, mesh, piles, septic, welding, cellar, tanks, boiler, pipe, industry, hardware, docke, garden, services, cable, stainless, metalroll, hatches
- Серверный бандл каталога: 162 KB (оптимизировано с 2.35 MB)
- Форма заявок → Supabase (contacts)

---

## checkpoint-2 — Редизайн с анимациями
**Дата:** 2026-06-11  
**Коммит:** 44c3445  
**Тег:** `checkpoint-2`

Полный редизайн главной страницы и каталога:
- **HeroSection**: 3 анимированных CSS orb-пятна, 110 частиц с отталкиванием мышью, bar статистики (2300+/23/10+), shimmer-анимация на заголовке
- **AboutSection**: анимированные счётчики (count-up на IntersectionObserver), glassmorphism карточки с glow при наведении
- **ServicesSection**: 6 карточек направлений (иконки + описание + кол-во) вместо одной кнопки
- **Каталог**: иконки-эмодзи на карточках категорий, усиленный hover glow, shimmer-sweep на кнопках
- **main.css**: CSS переменные, кастомный скроллбар (золотой при hover), text-shimmer анимация

---

<!-- При создании новой точки добавляй блок выше этой строки -->
