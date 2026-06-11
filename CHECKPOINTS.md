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

<!-- При создании новой точки добавляй блок выше этой строки -->
