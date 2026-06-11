<template>
  <section class="hero">
    <!-- Анимированные orbs -->
    <div class="hero__orb hero__orb--1"></div>
    <div class="hero__orb hero__orb--2"></div>
    <div class="hero__orb hero__orb--3"></div>

    <canvas ref="canvas" class="hero__canvas"></canvas>

    <div class="hero__content">
      <div class="hero__logo hero__anim" style="animation-delay:0.1s">
        <DsrLogo size="lg" />
      </div>

      <h1 class="hero__title hero__anim" style="animation-delay:0.25s">
        Дальневосточные<br />
        <span class="text-shimmer">Системы Развития</span>
      </h1>

      <p class="hero__subtitle hero__anim" style="animation-delay:0.4s">
        Строительство. Снабжение. Проектирование.
      </p>

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
          <button type="submit" class="hero__search-btn btn-shimmer">Найти</button>
        </form>

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

      <!-- Быстрые факты -->
      <div class="hero__stats hero__anim" style="animation-delay:0.7s">
        <div class="hero__stat-item">
          <span class="hero__stat-num">2300+</span>
          <span class="hero__stat-label">товаров</span>
        </div>
        <div class="hero__stat-sep"></div>
        <div class="hero__stat-item">
          <span class="hero__stat-num">23</span>
          <span class="hero__stat-label">категории</span>
        </div>
        <div class="hero__stat-sep"></div>
        <div class="hero__stat-item">
          <span class="hero__stat-num">10+</span>
          <span class="hero__stat-label">лет на рынке</span>
        </div>
      </div>

      <a href="#about" class="hero__arrow hero__anim" style="animation-delay:0.85s" aria-label="Листать вниз">
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
const mouse = { x: -9999, y: -9999 }

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

  const onMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  window.addEventListener('mousemove', onMouseMove)

  const COUNT = 110
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.3,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.55 + 0.1,
    blue: Math.random() > 0.8,
  }))

  const CONNECT_DIST = 140
  const MOUSE_REPEL = 100

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height)

    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECT_DIST) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(230,184,0,${0.15 * (1 - dist / CONNECT_DIST)})`
          ctx.lineWidth = 0.6
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    particles.forEach((p) => {
      const mdx = p.x - mouse.x
      const mdy = p.y - mouse.y
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mdist < MOUSE_REPEL && mdist > 0) {
        const force = (MOUSE_REPEL - mdist) / MOUSE_REPEL * 0.7
        p.dx += (mdx / mdist) * force
        p.dy += (mdy / mdist) * force
      }
      p.dx *= 0.99
      p.dy *= 0.99

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.blue
        ? `rgba(120,160,255,${p.alpha * 0.7})`
        : `rgba(230,184,0,${p.alpha})`
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
    window.removeEventListener('mousemove', onMouseMove)
  })
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 20% 0%, #1a1a2e 0%, transparent 55%),
    radial-gradient(ellipse at 80% 100%, #0d1a0d 0%, transparent 50%),
    #0a0a0a;
  position: relative;
  overflow: hidden;
}

/* ── Орбы ── */
.hero__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
}
.hero__orb--1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(230,184,0,0.10), transparent 70%);
  top: -150px; left: -150px;
  animation: orb1 14s ease-in-out infinite;
}
.hero__orb--2 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(80,60,200,0.09), transparent 70%);
  bottom: -100px; right: -100px;
  animation: orb2 18s ease-in-out infinite;
}
.hero__orb--3 {
  width: 450px; height: 450px;
  background: radial-gradient(circle, rgba(0,200,120,0.06), transparent 70%);
  top: 45%; left: 50%;
  transform: translate(-50%, -50%);
  animation: orb3 22s ease-in-out infinite;
}
@keyframes orb1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33%       { transform: translate(80px,50px) scale(1.12); }
  66%       { transform: translate(-30px,100px) scale(0.9); }
}
@keyframes orb2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  40%       { transform: translate(-90px,-60px) scale(1.18); }
  70%       { transform: translate(50px,-80px) scale(0.85); }
}
@keyframes orb3 {
  0%, 100% { transform: translate(-50%,-50%) scale(1); }
  30%       { transform: translate(-50%,-50%) scale(1.25) rotate(20deg); }
  60%       { transform: translate(-50%,-50%) scale(0.78) rotate(-15deg); }
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

.hero__title {
  font-size: clamp(2rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  letter-spacing: -0.02em;
}

.hero__subtitle {
  font-size: 1rem;
  color: #777;
  max-width: 480px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

/* ── Поиск ── */
.hero__search-wrap {
  position: relative;
  width: 100%;
  max-width: 540px;
}
.hero__search {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  backdrop-filter: blur(16px);
  transition: border-color 0.25s, box-shadow 0.25s;
  overflow: hidden;
}
.hero__search:focus-within {
  border-color: rgba(230,184,0,0.55);
  box-shadow: 0 0 0 3px rgba(230,184,0,0.08), 0 8px 32px rgba(0,0,0,0.3);
}
.hero__search-icon { position: absolute; left: 1.1rem; color: #555; pointer-events: none; }
.hero__search-input {
  flex: 1;
  padding: 0.9rem 1rem 0.9rem 2.85rem;
  background: none; border: none;
  color: #fff; font-size: 0.95rem; font-family: inherit; outline: none; min-width: 0;
}
.hero__search-input::placeholder { color: #444; }
.hero__search-clear {
  background: none; border: none; color: #555; cursor: pointer; padding: 0.5rem; font-size: 0.8rem;
  transition: color 0.2s;
}
.hero__search-clear:hover { color: #fff; }
.hero__search-btn {
  margin: 0.3rem;
  padding: 0.65rem 1.4rem;
  background: #e6b800; color: #0a0a0a;
  font-size: 0.875rem; font-weight: 700; font-family: inherit;
  border: none; border-radius: 999px; cursor: pointer; white-space: nowrap;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  flex-shrink: 0;
}
.hero__search-btn:hover {
  background: #f5c842;
  transform: scale(1.04);
  box-shadow: 0 4px 16px rgba(230,184,0,0.4);
}

/* ── Подсказки ── */
.hero__suggestions {
  position: absolute;
  top: calc(100% + 8px); left: 0; right: 0;
  background: rgba(14,14,14,0.98);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 18px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7);
  z-index: 50;
}
.hero__suggestion-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.8rem 1.1rem; text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 0.15s;
}
.hero__suggestion-item:hover { background: rgba(230,184,0,0.07); }
.hero__suggestion-icon { font-size: 1.2rem; flex-shrink: 0; }
.hero__suggestion-info { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; min-width: 0; }
.hero__suggestion-title { font-size: 0.875rem; font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hero__suggestion-cat { font-size: 0.72rem; color: #555; }
.hero__suggestion-price { font-size: 0.8rem; font-weight: 700; color: #e6b800; white-space: nowrap; flex-shrink: 0; }
.hero__suggestion-all {
  display: block; text-align: center; padding: 0.7rem;
  font-size: 0.8rem; color: #e6b800; text-decoration: none;
  background: rgba(230,184,0,0.04); font-weight: 600; transition: background 0.15s;
}
.hero__suggestion-all:hover { background: rgba(230,184,0,0.1); }

.suggestions-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.suggestions-leave-active { transition: opacity 0.15s ease; }
.suggestions-enter-from { opacity: 0; transform: translateY(-6px); }
.suggestions-leave-to { opacity: 0; }

/* ── Статы ── */
.hero__stats {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 999px;
  padding: 0.6rem 0;
  backdrop-filter: blur(12px);
}
.hero__stat-item {
  display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
  padding: 0 1.5rem;
}
.hero__stat-num {
  font-size: 1.1rem; font-weight: 800; color: #e6b800; line-height: 1;
}
.hero__stat-label {
  font-size: 0.63rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em;
}
.hero__stat-sep { width: 1px; height: 28px; background: rgba(255,255,255,0.07); }

/* ── Стрелка ── */
.hero__arrow {
  margin-top: 1.5rem;
  display: inline-flex;
  opacity: 0.65;
  transition: opacity 0.2s;
  animation: bounce 2.2s ease-in-out infinite;
}
.hero__arrow:hover { opacity: 1; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(12px); }
}

/* ── Появление ── */
.hero__anim {
  opacity: 0;
  transform: translateY(28px);
  animation: heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes heroFadeUp {
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 580px) {
  .hero__stat-item { padding: 0 0.85rem; }
  .hero__stat-num { font-size: 0.95rem; }
  .hero__search-btn { padding: 0.55rem 1rem; font-size: 0.8rem; }
}
</style>
