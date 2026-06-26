# ── Сборка Nuxt 3 (node-server preset) ──
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
ENV PORT=3000

# Nitro-сборка самодостаточна (зависимости вшиты в .output)
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
