<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__inner">
      <a href="/" class="navbar__logo">
        <DsrLogo size="sm" />
      </a>

      <!-- Десктоп меню -->
      <nav class="navbar__nav">
        <a href="/about" class="navbar__link navbar__link--pill">О компании</a>
        <a href="/promotions" class="navbar__link navbar__link--pill navbar__link--promo">Акции</a>
        <a href="/blog" class="navbar__link navbar__link--pill">Блог</a>

        <!-- Каталог с дропдауном -->
        <div class="navbar__dropdown-wrap" @mouseenter="openDrop" @mouseleave="closeDrop">
          <a href="/catalog" class="navbar__link navbar__link--pill navbar__link--active">
            Каталог
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class="navbar__drop-arrow" :class="{ rotated: dropOpen }">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6"/>
            </svg>
          </a>

          <transition name="dropdown">
            <div v-if="dropOpen" class="navbar__dropdown">
              <a
                v-for="cat in categories"
                :key="cat.id"
                :href="`/catalog?cat=${cat.id}`"
                class="navbar__dropdown-item"
              >
                <span>{{ cat.label }}</span>
              </a>
            </div>
          </transition>
        </div>

        <!-- Иконка корзины -->
        <button class="navbar__cart" @click="openDrawer" :class="{ 'has-items': cartCount > 0 }" aria-label="Список запросов">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          <span v-if="cartCount > 0" class="navbar__cart-badge">{{ cartCount }}</span>
        </button>

        <!-- Связаться — дропдаун контактов -->
        <div class="navbar__contact-wrap" @mouseenter="openContact" @mouseleave="closeContact">
          <button class="navbar__link navbar__link--cta navbar__contact-btn">
            Связаться
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24"
              class="navbar__drop-arrow" :class="{ rotated: contactOpen }">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          <transition name="dropdown">
            <div v-if="contactOpen" class="navbar__contact-drop">
              <a href="tel:+79143292929" class="navbar__contact-item">
                <span class="navbar__contact-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                  </svg>
                </span>
                <span class="navbar__contact-item-text">
                  <span class="navbar__contact-item-label">Телефон</span>
                  <span class="navbar__contact-item-value">+7 914 329-29-29</span>
                </span>
              </a>

              <a href="https://t.me/dsr2025" target="_blank" rel="noopener" class="navbar__contact-item">
                <span class="navbar__contact-item-icon navbar__contact-item-icon--tg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </span>
                <span class="navbar__contact-item-text">
                  <span class="navbar__contact-item-label">Telegram</span>
                  <span class="navbar__contact-item-value">@dsr2025</span>
                </span>
              </a>

              <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener" class="navbar__contact-item">
                <span class="navbar__contact-item-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <span class="navbar__contact-item-text">
                  <span class="navbar__contact-item-label">Email</span>
                  <span class="navbar__contact-item-value">ooo-dsr@bk.ru</span>
                </span>
              </a>

              <div class="navbar__contact-divider"></div>

              <a href="/#contact" class="navbar__contact-cta">
                Оставить заявку
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </transition>
        </div>
      </nav>

      <!-- Бургер -->
      <button class="navbar__burger" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen" aria-label="Меню">
        <span class="navbar__burger-line" :class="{ active: menuOpen }"></span>
        <span class="navbar__burger-line" :class="{ active: menuOpen }"></span>
        <span class="navbar__burger-line" :class="{ active: menuOpen }"></span>
      </button>
    </div>

    <!-- Мобильное меню -->
    <transition name="slide">
      <nav v-if="menuOpen" class="navbar__mobile-menu">
        <!-- Прокручиваемая часть -->
        <div class="navbar__mobile-scroll">
          <a href="/about"     class="navbar__mobile-link" @click="menuOpen = false">О компании</a>
          <a href="/#services" class="navbar__mobile-link" @click="menuOpen = false">Услуги</a>

          <!-- Каталог с аккордеоном -->
          <div class="navbar__mobile-group">
            <div class="navbar__mobile-group-toggle">
              <a href="/catalog" class="navbar__mobile-group-label" @click="menuOpen = false">Каталог</a>
              <button class="navbar__mobile-group-arrow" @click="catalogOpen = !catalogOpen" aria-label="Раскрыть категории">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"
                  :style="{ transform: catalogOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6"/>
                </svg>
              </button>
            </div>
            <div v-if="catalogOpen" class="navbar__mobile-cats">
              <a
                v-for="cat in categories"
                :key="cat.id"
                :href="`/catalog?cat=${cat.id}`"
                class="navbar__mobile-sub"
                @click="menuOpen = false"
              >{{ cat.label }}</a>
            </div>
          </div>

          <a href="/#map"       class="navbar__mobile-link" @click="menuOpen = false">Контакты</a>
          <a href="/promotions" class="navbar__mobile-link navbar__mobile-link--promo" @click="menuOpen = false">Акции</a>
          <a href="/blog"       class="navbar__mobile-link" @click="menuOpen = false">Блог</a>
          <button v-if="cartCount > 0" class="navbar__mobile-cart" @click="menuOpen = false; openDrawer()">
            Список запросов
            <span class="navbar__mobile-cart-badge">{{ cartCount }}</span>
          </button>
        </div>

        <!-- Кнопка "Связаться" всегда видна внизу -->
        <div class="navbar__mobile-cta">
          <a href="/#contact" class="navbar__mobile-cta-btn" @click="menuOpen = false">Связаться с нами</a>
        </div>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const menuOpen     = ref(false)
