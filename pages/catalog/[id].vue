<template>
  <div>
    <main v-if="item" class="pp">
      <div class="pp__inner">

        <!-- Breadcrumb -->
        <nav class="pp__breadcrumb">
          <a href="/">Главная</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 18l6-6-6-6"/></svg>
          <a href="/catalog">Каталог</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 18l6-6-6-6"/></svg>
          <a :href="`/catalog?cat=${item.category}`">{{ categoryMap[item.category] }}</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 18l6-6-6-6"/></svg>
          <span>{{ item.title }}</span>
        </nav>

        <!-- Layout: галерея + инфо -->
        <div class="pp__layout">

          <!-- Галерея -->
          <div class="pp__gallery">
            <div class="pp__gallery-main">
              <template v-if="galleryPhotos.length > 1">
                <transition name="pp-photo" mode="out-in">
                  <img :key="photoIdx" :src="galleryPhotos[photoIdx]" :alt="item.title" class="pp__img" @error="onPhotoError(galleryPhotos[photoIdx])" />
                </transition>
                <button class="pp__prev" @click="photoIdx = (photoIdx - 1 + galleryPhotos.length) % galleryPhotos.length">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button class="pp__next" @click="photoIdx = (photoIdx + 1) % galleryPhotos.length">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 18l6-6-6-6"/></svg>
                </button>
              </template>
              <img v-else-if="galleryPhotos.length === 1" :src="galleryPhotos[0]" :alt="item.title" class="pp__img" @error="onPhotoError(galleryPhotos[0])" />
              <div v-else class="pp__no-img">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1" d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></svg>
                <span>Фото скоро</span>
              </div>
            </div>

            <!-- Миниатюры -->
            <div v-if="galleryPhotos.length > 1" class="pp__thumbs">
              <button v-for="(ph, i) in galleryPhotos" :key="ph"
                class="pp__thumb" :class="{ active: i === photoIdx }"
                @click="photoIdx = i">
                <img :src="ph" :alt="`${item.title} ${i+1}`" @error="onPhotoError(ph)" />
              </button>
            </div>
          </div>

          <!-- Информация -->
          <div class="pp__info">
            <a :href="`/catalog?cat=${item.category}`" class="pp__cat">{{ categoryMap[item.category] }}</a>
            <h1 class="pp__title">{{ item.title }}</h1>

            <p class="pp__short-desc">{{ item.description }}</p>

            <div class="pp__price-row">
              <span class="pp__price" :class="{ 'pp__price--ask': !priceFrom(item) }">{{ priceFrom(item) || 'Уточнить актуальную цену' }}</span>
              <span class="pp__price-note">{{ PRICE_DISCLAIMER }}</span>
            </div>

            <!-- Мета -->
            <div v-if="item.sku || item.unit" class="pp__meta">
              <div v-if="item.sku" class="pp__meta-row">
                <span class="pp__meta-label">Артикул</span>
                <span class="pp__meta-val">{{ item.sku }}</span>
              </div>
              <div v-if="item.unit" class="pp__meta-row">
                <span class="pp__meta-label">Единица</span>
                <span class="pp__meta-val">{{ item.unit }}</span>
              </div>
            </div>

            <!-- CTA -->
            <div class="pp__cta">
              <button class="pp__order-btn" @click="orderOpen = true">
                Оставить заявку
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button class="pp__add-btn" :class="{ added: hasItem(item.id) }" @click="addItem(item)">
                <svg v-if="hasItem(item.id)" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 6L9 17l-5-5"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2.2" d="M12 5v14M5 12h14"/>
                </svg>
                {{ hasItem(item.id) ? 'В списке' : 'В список' }}
              </button>
            </div>

            <!-- Иконки-бейджи -->
            <div class="pp__badges">
              <div class="pp__badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2zM1 9h4"/>
                </svg>
                Доставка по краю
              </div>
              <div class="pp__badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Гарантия качества
              </div>
              <div class="pp__badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Уточнить наличие
              </div>
            </div>

            <!-- Низ -->
            <div class="pp__bottom-actions">
              <button class="pp__share-btn" @click="copyLink">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                {{ copied ? 'Скопировано!' : 'Копировать ссылку' }}
              </button>
              <a href="/catalog" class="pp__back">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                В каталог
              </a>
            </div>
          </div>
        </div>

        <!-- Табы -->
        <div class="pp__tabs">
          <div class="pp__tab-bar">
            <button v-for="tab in tabs" :key="tab.id"
              class="pp__tab-btn" :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id">
              {{ tab.label }}
            </button>
          </div>

          <transition name="tab" mode="out-in">
            <!-- Описание -->
            <div v-if="activeTab === 'desc'" key="desc" class="pp__tab-body">
              <p class="pp__long-desc">{{ item.description }}</p>
              <p v-if="catDescText" class="pp__cat-desc">{{ catDescText }}</p>
            </div>

            <!-- Характеристики -->
            <div v-else-if="activeTab === 'specs'" key="specs" class="pp__tab-body">
              <div class="pp__specs">
                <div v-for="(spec, i) in itemSpecs" :key="i" class="pp__spec-row" :style="{ '--si': i }">
                  <span class="pp__spec-label">{{ spec.label }}</span>
                  <span class="pp__spec-divider"></span>
                  <span class="pp__spec-value">{{ spec.value }}</span>
                </div>
              </div>
            </div>

            <!-- Преимущества -->
            <div v-else-if="activeTab === 'adv'" key="adv" class="pp__tab-body">
              <div class="pp__advantages">
                <div v-for="(adv, i) in itemAdvantages" :key="i" class="pp__adv-card" :style="{ '--ai': i }">
                  <div class="pp__adv-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path :d="adv.iconPath" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"/>
                    </svg>
                  </div>
                  <div class="pp__adv-text">
                    <h4 class="pp__adv-title">{{ adv.title }}</h4>
                    <p class="pp__adv-desc">{{ adv.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Похожие товары -->
      <section v-if="relatedItems.length > 0" class="pp-related">
        <div class="pp-related__inner">
          <div class="pp-related__header">
            <h2 class="pp-related__title">Похожие товары</h2>
            <a :href="`/catalog?cat=${item.category}`" class="pp-related__all">
              Смотреть все
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          <div class="pp-related__grid">
            <a v-for="(rel, i) in relatedItems" :key="rel.id"
              :href="`/catalog/${rel.id}`"
              class="pp-rel-card"
              :style="{ '--ri': i }">
              <div class="pp-rel-card__img">
                <img v-if="rel.photo || rel.photos?.[0]" :src="rel.photo || rel.photos[0]" :alt="rel.title" loading="lazy" />
                <div v-else class="pp-rel-card__no-img">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="M3 16l5-5 4 4 3-3 6 6"/></svg>
                </div>
                <div class="pp-rel-card__overlay">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
              <div class="pp-rel-card__body">
                <span class="pp-rel-card__cat">{{ categoryMap[rel.category] }}</span>
                <span class="pp-rel-card__title">{{ rel.title }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

    </main>

    <!-- 404 -->
    <main v-else class="pp pp--404">
      <div class="pp__inner pp__inner--center">
        <div class="pp__404-ring">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <h2 class="pp__404-title">Товар не найден</h2>
        <p class="pp__404-sub">Возможно, он был удалён или ссылка устарела.</p>
        <a href="/catalog" class="pp__order-btn" style="text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;margin-top:1rem">
          В каталог
        </a>
      </div>
    </main>

    <!-- Модалка заявки -->
    <transition name="pp-modal">
      <div v-if="orderOpen" class="pp-modal-overlay" @click.self="orderOpen = false">
        <div class="pp-modal">
          <button class="pp-modal__close" @click="orderOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <transition name="modal-state" mode="out-in">
            <!-- Форма -->
            <div v-if="!orderSuccess" key="form">
              <div class="pp-modal__head">
                <div class="pp-modal__head-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
                <div>
                  <h2 class="pp-modal__title">Оставить заявку</h2>
                  <p class="pp-modal__subtitle">{{ item?.title }}</p>
                </div>
              </div>

              <form class="pp-modal__form" @submit.prevent="submitOrder">
                <div class="pp-modal__input-wrap">
                  <svg class="pp-modal__input-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                  </svg>
                  <input v-model="form.name" type="text" placeholder="Ваше имя *" class="pp-modal__input" maxlength="100" />
                </div>
                <div class="pp-modal__input-wrap">
                  <svg class="pp-modal__input-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  <input :value="form.phone" @input="form.phone = phoneMask($event.target.value)" type="tel" placeholder="+7 (___) ___-__-__" class="pp-modal__input" maxlength="18" />
                </div>
                <textarea v-model="form.message" placeholder="Комментарий — количество, сроки, адрес объекта..." class="pp-modal__input pp-modal__textarea" rows="2" maxlength="500"></textarea>
                <label class="pp-modal__consent">
                  <input type="checkbox" v-model="form.consent" class="pp-modal__consent-check" />
                  <span>Я согласен(а) на <a href="/privacy" target="_blank" class="pp-modal__consent-link">обработку персональных данных</a> в соответствии с ФЗ-152</span>
                </label>
                <button type="submit" class="pp-modal__submit" :disabled="loading || !form.consent">
                  <span v-if="loading" class="pp-modal__spinner"></span>
                  {{ loading ? 'Отправка...' : 'Отправить в ДСР' }}
                </button>
              </form>
            </div>

            <!-- Успех -->
            <div v-else key="success" class="pp-modal__success">
              <div class="pp-modal__success-ring">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24">
                  <path stroke="#4ade80" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 6L9 17l-5-5" class="pp-modal__check-path"/>
                </svg>
              </div>
              <h2 class="pp-modal__success-title">Заявка отправлена!</h2>
              <p class="pp-modal__success-text">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
              <button class="pp-modal__success-close" @click="orderOpen = false">Закрыть</button>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { categories, items as staticItems } from '~/data/catalog.js'
import { phoneMask } from '~/composables/usePhoneMask.js'
import { getProductSpecs, getProductAdvantages, getProductCatDesc } from '~/composables/useProductSpecs.js'
import { priceFrom, sellPrice, PRICE_DISCLAIMER } from '~/composables/usePrice.js'
const { addItem, hasItem } = useCart()

const route = useRoute()
const itemId = Number(route.params.id)
const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.label]))

