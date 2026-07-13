<template>
  <div>
    <!-- Золотой прогресс-бар навигации -->
    <NuxtLoadingIndicator color="#e6b800" :height="2" :duration="3000" :throttle="0" />

    <!-- Первичная загрузка приложения -->
    <Transition name="app-boot">
      <div v-if="booting" class="app-boot-overlay">
        <div class="app-boot-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path stroke="#e6b800" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
              d="M3 21V9m3-4v16M9 21V5l3-4v20M15 21V5l3-4v16M21 21V9M3 13h18"/>
          </svg>
          <span class="app-boot-name">ДСР</span>
        </div>
        <div class="app-boot-bar">
          <div class="app-boot-bar-fill"></div>
        </div>
      </div>
    </Transition>

    <!-- Скелетон при переходах между страницами -->
    <Transition name="skeleton-fade">
      <div v-if="routeLoading" class="route-skeleton">
        <div class="route-skeleton__inner">
          <div class="sk sk-badge"></div>
          <div class="sk sk-title"></div>
          <div class="sk sk-sub"></div>
          <div class="route-skeleton__grid">
            <div class="sk sk-card" v-for="n in 6" :key="n"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- NavBar живёт вне transition — никогда не мигает -->
    <NavBar v-if="!isAdmin" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SiteFooter v-if="!isAdmin" />
    <CookieBanner v-if="!isAdmin" />
    <TelegramBtn v-if="!isAdmin" />
    <WhatsAppBtn v-if="!isAdmin" />
    <AiAssistant v-if="!isAdmin" />

    <!-- Кнопка «Наверх» -->
    <transition name="back-top">
      <button v-if="showBackTop" class="back-top" @click="scrollToTop" aria-label="Наверх">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </transition>

    <!-- FAB корзины -->
    <transition name="cart-fab">
      <button v-if="count > 0" class="cart-fab" @click="drawerOpen = true" aria-label="Открыть список запросов">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
        </svg>
        <span class="cart-fab__label">Список запросов</span>
        <span class="cart-fab__badge" :class="{ 'cart-fab__badge--pop': badgePop }">{{ count }}</span>
        <span class="cart-fab__tooltip">{{ count }}&nbsp;{{ pluralize(count) }} в списке</span>
      </button>
    </transition>

    <!-- Overlay + Drawer -->
    <transition name="drawer-overlay">
      <div v-if="drawerOpen" class="cart-overlay" @click.self="drawerOpen = false">
        <transition name="drawer-slide">
          <div v-if="drawerOpen" class="cart-drawer" role="dialog" aria-label="Список запросов">

            <!-- Шапка -->
            <div class="cart-drawer__header">
              <div class="cart-drawer__header-left">
                <div class="cart-drawer__header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
                <div>
                  <h2 class="cart-drawer__title">Список запросов</h2>
                  <p class="cart-drawer__subtitle">{{ count }} {{ pluralize(count) }}</p>
                </div>
              </div>
              <div class="cart-drawer__header-actions">
                <button v-if="cartItems.length > 0" class="cart-drawer__clear" @click="clearCart" title="Очистить список">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                  </svg>
                  Очистить
                </button>
                <button class="cart-drawer__close" @click="drawerOpen = false" aria-label="Закрыть">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Прогресс-бар -->
            <div class="cart-drawer__progress">
              <div class="cart-drawer__progress-fill" :style="{ width: Math.min(count * 8, 100) + '%' }"></div>
            </div>

            <div class="cart-drawer__body">

              <!-- Пусто -->
              <div v-if="cartItems.length === 0" class="cart-drawer__empty">
                <div class="cart-drawer__empty-ring">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
                <p class="cart-drawer__empty-title">Список пуст</p>
                <p class="cart-drawer__empty-hint">Добавляйте товары из каталога и отправляйте запрос одним нажатием</p>
                <a href="/catalog" class="cart-drawer__go-catalog" @click="drawerOpen = false">
                  Перейти в каталог
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>

              <!-- Список с анимациями -->
              <TransitionGroup v-else name="cart-item" tag="div" class="cart-drawer__items">
                <div v-for="item in cartItems" :key="item.id" class="cart-item">
                  <div class="cart-item__icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
                    </svg>
                  </div>
                  <div class="cart-item__info">
                    <span class="cart-item__title">{{ item.title }}</span>
                    <div class="cart-item__qty">
                      <button class="cart-item__qty-btn" @click="setQuantity(item.id, item.quantity - 1)" aria-label="Уменьшить">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-width="2.5" d="M5 12h14"/>
                        </svg>
                      </button>
                      <input :value="item.quantity" @change="setQuantity(item.id, $event.target.value)"
                        type="number" min="1" class="cart-item__qty-input" />
                      <button class="cart-item__qty-btn" @click="setQuantity(item.id, item.quantity + 1)" aria-label="Увеличить">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-width="2.5" d="M12 5v14M5 12h14"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button class="cart-item__remove" @click="removeItem(item.id)" aria-label="Удалить">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    <span class="cart-item__remove-tip">Удалить</span>
                  </button>
                </div>
              </TransitionGroup>

              <!-- Форма заявки -->
              <form v-if="cartItems.length > 0" class="cart-drawer__form" @submit.prevent="submitCart">
                <p class="cart-drawer__form-title">Оставить заявку на все позиции</p>
                <div class="cart-input-wrap">
                  <svg class="cart-input-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                  </svg>
                  <input v-model="cartForm.name" type="text" placeholder="Ваше имя *" class="cart-input" maxlength="100" />
                </div>
                <div class="cart-input-wrap">
                  <svg class="cart-input-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                  <input :value="cartForm.phone" @input="cartForm.phone = phoneMask($event.target.value)"
                    type="tel" placeholder="+7 (___) ___-__-__" class="cart-input" maxlength="18" />
                </div>
                <textarea v-model="cartForm.message"
                  placeholder="Комментарий — сроки, адрес объекта..."
                  class="cart-input cart-textarea" rows="2" maxlength="500"></textarea>
                <label class="cart-drawer__consent">
                  <input v-model="cartForm.consent" type="checkbox" class="cart-drawer__consent-cb" />
                  <span>Я даю <a href="/consent" target="_blank">согласие на обработку персональных данных</a> и принимаю <a href="/privacy" target="_blank">Политику конфиденциальности</a></span>
                </label>
                <span v-if="cartConsentError" class="cart-drawer__consent-err">Необходимо согласие на обработку данных</span>
                <button type="submit" class="cart-submit btn-shimmer" :disabled="cartLoading">
                  <transition name="submit-text" mode="out-in">
                    <span v-if="cartLoading" key="loading" class="cart-submit__inner">
                      <span class="cart-submit__spinner"></span>
                      Отправляем…
                    </span>
                    <span v-else key="idle" class="cart-submit__inner">
                      Отправить запрос
                      <span class="cart-submit__count">{{ count }}</span>
                    </span>
                  </transition>
                </button>
                <transition name="cart-success">
                  <p v-if="cartSuccess" class="cart-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 6L9 17l-5-5"/>
                    </svg>
                    Заявка отправлена — мы свяжемся с вами
                  </p>
                </transition>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { phoneMask } from '~/composables/usePhoneMask.js'