const scrolled     = ref(false)
const dropOpen     = ref(false)
const catalogOpen  = ref(false)
const contactOpen  = ref(false)

// Выпадайки: задержка закрытия, чтобы успеть довести курсор до панели
let dropTimer = null
function openDrop()     { clearTimeout(dropTimer); dropOpen.value = true }
function closeDrop()    { dropTimer = setTimeout(() => { dropOpen.value = false }, 180) }
let contactTimer = null
function openContact()  { clearTimeout(contactTimer); contactOpen.value = true }
function closeContact() { contactTimer = setTimeout(() => { contactOpen.value = false }, 180) }

const { count: cartCount, drawerOpen } = useCart()
function openDrawer() { drawerOpen.value = true }

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const categories = [
  { id: 'fence3d',  label: '3D заборы и ворота' },
  { id: 'mesh',     label: 'Сетки' },
  { id: 'piles',    label: 'Сваи и фундаменты' },
  { id: 'septic',   label: 'Септики и очистные' },
  { id: 'welding',  label: 'Сварочные работы' },
  { id: 'cellar',   label: 'Погреба' },
  { id: 'tanks',    label: 'Ёмкости пластиковые' },
  { id: 'boiler',   label: 'Котлы отопительные' },
  { id: 'pipe',     label: 'Трубопроводная арматура' },
  { id: 'industry', label: 'Промышленное оборудование' },
  { id: 'hardware', label: 'Метизы' },
  { id: 'docke',    label: 'Фасад DOCKE' },
  { id: 'garden',   label: 'Садовое оборудование' },
  { id: 'services', label: 'Услуги' },
]
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.3s, backdrop-filter 0.3s;
}

.navbar--scrolled {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.navbar__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.navbar__logo { text-decoration: none; display: inline-flex; align-items: center; }

/* Навигация */
.navbar__nav {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Пилюля-кнопка */
.navbar__link {
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #c0c0c0;
  transition: none;
}

.navbar__link--pill {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(8px);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: none;
}

.navbar__link--pill:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.18);
  color: #fff;
}

.navbar__link--active {
  border-color: rgba(230,184,0,0.3);
  background: rgba(230,184,0,0.07);
  color: #e6b800;
}

.navbar__link--active:hover {
  background: rgba(230,184,0,0.15);
  border-color: rgba(230,184,0,0.5);
  color: #f5c842;
}

.navbar__drop-arrow {
  transition: transform 0.25s;
  opacity: 0.7;
}
.navbar__drop-arrow.rotated { transform: rotate(180deg); }

.navbar__link--promo { color: #ff9f43; border-color: rgba(255,159,67,0.25); background: rgba(255,159,67,0.07); }
.navbar__link--promo:hover { color: #ffcc70; background: rgba(255,159,67,0.15); border-color: rgba(255,159,67,0.4); }

.navbar__cart {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #777;
  cursor: pointer;
  transition: none;
}
.navbar__cart:hover, .navbar__cart.has-items {
  color: #e6b800;
  background: rgba(230,184,0,0.1);
  border-color: rgba(230,184,0,0.35);
}
.navbar__cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

/* Телефон */
.navbar__link--phone {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #c0c0c0;
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}
.navbar__link--phone:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.18);
}

/* CTA кнопка */
.navbar__link--cta {
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid #e6b800;
  background: rgba(230,184,0,0.1);
  color: #e6b800;
  font-weight: 600;
  margin-left: 0.4rem;
  transition: background 0.12s, color 0.12s;
}

.navbar__link--cta:hover {
  background: linear-gradient(135deg, #f5c842 0%, #e6b800 50%, #c9a000 100%);
  color: #0a0a0a;
  box-shadow: 0 4px 16px rgba(230,184,0,0.35);
}

/* Дропдаун */
.navbar__dropdown-wrap {
  position: relative;
}

/* Невидимый «мостик» между кнопкой и панелью — чтобы выпадайка не закрывалась при наведении на неё */
.navbar__dropdown::before,
.navbar__contact-drop::before {
  content: '';
  position: absolute;
  left: -8px;
  right: -8px;
  top: -14px;
  height: 16px;
}

.navbar__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 16px;
  padding: 0.5rem;
  min-width: 240px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
  z-index: 200;
}

.navbar__dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: #b0b0b0;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
}

.navbar__dropdown-item:hover {
  background: rgba(230,184,0,0.1);
  color: #e6b800;
}

