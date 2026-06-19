# Переезд хостинга на РФ-провайдера (из реестра РКН)

_Создано: 2026-06-19_

Сейчас сайт на **Vercel** (не в реестре РКН). Цель — развернуть на российском хостинге и привязать домен `.ru`.

Сборка готова к Docker: `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `.env.production.example` уже в репозитории. Nuxt собирается в node-server (`.output/server/index.mjs`), образ самодостаточен.

---

## Выбор провайдера (в реестре РКН, поддерживают Docker/Node)

| Провайдер | Как разворачивать | Комментарий |
|---|---|---|
| **Timeweb Cloud** | «Приложения» (Docker/Node) или VPS | Проще всего, есть деплой из Git, дёшево |
| **Selectel** | VPS + Docker, или Managed K8s | Гибко, есть Managed PostgreSQL рядом |
| **Yandex Cloud** | Serverless Containers или Compute VM | Удобно, если БД тоже в Yandex Cloud (см. локализацию ПД) |
| **REG.RU / RuVDS** | VPS + Docker | Бюджетно |

Рекомендация: **Yandex Cloud** — там же держим Managed PostgreSQL для ПД (один периметр, РФ), либо **Timeweb Cloud** для простоты.

---

## Вариант А — VPS + Docker (универсальный)

```bash
# на сервере (Ubuntu)
# 1. поставить docker
curl -fsSL https://get.docker.com | sh

# 2. забрать код
git clone <repo> dvsr-site && cd dvsr-site

# 3. заполнить переменные окружения
cp .env.production.example .env.production
nano .env.production   # RF_DATABASE_URL, RF_DB_CA, TELEGRAM_*, NUXT_PUBLIC_METRIKA_ID

# 4. собрать и запустить
docker compose up -d --build

# 5. проверить
curl -I http://localhost:3000
```

Перед контейнером — **Nginx** как reverse-proxy + TLS:

```nginx
server {
    server_name dsr-dv.ru www.dsr-dv.ru;   # ← домен
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
TLS: `certbot --nginx -d dsr-dv.ru -d www.dsr-dv.ru` (Let's Encrypt) или сертификат провайдера.

> Важно: rate-limit в `contact.post.ts` читает IP через `x-forwarded-for` — заголовок выше его прокидывает, всё совпадает.

---

## Вариант Б — Timeweb Cloud Apps (без своего сервера)
1. Создать «Приложение» → источник Git → выбрать репозиторий.
2. Тип — Docker (подхватит `Dockerfile`) либо Node (build `npm run build`, start `node .output/server/index.mjs`).
3. Переменные окружения — из `.env.production.example`.
4. Привязать домен, TLS включается автоматически.

---

## Домен `.ru`
1. Зарегистрировать домен (например `dsr-dv.ru`) у РФ-регистратора (REG.RU, RU-CENTER, Timeweb).
2. A-запись на IP сервера (или CNAME на адрес приложения провайдера).
3. Обновить в коде абсолютные ссылки на новый домен:
   - `app.vue` → `const SITE = 'https://dsr-dv.ru'` (Schema.org)
   - `server/routes/sitemap.xml.ts` и canonical/OG, если есть.
4. В Яндекс.Вебмастер добавить новый домен, настроить 301-редирект со старого.

---

## Порядок переезда (без простоя)
1. Поднять контейнер на РФ-хостинге, проверить по IP/временному домену.
2. Завести Managed PostgreSQL (РФ) и прописать `RF_DATABASE_URL` — заявки сразу локализуются (см. `COMPLIANCE_RF.md`).
3. Зарегистрировать домен `.ru`, направить DNS на РФ-сервер.
4. Поменять `SITE`/canonical на новый домен, пересобрать.
5. Держать Vercel активным до подтверждения, что РФ-сайт работает; затем отключить.

---

## Чек-лист переменных окружения на проде
- `RF_DATABASE_URL`, `RF_DB_CA` — РФ-Postgres (локализация ПД)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — уведомления
- `NUXT_PUBLIC_METRIKA_ID` — Яндекс.Метрика
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — только пока не задан `RF_DATABASE_URL`