const { cartItems, drawerOpen, removeItem, setQuantity, clearCart, count } = useCart()

// ── SEO: структурированная разметка Schema.org (сайтовая) ──
const SITE = 'https://dsr-dv.ru'
const businessLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': SITE + '/#business',
  name: 'ДСР — Дальневосточные Системы Развития',
  description: 'Снабжение, поставка и монтаж: заборы 3D, винтовые сваи, септики, кессоны, стройматериалы. Владивосток и Приморский край.',
  url: SITE,
  telephone: '+79143292929',
  email: 'ooo-dsr@bk.ru',
  image: SITE + '/og-dsr.jpg',
  logo: SITE + '/avatar-dsr.png',
  priceRange: '₽₽',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Русская, д. 17, каб. 704',
    addressLocality: 'Владивосток',
    addressRegion: 'Приморский край',
    addressCountry: 'RU',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 43.133645, longitude: 131.94008 },
  areaServed: [
    { '@type': 'City', name: 'Владивосток' },
    { '@type': 'AdministrativeArea', name: 'Приморский край' },
  ],
  sameAs: ['https://t.me/dsr2025'],
}
const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: SITE,
  name: 'ДСР — Дальневосточные Системы Развития',
  potentialAction: {
    '@type': 'SearchAction',
    target: SITE + '/catalog?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}
const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
useHead({
  link: [
    { rel: 'canonical', href: () => SITE + route.path },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(businessLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(websiteLd) },
  ],
})

// Boot-экран: показываем 600ms при первом посещении
const booting = ref(false)
onMounted(() => {
  if (!sessionStorage.getItem('dsr-booted')) {
    booting.value = true
    sessionStorage.setItem('dsr-booted', '1')
    setTimeout(() => { booting.value = false }, 900)
  }
})

// Скелетон при переходах между страницами (только если переход дольше ~120ms — без мигания)
const routeLoading = ref(false)
const nuxtApp = useNuxtApp()
const router = useRouter()
let navTimer = null
let lastPath = router.currentRoute.value.path
nuxtApp.hook('page:start', () => {
  clearTimeout(navTimer)
  navTimer = setTimeout(() => { routeLoading.value = true }, 120)
})
nuxtApp.hook('page:finish', () => {
  clearTimeout(navTimer)
  routeLoading.value = false
  // Скроллом управляет app/router.options.ts (возврат на прежнее место при «назад»).
})

const showBackTop = ref(false)
function onScroll() { showBackTop.value = window.scrollY > 500 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function pluralize(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'позиция'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'позиции'
  return 'позиций'
}

const badgePop = ref(false)
watch(count, () => {
  badgePop.value = false
  nextTick(() => {
    badgePop.value = true
    setTimeout(() => { badgePop.value = false }, 450)
  })
})

const cartLoading = ref(false)
const cartSuccess = ref(false)
const cartConsentError = ref(false)
const cartForm = reactive({ name: '', phone: '', message: '', consent: false })

async function submitCart() {
  cartConsentError.value = false
  if (!cartForm.name || !cartForm.phone) return
  if (!cartForm.consent) { cartConsentError.value = true; return }
  cartLoading.value = true

  const itemsList = cartItems.value
    .map(i => `${i.title}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`)
    .join('\n')

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: cartForm.name,
        phone: cartForm.phone,
        email: null,
        message: [cartForm.message, '---', itemsList].filter(Boolean).join('\n'),
        item_title: `Список из ${count.value} позиций`,
        item_price: null,
      },
    })
    cartSuccess.value = true
    cartForm.name = ''
    cartForm.phone = ''
    cartForm.message = ''
    cartForm.consent = false
    clearCart()
  } catch {
    cartForm.message = 'Ошибка. Позвоните нам напрямую.'
  } finally {
    cartLoading.value = false
  }
}
</script>

