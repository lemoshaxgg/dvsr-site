# ── Сборка Nuxt 3 (node-server preset) — rebuild 2026-07-31 ──
FROM node:22-alpine AS build
WORKDIR /app

# Зависимости (кэшируемый слой)
COPY package.json package-lock.json ./
RUN npm ci

# Исходники и сборка
COPY . .
RUN npm run build

# ── Рантайм: только .output + node ──
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
# Слушаем dual-stack (IPv6 + IPv4-mapped) — иначе healthcheck/роутер по IPv6 не достучится
ENV HOST=::
# PORT берём из окружения платформы (Timeweb инжектит свой). 3000 — дефолт, если не задан.
# Nitro читает process.env.PORT в рантайме, поэтому платформенный PORT перекрывает этот дефолт.
ENV PORT=3000

# Nitro-сборка самодостаточна (зависимости вшиты в .output)
COPY --from=build /app/.output ./.output

EXPOSE 3000

# Контейнер сам сообщает о готовности — стучимся на РЕАЛЬНЫЙ порт ($PORT), путь / отдаёт 200.
HEALTHCHECK --interval=15s --timeout=5s --start-period=25s --retries=5 CMD wget -qO /dev/null "http://127.0.0.1:${PORT:-3000}/" || exit 1

CMD ["node", ".output/server/index.mjs"]
