// Единая логика цен. Наценка меняется в ОДНОЙ строке.
// Цена на сайте = basePrice × PRICE_MARKUP (basePrice = цена-источник, как у primstroyhab).
export const PRICE_MARKUP = 1.15

// Цена продажи, округлённая до 10 ₽
export function sellPrice(base) {
  if (!base || base <= 0) return null
  return Math.round((base * PRICE_MARKUP) / 10) * 10
}

export function formatRub(v) {
  return Number(v).toLocaleString('ru-RU')
}

// "от 2 010 ₽" или null, если цены нет
export function priceFrom(item) {
  // fixedPrice — фиксированная цена без наценки (товары Сигнала)
  if (item && item.fixedPrice) return `от ${formatRub(item.fixedPrice)} ₽`
  const p = sellPrice(item && item.basePrice)
  return p ? `от ${formatRub(p)} ₽` : null
}

export const PRICE_DISCLAIMER =
  'Цены указаны ориентировочно и не являются публичной офертой. Актуальную цену и наличие уточняйте у менеджера.'

// Недорогие позиции — цена оптовая (зависит от объёма 50 шт / 50 м).
export const WHOLESALE_MAX = 500
export const WHOLESALE_NOTE =
  'Оптовая цена (за объём от 50 шт / 50 м). При меньшем количестве — уточняйте у менеджера.'

// true, если цена продажи ≤ порога (оптовая, зависит от объёма)
export function isWholesale(item) {
  if (!item) return false
  const p = item.fixedPrice ? Math.round(item.fixedPrice) : sellPrice(item.basePrice)
  return p != null && p > 0 && p <= WHOLESALE_MAX
}
