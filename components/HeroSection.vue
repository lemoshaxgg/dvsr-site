<template>
  <section class="hero">
    <canvas ref="canvas" class="hero__canvas"></canvas>

    <div class="hero__content">
      <div class="hero__logo hero__anim" style="animation-delay:0.1s">
        <DsrLogo size="lg" />
      </div>

      <h1 class="hero__title hero__anim" style="animation-delay:0.25s">
        Дальневосточные<br />
        <span class="hero__title-accent">Системы Развития</span>
      </h1>

      <p class="hero__subtitle hero__anim" style="animation-delay:0.4s">Строительство. Снабжение. Проектирование.</p>

      <!-- Поиск -->
      <div class="hero__search-wrap hero__anim" style="animation-delay:0.55s" v-click-outside="closeSuggestions">
        <form class="hero__search" @submit.prevent="goSearch">
          <svg class="hero__search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="query"
            type="text"
            class="hero__search-input"
            placeholder="Найти услугу или товар..."
            autocomplete="off"
            @focus="showSuggestions = true"
          />
          <button v-if="query" type="button" class="hero__search-clear" @click="query = ''">✕</button>
          <button type="submit" class="hero__search-btn">Найти</button>
        </form>

        <!-- Подсказки -->
        <transition name="suggestions">
          <div v-if="showSuggestions && suggestions.length > 0" class="hero__suggestions">
            <a
              v-for="item in suggestions"
              :key="item.id"
              :href="`/catalog?search=${encodeURIComponent(item.title)}`"
              class="hero__suggestion-item"
            >
              <span class="hero__suggestion-icon">{{ item.icon }}</span>
              <span class="hero__suggestion-info">
                <span class="hero__suggestion-title">{{ item.title }}</span>
                <span class="hero__suggestion-cat">{{ item.categoryLabel }}</span>
              </span>
              <span class="hero__suggestion-price">Уточнить цену</span>
            </a>
            <a :href="`/catalog?search=${encodeURIComponent(query)}`" class="hero__suggestion-all">
              Смотреть все результаты →
            </a>
          </div>
        </transition>
      </div>

      <a href="#about" class="hero__arrow hero__anim" style="animation-delay:0.7s" aria-label="Листать вниз">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
          <path stroke="#e6b800" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { catalogItems } from '~/composables/useCatalogItems.js'

defineProps({ logoSrc: { type: String, default: null } })

const query = ref('')
const showSuggestions = ref(false)

const suggestions = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return catalogItems
    .filter(i => i.title.toLowerCase().includes(q) || i.categoryLabel.toLowerCase().includes(q))
    .slice(0, 6)
})

function goSearch() {
  window.location.href = query.value.trim()
    ? `/catalog?search=${encodeURIComponent(query.value.trim())}`
    : '/catalog'
}

function closeSuggestions() {
  showSuggestions.value = false
}

// Директива v-click-outside
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value() }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  },
}

const canvas = ref(null)
let animFrame = null

onMounted(() => {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')

  const resize = () => {
    c.width  = window.innerWidth
    c.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const COUNT = 80
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: Math.random() * 1.5 + 0.4,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.15,
  }))

  const CONNECT_DIST = 130

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height)

    // Соединяем близкие частицы линиями
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECT_DIST) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(230,184,0,${0.12 * (1 - dist / CONNECT_DIST)})`
          ctx.lineWidth = 0.6
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Рисуем точки
    particles.forEach((p) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(230,184,0,${p.alpha})`
      ctx.fill()

      p.x += p.dx
      p.y += p.dy

      if (p.x < 0 || p.x > c.width)  p.dx *= -1
      if (p.y < 0 || p.y > c.height) p.dy *= -1
    })

    animFrame = requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animFrame)
    window.removeEventListener('resize', resize)
  })
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 70%);
  position: relative;
  overflow: hidden;
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 6rem 1.5rem 3rem;
  width: 100%;
  max-width: 700px;
}

.hero__logo-placeholder {
  width: 140px;
  height: 140px;
  border: 2px dashed #e6b800;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e6b800;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.hero__logo-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.hero__title-accent {
  color: #e6b800;
}

.hero__subtitle {
  font-size: 1.1rem;
  color: #a0a0a0;
  max-width: 480px;
  line-height: 1.6;
  letter-spacing: 0.05em;
}

/* Поиск */
.hero__search-wrap {
  position: relative;
  width: 100%;
  max-width: 520px;
}

.hero__search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px;
  backdrop-filter: blur(12px);
  transition: border-color 0.2s, background 0.2s;
  overflow: hidden;
}

.hero__search:focus-within {
  border-color: rgba(230,184,0,0.5);
  background: rgba(255,255,255,0.09);
}

/* Подсказки */
.hero__suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(16,16,16,0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.6);
  z-index: 50;
}

.hero__suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition: background 0.15s;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.hero__suggestion-item:last-of-type { border-bottom: none; }
.hero__suggestion-item:hover { background: rgba(230,184,0,0.08); }

.hero__suggestion-icon { font-size: 1.2rem; flex-shrink: 0; }

.hero__suggestion-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}
.hero__suggestion-title { font-size: 0.875rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hero__suggestion-cat { font-size: 0.72rem; color: #555; }

.hero__suggestion-price { font-size: 0.8rem; font-weight: 700; color: #e6b800; white-space: nowrap; flex-shrink: 0; }

.hero__suggestion-all {
  display: block;
  text-align: center;
  padding: 0.65rem;
  font-size: 0.8rem;
  color: #e6b800;
  text-decoration: none;
  background: rgba(230,184,0,0.05);
  font-weight: 600;
  transition: background 0.15s;
}
.hero__suggestion-all:hover { background: rgba(230,184,0,0.12); }

.suggestions-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.suggestions-leave-active { transition: opacity 0.15s ease; }
.suggestions-enter-from { opacity: 0; transform: translateY(-6px); }
.suggestions-leave-to { opacity: 0; }

.hero__search-icon {
  position: absolute;
  left: 1.1rem;
  color: #666;
  pointer-events: none;
  flex-shrink: 0;
}

.hero__search-input {
  flex: 1;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  min-width: 0;
}

.hero__search-input::placeholder { color: #555; }

.hero__search-btn {
  margin: 0.3rem;
  padding: 0.6rem 1.3rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  flex-shrink: 0;
}

.hero__search-btn:hover { background: #f5c842; }

@media (max-width: 480px) {
  .hero__search { max-width: 100%; }
  .hero__search-btn { padding: 0.55rem 1rem; font-size: 0.8rem; }
}

.hero__arrow {
  margin-top: 2rem;
  display: inline-flex;
  animation: bounce 2s infinite;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.hero__arrow:hover { opacity: 1; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(10px); }
}

.hero__anim {
  opacity: 0;
  transform: translateY(24px);
  animation: heroFadeUp 0.7s ease forwards;
}

@keyframes heroFadeUp {
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .hero__logo-placeholder,
  .hero__logo-img { width: 100px; height: 100px; }
  .hero__subtitle { font-size: 0.95rem; padding: 0 0.5rem; }
  .hero__arrow    { margin-top: 1rem; }
}
</style>
