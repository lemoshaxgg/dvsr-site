<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__inner">
      <a href="/" class="navbar__logo">
        <DsrLogo size="sm" />
      </a>

      <!-- Десктоп меню -->
      <nav class="navbar__nav">
        <a href="/about" class="navbar__link navbar__link--pill">О компании</a>
        <a href="/#services" class="navbar__link navbar__link--pill">Услуги</a>
        <a href="/#map" class="navbar__link navbar__link--pill">Контакты</a>

        <!-- Каталог с дропдауном -->
        <div class="navbar__dropdown-wrap" @mouseenter="dropOpen = true" @mouseleave="dropOpen = false">
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

        <a href="/#contact" class="navbar__link navbar__link--cta">Связаться</a>
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
            <button class="navbar__mobile-group-toggle" @click="catalogOpen = !catalogOpen">
              <span class="navbar__mobile-group-label">Каталог</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"
                :style="{ transform: catalogOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6"/>
              </svg>
            </button>
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

          <a href="/#map" class="navbar__mobile-link" @click="menuOpen = false">Контакты</a>
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

const menuOpen   = ref(false)
const scrolled   = ref(false)
const dropOpen   = ref(false)
const catalogOpen = ref(false)

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
  transition: color 0.2s, background 0.2s, border-color 0.2s;
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
}

.navbar__link--cta:hover {
  background: #e6b800;
  color: #0a0a0a;
}

/* Дропдаун */
.navbar__dropdown-wrap {
  position: relative;
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
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
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
  background: none;
  border: none;
  padding: 0.85rem 0;
  cursor: pointer;
  font-family: inherit;
}

.navbar__mobile-group-label {
  font-size: 1rem;
  font-weight: 500;
  color: #c0c0c0;
}

.navbar__mobile-group-toggle svg { color: #555; }

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
  background: #e6b800;
  color: #0a0a0a;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.2s;
}
.navbar__mobile-cta-btn:hover { background: #f5c842; }

/* Слайд мобильного меню */
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .navbar__nav    { display: none; }
  .navbar__burger { display: flex; }
}
</style>