const { data: item } = await useAsyncData(`product-${itemId}`, async () => {
  const staticItem = staticItems.find(i => i.id === itemId)
  if (staticItem) return staticItem
  try {
    const all = await $fetch('/data/catalog-items.json')
    return all.find(i => i.id === itemId) ?? null
  } catch { return null }
})

useHead({ title: item.value ? `${item.value.title} — купить во Владивостоке | ДСР` : 'Товар не найден — ДСР' })
useSeoMeta({
  description: item.value ? (item.value.description || `Купить ${item.value.title} во Владивостоке. ООО ДСР — строительные материалы и оборудование.`).slice(0, 160) : 'Страница товара не найдена.',
  ogTitle: item.value ? `${item.value.title} — ДСР Владивосток` : 'ДСР',
  ogImage: `https://dsr-dv.ru/catalog/products/${itemId}.jpg`,
  ogUrl: `https://dsr-dv.ru/catalog/${itemId}`,
  twitterCard: 'summary_large_image',
})

// SEO: разметка товара (Product + Offer) и хлебные крошки
const SITE = 'https://dsr-dv.ru'
useHead(() => {
  const it = item.value
  if (!it) return {}
  const price = sellPrice(it.basePrice)
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: it.title,
    description: (it.description || it.title),
    image: `${SITE}/catalog/products/${it.id}.jpg`,
    sku: it.sku || String(it.id),
    category: categoryMap[it.category] || 'Каталог',
    brand: { '@type': 'Brand', name: 'ДСР' },
    ...(price ? {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'RUB',
        availability: 'https://schema.org/InStock',
        url: `${SITE}/catalog/${it.id}`,
        seller: { '@type': 'Organization', name: 'ДСР — Дальневосточные Системы Развития' },
      },
    } : {}),
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${SITE}/catalog` },
      { '@type': 'ListItem', position: 3, name: categoryMap[it.category] || 'Категория', item: `${SITE}/catalog?cat=${it.category}` },
      { '@type': 'ListItem', position: 4, name: it.title, item: `${SITE}/catalog/${it.id}` },
    ],
  }
  return {
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(product) },
      { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumb) },
    ],
  }
})

const relatedItems = computed(() => {
  if (!item.value) return []
  return staticItems.filter(i => i.id !== itemId && i.category === item.value.category).slice(0, 4)
})

const photoIdx = ref(0)

// Фото как в каталоге: для одиночных — /catalog/products/{id}.jpg первым (с откатом на фото из данных),
// для многофото — карусель из данных (как в списке). failedPhotos убирает то, что не загрузилось.
const failedPhotos = reactive(new Set())
const galleryPhotos = computed(() => {
  if (!item.value) return []
  if (item.value.photos && item.value.photos.length > 1) {
    return item.value.photos.filter(p => p && !failedPhotos.has(p))
  }
  // Внешнее фото (CDN Сигнала) — используем напрямую, без попытки products/{id}.jpg
  if (item.value.photo && /^https?:/.test(item.value.photo)) {
    return [item.value.photo].filter(p => !failedPhotos.has(p))
  }
  const catalogPhoto = `/catalog/products/${item.value.id}.jpg`
  if (!failedPhotos.has(catalogPhoto)) return [catalogPhoto]
  const dataPhoto = item.value.photo || item.value.photos?.[0] || null
  if (dataPhoto && !failedPhotos.has(dataPhoto)) return [dataPhoto]
  return []
})
function onPhotoError(src) {
  if (!src) return
  failedPhotos.add(src)
  if (photoIdx.value >= galleryPhotos.value.length) photoIdx.value = 0
}

const loading  = ref(false)
const orderSuccess = ref(false)
const orderOpen = ref(false)
const copied    = ref(false)
const activeTab = ref('desc')
const tabs = [
  { id: 'desc',  label: 'Описание' },
  { id: 'specs', label: 'Характеристики' },
  { id: 'adv',   label: 'Преимущества' },
]
const form = reactive({ name: '', phone: '', message: '', consent: false })

function copyLink() {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  }
}

const catDescText   = computed(() => getProductCatDesc(item.value))
const itemSpecs     = computed(() => getProductSpecs(item.value))
const itemAdvantages = computed(() => getProductAdvantages(item.value))

async function submitOrder() {
  if (!form.name || !form.phone) return
  loading.value = true
  const priceText = item.value?.basePrice
    ? `от ${item.value.basePrice.toLocaleString('ru-RU')} ₽ / ${item.value.unit}`
    : 'уточнить'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { name: form.name, phone: form.phone, email: null, message: form.message || '—', item_title: item.value?.title, item_price: priceText },
    })
    orderSuccess.value = true
    form.name = ''; form.phone = ''; form.message = ''
  } catch {
    form.message = 'Ошибка. Позвоните нам напрямую.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pp { min-height: 100vh; background: #0a0a0a; padding-bottom: 4rem; }
.pp__inner { max-width: 1160px; margin: 0 auto; padding: 6rem 1.5rem 2rem; }
.pp__inner--center { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 60vh; gap: 1rem; }

/* Breadcrumb */
.pp__breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 0.3rem; font-size: 0.78rem; color: #444; margin-bottom: 2.5rem; }
.pp__breadcrumb a { color: #e6b800; text-decoration: none; opacity: 0.75; transition: opacity 0.15s; }
.pp__breadcrumb a:hover { opacity: 1; }
.pp__breadcrumb span:last-child { color: #666; }

/* Layout */
.pp__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: start; margin-bottom: 3.5rem; }

/* ── Галерея ── */
.pp__gallery-main {
  position: relative;
  background: linear-gradient(145deg, #0d0d0d, #111);
  border: 1px solid #1e1e1e;
  border-radius: 20px;
  overflow: hidden;
  min-height: 400px;
  display: flex; align-items: center; justify-content: center;
}
.pp__img { width: 100%; max-height: 500px; object-fit: contain; padding: 7%; filter: drop-shadow(0 8px 32px rgba(230,184,0,0.18)); }
.pp__no-img { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; opacity: 0.15; color: #e6b800; padding: 3rem; font-size: 0.85rem; }

.pp__prev, .pp__next {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(0,0,0,0.55); border: none; color: #fff;
  width: 38px; height: 52px; cursor: pointer; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s; z-index: 2;
}
.pp__prev { left: 8px; }
.pp__next { right: 8px; }
.pp__prev:hover, .pp__next:hover { background: rgba(230,184,0,0.7); color: #000; }

.pp__thumbs { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
.pp__thumb {
  width: 64px; height: 64px; border-radius: 10px; overflow: hidden;
  border: 2px solid rgba(255,255,255,0.06); background: #0d0d0d; cursor: pointer;
  padding: 0; transition: border-color 0.15s;
}
.pp__thumb.active { border-color: #e6b800; }
.pp__thumb img { width: 100%; height: 100%; object-fit: cover; }

.pp-photo-enter-active { transition: opacity 0.25s, transform 0.25s; }
.pp-photo-leave-active { transition: opacity 0.15s; }
.pp-photo-enter-from { opacity: 0; transform: scale(0.97); }
.pp-photo-leave-to { opacity: 0; }

/* ── Инфо ── */
.pp__info { display: flex; flex-direction: column; gap: 1.25rem; }

.pp__cat {
  display: inline-flex; align-items: center;
  background: rgba(230,184,0,0.1); color: #e6b800;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 0.28rem 0.85rem; border-radius: 999px; border: 1px solid rgba(230,184,0,0.22);
  text-decoration: none; width: fit-content; transition: background 0.15s;
}
.pp__cat:hover { background: rgba(230,184,0,0.18); }

.pp__title { font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 800; color: #fff; line-height: 1.2; margin: 0; }

.pp__short-desc { color: #888; font-size: 0.925rem; line-height: 1.7; margin: 0; }

.pp__price-row { display: flex; flex-direction: column; gap: 0.3rem; }
.pp__price { font-size: 1.6rem; font-weight: 800; color: #e6b800; line-height: 1; }
.pp__price--ask { font-size: 1.1rem; font-weight: 700; color: #999; }
.pp__price-note { font-size: 0.72rem; color: #555; line-height: 1.4; }

.pp__meta { background: rgba(255,255,255,0.025); border: 1px solid #1e1e1e; border-radius: 10px; padding: 0.8rem 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
.pp__meta-row { display: flex; gap: 0.75rem; font-size: 0.83rem; }
.pp__meta-label { color: #444; min-width: 90px; }
.pp__meta-val { color: #bbb; font-weight: 500; }

/* CTA */
.pp__cta { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.pp__order-btn {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: #e6b800; color: #0a0a0a;
  font-size: 1rem; font-weight: 700; font-family: inherit;
  border: none; border-radius: 12px; cursor: pointer;
  box-shadow: 0 4px 20px rgba(230,184,0,0.35);
  transition: background 0.15s, transform 0.2s, box-shadow 0.2s;
}
.pp__order-btn::after {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
  transform: skewX(-20deg);
  transition: left 0.55s ease;
}
.pp__order-btn:hover::after { left: 140%; }
.pp__order-btn:hover { background: #f5c842; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(230,184,0,0.5); }

.pp__add-btn {
  display: inline-flex; align-items: center; gap: 0.45rem;
  padding: 0.85rem 1.25rem;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; color: #aaa; font-size: 0.875rem; font-weight: 600;
  font-family: inherit; cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.pp__add-btn:hover { background: rgba(230,184,0,0.08); border-color: rgba(230,184,0,0.3); color: #e6b800; }
.pp__add-btn.added { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.3); color: #4ade80; }

/* Badges */
.pp__badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pp__badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.75rem; color: #555; font-weight: 500;
  padding: 0.35rem 0.75rem;
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 999px;
}

/* Bottom actions */
.pp__bottom-actions { display: flex; align-items: center; gap: 1rem; padding-top: 0.25rem; border-top: 1px solid #1a1a1a; }
.pp__share-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: none; border: 1px solid #222; border-radius: 999px;
  padding: 0.4rem 1rem; color: #555; font-size: 0.78rem; font-family: inherit;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
}
.pp__share-btn:hover { border-color: rgba(230,184,0,0.4); color: #e6b800; }
.pp__back {
  display: inline-flex; align-items: center; gap: 0.4rem;
  color: #555; text-decoration: none; font-size: 0.78rem;
  transition: color 0.15s;
}
.pp__back:hover { color: #e6b800; }

/* ── Табы ── */
.pp__tabs { margin-top: 1rem; }
.pp__tab-bar {
  display: flex; gap: 0.25rem;
  border-bottom: 1px solid #1e1e1e;
  margin-bottom: 2rem;
}
.pp__tab-btn {
  padding: 0.7rem 1.5rem;
  background: none; border: none; border-bottom: 2px solid transparent;
  color: #555; font-size: 0.9rem; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}
.pp__tab-btn:hover { color: #ccc; }
.pp__tab-btn.active { color: #e6b800; border-bottom-color: #e6b800; }

.tab-enter-active { transition: opacity 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.tab-leave-active { transition: opacity 0.12s; }
.tab-enter-from { opacity: 0; transform: translateY(8px); }
.tab-leave-to { opacity: 0; }

/* Описание */
.pp__long-desc { color: #999; font-size: 0.95rem; line-height: 1.8; margin: 0 0 1.25rem; }
.pp__cat-desc { color: #666; font-size: 0.88rem; line-height: 1.75; margin: 0; padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid #1a1a1a; border-radius: 12px; border-left: 3px solid rgba(230,184,0,0.4); }

/* Характеристики */
.pp__specs { display: flex; flex-direction: column; gap: 0; border: 1px solid #1a1a1a; border-radius: 14px; overflow: hidden; }
.pp__spec-row {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #141414;
  animation: spec-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--si, 0) * 40ms);
}
.pp__spec-row:last-child { border-bottom: none; }
.pp__spec-row:nth-child(odd) { background: rgba(255,255,255,0.015); }
.pp__spec-label { color: #555; font-size: 0.85rem; min-width: 160px; flex-shrink: 0; }
.pp__spec-divider { flex: 1; border-bottom: 1px dashed #1e1e1e; }
.pp__spec-value { color: #ccc; font-size: 0.875rem; font-weight: 500; text-align: right; }
@keyframes spec-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }

/* Преимущества */
.pp__advantages { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.pp__adv-card {
  display: flex; gap: 1rem; align-items: flex-start;
  background: rgba(255,255,255,0.025); border: 1px solid #1a1a1a; border-radius: 14px;
  padding: 1.25rem;
  animation: adv-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--ai, 0) * 70ms);
  transition: border-color 0.2s, background 0.2s;
}
.pp__adv-card:hover { border-color: rgba(230,184,0,0.2); background: rgba(230,184,0,0.02); }
.pp__adv-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  background: rgba(230,184,0,0.08); border: 1px solid rgba(230,184,0,0.15);
  border-radius: 10px; color: #e6b800;
  display: flex; align-items: center; justify-content: center;
}
.pp__adv-title { font-size: 0.9rem; font-weight: 700; color: #e0e0e0; margin: 0 0 0.35rem; }
.pp__adv-desc { font-size: 0.8rem; color: #666; line-height: 1.6; margin: 0; }
@keyframes adv-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

/* ── Похожие ── */
.pp-related { background: #070707; border-top: 1px solid #141414; padding: 3.5rem 1.5rem; }
.pp-related__inner { max-width: 1160px; margin: 0 auto; }
.pp-related__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.pp-related__title { font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0; }
.pp-related__all { display: inline-flex; align-items: center; gap: 0.35rem; color: #e6b800; text-decoration: none; font-size: 0.82rem; font-weight: 600; opacity: 0.8; transition: opacity 0.15s; }
.pp-related__all:hover { opacity: 1; }
.pp-related__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }

.pp-rel-card {
  background: #111; border: 1px solid #1a1a1a; border-radius: 14px;
  overflow: hidden; text-decoration: none; display: flex; flex-direction: column;
  transition: border-color 0.2s, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: rel-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--ri, 0) * 60ms);
}
.pp-rel-card:hover { border-color: rgba(230,184,0,0.35); transform: translateY(-3px); }
@keyframes rel-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

.pp-rel-card__img { height: 140px; background: #0d0d0d; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
.pp-rel-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.pp-rel-card:hover .pp-rel-card__img img { transform: scale(1.05); }
.pp-rel-card__no-img { opacity: 0.12; color: #e6b800; }
.pp-rel-card__overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
  color: #fff; opacity: 0; transition: opacity 0.2s;
}
.pp-rel-card:hover .pp-rel-card__overlay { opacity: 1; }
.pp-rel-card__body { padding: 0.85rem; display: flex; flex-direction: column; gap: 0.3rem; }
.pp-rel-card__cat { font-size: 0.65rem; color: #e6b800; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
.pp-rel-card__title { font-size: 0.83rem; color: #ccc; font-weight: 500; line-height: 1.4; }

/* ── Footer ── */
.pp-footer { padding: 2.5rem 1.5rem; background: #050505; border-top: 1px solid #141414; text-align: center; }
.pp-footer__inner { max-width: 1160px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.4rem; color: #444; font-size: 0.82rem; }
.pp-footer__inner a { color: #666; text-decoration: none; transition: color 0.15s; }
.pp-footer__inner a:hover { color: #e6b800; }
.pp-footer__inner p:first-child { color: #e6b800; font-weight: 600; font-size: 0.9rem; }

/* 404 */
.pp__404-ring { width: 80px; height: 80px; border-radius: 50%; background: rgba(230,184,0,0.06); border: 1px solid rgba(230,184,0,0.12); display: flex; align-items: center; justify-content: center; color: #e6b800; opacity: 0.5; }
.pp__404-title { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0; }
.pp__404-sub { color: #555; margin: 0; }

/* ── Модалка заявки ── */
.pp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.72); backdrop-filter: blur(6px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.pp-modal-enter-active { transition: opacity 0.25s; }
.pp-modal-leave-active { transition: opacity 0.2s; }
.pp-modal-enter-from, .pp-modal-leave-to { opacity: 0; }

.pp-modal {
  background: rgba(12,12,12,0.98); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px; padding: 2rem;
  width: 100%; max-width: 440px;
  position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.7);
}
.pp-modal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(230,184,0,0.5), transparent); border-radius: 20px 20px 0 0; }

.pp-modal__close { position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; width: 32px; height: 32px; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; }
.pp-modal__close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.pp-modal__head { display: flex; align-items: flex-start; gap: 0.85rem; margin-bottom: 1.5rem; }
.pp-modal__head-icon { width: 44px; height: 44px; flex-shrink: 0; background: rgba(230,184,0,0.1); border: 1px solid rgba(230,184,0,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #e6b800; }
.pp-modal__title { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0 0 0.2rem; }
.pp-modal__subtitle { font-size: 0.8rem; color: #555; margin: 0; line-height: 1.4; }

.pp-modal__form { display: flex; flex-direction: column; gap: 0.65rem; }
.pp-modal__input-wrap { position: relative; }
.pp-modal__input-icon { position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); color: #333; pointer-events: none; }
.pp-modal__input {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 0.75rem 0.9rem 0.75rem 2.6rem;
  color: #fff; font-size: 0.9rem; font-family: inherit; outline: none;
  transition: border-color 0.15s; box-sizing: border-box;
}
.pp-modal__input:focus { border-color: rgba(230,184,0,0.4); }
.pp-modal__input::placeholder { color: #2a2a2a; }
.pp-modal__textarea { resize: none; min-height: 60px; padding-left: 0.9rem; }

.pp-modal__consent {
  display: flex; align-items: flex-start; gap: 0.6rem; cursor: pointer;
  font-size: 0.72rem; color: #555; line-height: 1.5;
}
.pp-modal__consent-check { flex-shrink: 0; width: 14px; height: 14px; margin-top: 2px; accent-color: #e6b800; cursor: pointer; }
.pp-modal__consent-link { color: #e6b800; text-decoration: underline; }

.pp-modal__submit {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.9rem; background: #e6b800; color: #0a0a0a;
  font-size: 0.95rem; font-weight: 700; border: none; border-radius: 10px;
  cursor: pointer; font-family: inherit;
  transition: background 0.15s, transform 0.15s;
}
.pp-modal__submit:hover:not(:disabled) { background: #f5c842; transform: translateY(-1px); }
.pp-modal__submit:disabled { opacity: 0.6; cursor: not-allowed; }
.pp-modal__spinner { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #000; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-state-enter-active { transition: opacity 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-state-leave-active { transition: opacity 0.15s; }
.modal-state-enter-from { opacity: 0; transform: scale(0.96) translateY(8px); }
.modal-state-leave-to { opacity: 0; }

/* Успех */
.pp-modal__success { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 1rem 0; text-align: center; }
.pp-modal__success-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); display: flex; align-items: center; justify-content: center; animation: success-ring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes success-ring { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.pp-modal__check-path { stroke-dasharray: 30; stroke-dashoffset: 30; animation: draw-check 0.45s ease 0.2s forwards; }
@keyframes draw-check { to { stroke-dashoffset: 0; } }
.pp-modal__success-title { font-size: 1.2rem; font-weight: 700; color: #fff; margin: 0; }
.pp-modal__success-text { font-size: 0.875rem; color: #666; margin: 0; line-height: 1.6; }
.pp-modal__success-close { padding: 0.65rem 2rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; color: #888; font-family: inherit; font-size: 0.875rem; cursor: pointer; transition: background 0.15s, color 0.15s; }
.pp-modal__success-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* Адаптив */
@media (max-width: 900px) {
  .pp__layout { grid-template-columns: 1fr; gap: 2rem; }
  .pp__gallery-main { min-height: 280px; }
  .pp__advantages { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .pp-related__grid { grid-template-columns: repeat(2, 1fr); }
  .pp__tab-btn { padding: 0.6rem 0.85rem; font-size: 0.82rem; }
  .pp__spec-label { min-width: 120px; }
}
</style>