.navbar__dropdown-icon { font-size: 1.1rem; }

/* Анимация дропдауна */
.dropdown-enter-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.dropdown-leave-active {
  transition: opacity 0.07s ease, transform 0.07s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}

/* Бургер */
.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.navbar__burger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: #e6b800;
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}

.navbar__burger-line:nth-child(1).active { transform: translateY(7px) rotate(45deg); }
.navbar__burger-line:nth-child(2).active { opacity: 0; }
.navbar__burger-line:nth-child(3).active { transform: translateY(-7px) rotate(-45deg); }

/* Мобильное меню */
.navbar__mobile-menu {
  display: flex;
  flex-direction: column;
  background: rgba(12,12,12,0.97);
  backdrop-filter: blur(16px);
  border-top: 1px solid #1e1e1e;
  max-height: calc(100dvh - 64px);
  overflow: hidden;
}

.navbar__mobile-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 1.5rem;
  -webkit-overflow-scrolling: touch;
}

.navbar__mobile-link {
  display: block;
  color: #c0c0c0;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.85rem 0;
  border-bottom: 1px solid #1a1a1a;
  transition: color 0.2s;
}
.navbar__mobile-link:hover { color: #e6b800; }

.navbar__mobile-group {
  border-bottom: 1px solid #1a1a1a;
  padding: 0.25rem 0;
}

.navbar__mobile-group-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 0;
}

.navbar__mobile-group-label {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  color: #c0c0c0;
  text-decoration: none;
  transition: color 0.2s;
}
.navbar__mobile-group-label:hover { color: #e6b800; }

.navbar__mobile-group-arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #555;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.navbar__mobile-group-arrow:hover { color: #e6b800; }

.navbar__mobile-cats {
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.navbar__mobile-sub {
  display: block;
  color: #888;
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.navbar__mobile-sub:hover { background: rgba(230,184,0,0.08); color: #e6b800; }

/* «Акции» — единообразно с остальными пунктами меню */
.navbar__mobile-link--promo { color: #c0c0c0; }
.navbar__mobile-link--promo:hover { color: #e6b800; }

.navbar__mobile-cart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #1a1a1a;
  color: #e6b800;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  padding: 0.85rem 0;
  cursor: pointer;
  text-align: left;
}
.navbar__mobile-cart-badge {
  background: #e6b800;
  color: #0a0a0a;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

/* Кнопка связаться — всегда видна */
.navbar__mobile-cta {
  padding: 1rem 1.5rem;
  border-top: 1px solid #1e1e1e;
  background: rgba(12,12,12,0.97);
  flex-shrink: 0;
}

.navbar__mobile-cta-btn {
  display: block;
  text-align: center;
  padding: 0.85rem;
  background: linear-gradient(135deg, #f5c842 0%, #e6b800 50%, #c9a000 100%);
  color: #0a0a0a;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(230,184,0,0.28);
  transition: filter 0.2s, box-shadow 0.2s;
}
.navbar__mobile-cta-btn:hover {
  filter: brightness(1.08);
  box-shadow: 0 6px 22px rgba(230,184,0,0.45);
}

/* Слайд мобильного меню */
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Контакт-дропдаун ── */
.navbar__contact-wrap {
  position: relative;
  margin-left: 0.4rem;
}

.navbar__contact-btn {
  background: none;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.navbar__contact-drop {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(14,14,14,0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 16px;
  padding: 0.5rem;
  min-width: 230px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
  z-index: 200;
}

.navbar__contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.15s;
}
.navbar__contact-item:hover { background: rgba(255,255,255,0.05); }

.navbar__contact-item-icon {
  width: 30px; height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; justify-content: center;
  color: #777;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.navbar__contact-item:hover .navbar__contact-item-icon { background: rgba(230,184,0,0.1); color: #e6b800; }
.navbar__contact-item-icon--tg { color: #2bb5f0; }
.navbar__contact-item:hover .navbar__contact-item-icon--tg { background: rgba(43,181,240,0.12); color: #2bb5f0; }

.navbar__contact-item-text {
  display: flex; flex-direction: column; gap: 0.05rem;
}
.navbar__contact-item-label {
  font-size: 0.68rem; color: #444; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
}
.navbar__contact-item-value {
  font-size: 0.85rem; color: #ccc; font-weight: 600;
}
.navbar__contact-item:hover .navbar__contact-item-value { color: #fff; }

.navbar__contact-divider {
  height: 1px; background: rgba(255,255,255,0.06); margin: 0.4rem 0.5rem;
}

.navbar__contact-cta {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.65rem 0.85rem;
  background: rgba(230,184,0,0.1);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 10px;
  color: #e6b800;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.navbar__contact-cta:hover { background: rgba(230,184,0,0.18); border-color: rgba(230,184,0,0.4); }

@media (max-width: 768px) {
  .navbar__nav    { display: none; }
  .navbar__burger { display: flex; }
}
</style>