<style>
/* ── Кнопка Наверх ── */
.back-top {
  position: fixed;
  bottom: calc(8rem + 58px + 14px);
  right: 2rem;
  z-index: 89;
  width: 52px;
  height: 52px;
  background: rgba(18,18,18,0.92);
  border: 1px solid #333;
  border-radius: 50%;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.back-top:hover {
  background: #e6b800;
  color: #000;
  border-color: #e6b800;
  box-shadow: 0 6px 24px rgba(230,184,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
}
.back-top-enter-active, .back-top-leave-active { transition: opacity 0.2s, transform 0.2s; }
.back-top-enter-from, .back-top-leave-to { opacity: 0; transform: translateY(8px); }
@media (max-width: 480px) {
  .back-top { bottom: calc(6.75rem + 52px + 12px); right: 1.25rem; width: 46px; height: 46px; }
}

/* ── FAB корзины ── */
.cart-fab {
  position: fixed;
  bottom: 9rem;
  right: 2rem;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem 0 0.85rem;
  height: 44px;
  background: #e6b800;
  color: #0a0a0a;
  border: none;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(230,184,0,0.4), 0 2px 8px rgba(0,0,0,0.3);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}
.cart-fab:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 28px rgba(230,184,0,0.55), 0 4px 12px rgba(0,0,0,0.3);
}

.cart-fab__label { white-space: nowrap; }

.cart-fab__badge {
  background: #0a0a0a;
  color: #e6b800;
  font-size: 0.72rem;
  font-weight: 800;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.cart-fab__badge--pop {
  animation: badge-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes badge-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.6); }
  100% { transform: scale(1); }
}

.cart-fab__tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: rgba(12,12,12,0.96);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.07);
  color: #ccc;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.18s, transform 0.18s;
  pointer-events: none;
}
.cart-fab:hover .cart-fab__tooltip { opacity: 1; transform: translateY(0); }

.cart-fab-enter-active { transition: opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.cart-fab-leave-active { transition: opacity 0.2s, transform 0.2s; }
.cart-fab-enter-from, .cart-fab-leave-to { opacity: 0; transform: scale(0.75) translateY(8px); }

/* ── Overlay ── */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  z-index: 300;
  display: flex;
  justify-content: flex-end;
}
.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity 0.28s; }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0; }

/* ── Drawer ── */
.cart-drawer {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: rgba(10,10,10,0.98);
  backdrop-filter: blur(24px);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 60px rgba(0,0,0,0.7);
  border-left: 1px solid rgba(255,255,255,0.05);
}
.cart-drawer::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(230,184,0,0.6) 50%, transparent 100%);
}
.drawer-slide-enter-active { transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-slide-leave-active { transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

/* ── Header ── */
.cart-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
}
.cart-drawer__header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.cart-drawer__header-icon {
  width: 36px;
  height: 36px;
  background: rgba(230,184,0,0.1);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e6b800;
  flex-shrink: 0;
}
.cart-drawer__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}
.cart-drawer__subtitle {
  font-size: 0.72rem;
  color: #555;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.04em;
}
.cart-drawer__header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cart-drawer__clear {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  color: #555;
  font-size: 0.75rem;
  font-family: inherit;
  font-weight: 500;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.cart-drawer__clear:hover { border-color: rgba(255,100,100,0.4); color: #ff6b6b; }
.cart-drawer__close {
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.cart-drawer__close:hover { background: rgba(255,255,255,0.08); color: #fff; }

/* ── Прогресс ── */
.cart-drawer__progress {
  height: 2px;
  background: rgba(255,255,255,0.03);
  flex-shrink: 0;
}
.cart-drawer__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c9a000, #e6b800, #f5c842);
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(230,184,0,0.5);
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Body ── */
.cart-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a transparent;
}
.cart-drawer__body::-webkit-scrollbar { width: 4px; }
.cart-drawer__body::-webkit-scrollbar-track { background: transparent; }
.cart-drawer__body::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

/* ── Пустой ── */
.cart-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.75rem;
  flex: 1;
  padding: 3rem 1rem;
}
.cart-drawer__empty-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(230,184,0,0.06);
  border: 1px solid rgba(230,184,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e6b800;
  opacity: 0.7;
  animation: empty-breathe 3s ease-in-out infinite;
}
@keyframes empty-breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%       { transform: scale(1.08); opacity: 1; }
}
.cart-drawer__empty-title { font-size: 0.95rem; font-weight: 600; color: #888; margin: 0; }
.cart-drawer__empty-hint { font-size: 0.78rem; color: #444; margin: 0; line-height: 1.6; max-width: 220px; }
.cart-drawer__go-catalog {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #e6b800;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  border: 1px solid rgba(230,184,0,0.25);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.15s, border-color 0.15s;
  margin-top: 0.25rem;
}
.cart-drawer__go-catalog:hover { background: rgba(230,184,0,0.08); border-color: rgba(230,184,0,0.45); }

/* ── Items TransitionGroup ── */
.cart-drawer__items {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
}
.cart-item-enter-active { transition: opacity 0.35s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.cart-item-leave-active { transition: opacity 0.2s, transform 0.2s; }
.cart-item-move { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.cart-item-enter-from { opacity: 0; transform: translateX(20px); }
.cart-item-leave-to   { opacity: 0; transform: translateX(20px) scale(0.96); }

/* ── Карточка товара ── */
.cart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 0.85rem;
  transition: border-color 0.15s, background 0.15s;
}
.cart-item:hover {
  border-color: rgba(230,184,0,0.2);
  background: rgba(230,184,0,0.025);
}
.cart-item__icon-wrap {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
}
.cart-item:hover .cart-item__icon-wrap { color: #666; }

.cart-item__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.cart-item__title {
  font-size: 0.82rem; color: #ccc; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.cart-item__qty { display: flex; align-items: center; gap: 0.3rem; }
.cart-item__qty-btn {
  width: 22px; height: 22px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  color: #777; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  flex-shrink: 0;
}
.cart-item__qty-btn:hover { background: #e6b800; color: #000; border-color: #e6b800; }
.cart-item__qty-input {
  width: 32px; text-align: center;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
  color: #fff; font-size: 0.78rem; font-family: inherit;
  padding: 0.15rem; outline: none;
  -moz-appearance: textfield;
}
.cart-item__qty-input::-webkit-outer-spin-button,
.cart-item__qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }

.cart-item__remove {
  position: relative;
  background: none; border: none;
  width: 28px; height: 28px;
  border-radius: 7px;
  color: #333; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s, color 0.12s;
  flex-shrink: 0;
}
.cart-item__remove:hover { background: rgba(255,100,100,0.1); color: #ff6b6b; }
.cart-item__remove-tip {
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
  background: rgba(12,12,12,0.95);
  border: 1px solid rgba(255,100,100,0.2);
  color: #ff6b6b;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(3px);
  transition: opacity 0.15s, transform 0.15s;
}
.cart-item__remove:hover .cart-item__remove-tip { opacity: 1; transform: translateY(0); }

/* ── Форма ── */
.cart-drawer__form {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.cart-drawer__form-title {
  font-size: 0.82rem; font-weight: 600; color: #666;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin: 0 0 0.25rem;
}
.cart-input-wrap {
  position: relative;
}
.cart-input-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #444;
  pointer-events: none;
}
.cart-input {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 0.7rem 0.9rem 0.7rem 2.5rem;
  color: #fff; font-size: 0.875rem;
  font-family: inherit; outline: none;
  transition: border-color 0.15s, background 0.15s;
  box-sizing: border-box;
}
.cart-input:focus {
  border-color: rgba(230,184,0,0.4);
  background: rgba(230,184,0,0.03);
}
.cart-input::placeholder { color: #333; }
.cart-textarea {
  resize: none; min-height: 60px;
  padding-left: 0.9rem;
}
.cart-submit {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem;
  background: #e6b800; color: #0a0a0a;
  font-size: 0.9rem; font-weight: 700;
  border: none; border-radius: 10px;
  cursor: pointer; font-family: inherit;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
}
.cart-submit:hover:not(:disabled) {
  background: #f5c842;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(230,184,0,0.4);
}
.cart-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.cart-submit__inner { display: flex; align-items: center; gap: 0.5rem; }
.cart-submit__count {
  background: rgba(0,0,0,0.18);
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 6px;
}
.cart-submit__spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(0,0,0,0.25);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.submit-text-enter-active, .submit-text-leave-active { transition: opacity 0.15s; }
.submit-text-enter-from, .submit-text-leave-to { opacity: 0; }

.cart-drawer__consent {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}
.cart-drawer__consent-cb {
  margin-top: 2px;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  accent-color: #e6b800;
  cursor: pointer;
}
.cart-drawer__consent span {
  font-size: 0.72rem;
  color: #555;
  line-height: 1.55;
}
.cart-drawer__consent a { color: #888; text-decoration: underline; }
.cart-drawer__consent a:hover { color: #e6b800; }
.cart-drawer__consent-err {
  font-size: 0.72rem;
  color: #e05555;
  margin-top: -0.25rem;
}

.cart-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #4ade80;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.6rem;
  background: rgba(74,222,128,0.07);
  border-radius: 8px;
  border: 1px solid rgba(74,222,128,0.15);
}
.cart-success-enter-active { transition: opacity 0.3s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.cart-success-enter-from { opacity: 0; transform: translateY(-6px); }

@media (max-width: 480px) {
  .cart-fab { bottom: 8.5rem; right: 1.25rem; }
  .cart-drawer { max-width: 100%; }
}

/* ── Page transition: космический «варп» (расфокус + масштаб + дрейф) ── */
.page-enter-active {
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.55s ease;
}
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.35s ease, filter 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(26px) scale(0.985);
  filter: blur(9px);
}
.page-leave-to {
  opacity: 0;
  transform: scale(1.015);
  filter: blur(6px);
}
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active { transition: opacity 0.2s ease; }
  .page-enter-from,
  .page-leave-to { transform: none; filter: none; }
}

/* ── Boot-экран (первая загрузка) ── */
.app-boot-overlay {
  position: fixed;
  inset: 0;
  background: #0a0a0a;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.app-boot-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: boot-logo-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.app-boot-name {
  font-size: 2rem;
  font-weight: 800;
  color: #e6b800;
  letter-spacing: 0.1em;
  font-family: inherit;
}

@keyframes boot-logo-in {
  from { opacity: 0; transform: scale(0.8) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.app-boot-bar {
  width: 120px;
  height: 2px;
  background: rgba(255,255,255,0.07);
  border-radius: 2px;
  overflow: hidden;
}

.app-boot-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #c9a000, #e6b800, #f5c842);
  border-radius: 2px;
  animation: boot-fill 0.85s cubic-bezier(0.4, 0, 0.2, 1) both;
  box-shadow: 0 0 8px rgba(230,184,0,0.6);
}

@keyframes boot-fill {
  from { width: 0%; }
  to   { width: 100%; }
}

/* boot transition */
.app-boot-enter-active { transition: opacity 0.2s; }
.app-boot-leave-active { transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 1, 1); }
.app-boot-enter-from  { opacity: 0; }
.app-boot-leave-to    { opacity: 0; transform: scale(1.04); }

/* ── Скелетон при переходах между страницами ── */
.route-skeleton {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: #0a0a0a;
  padding: 110px 1.5rem 2rem;
  overflow: hidden;
}
.route-skeleton__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sk {
  position: relative;
  overflow: hidden;
  background: #141414;
  border: 1px solid #1b1b1b;
  border-radius: 12px;
}
.sk::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(230,184,0,0.10), rgba(255,255,255,0.05), transparent);
  animation: sk-shimmer 1.25s ease-in-out infinite;
}
@keyframes sk-shimmer { 100% { transform: translateX(100%); } }
.sk-badge { width: 120px; height: 26px; border-radius: 999px; }
.sk-title { width: min(62%, 440px); height: 44px; }
.sk-sub   { width: min(82%, 640px); height: 18px; margin-bottom: 1.25rem; }
.route-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.sk-card { height: 190px; }
@media (max-width: 900px) { .route-skeleton__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) {
  .route-skeleton { padding-top: 90px; }
  .route-skeleton__grid { grid-template-columns: 1fr; }
}

/* skeleton transition */
.skeleton-fade-enter-active { transition: opacity 0.15s ease; }
.skeleton-fade-leave-active { transition: opacity 0.3s ease; }
.skeleton-fade-enter-from, .skeleton-fade-leave-to { opacity: 0; }
</style>
