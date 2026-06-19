<template>
  <section class="trust">
    <div class="trust__container">

      <div class="trust__badge" data-reveal>Почему выбирают нас</div>
      <h2 class="trust__title" data-reveal data-delay="1">Надёжность, подтверждённая делом</h2>
      <div class="trust__divider" data-reveal data-delay="2"></div>

      <!-- Метрики -->
      <div class="trust__metrics">
        <div
          v-for="(m, i) in metrics"
          :key="i"
          class="trust__metric"
          data-reveal="scale"
          :data-delay="String(i + 1)"
        >
          <div class="trust__metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" v-html="metricIcons[m.icon]"></svg>
          </div>
          <div class="trust__metric-value">{{ m.value }}</div>
          <div class="trust__metric-label">{{ m.label }}</div>
        </div>
      </div>

      <!-- Карточки гарантий -->
      <div class="trust__cards">
        <div
          v-for="(card, i) in cards"
          :key="i"
          class="trust__card grad-border"
          data-reveal
          :data-delay="String(i + 1)"
        >
          <div class="trust__card-icon">
            <svg v-if="card.icon === 'shield'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4"/>
            </svg>
            <svg v-else-if="card.icon === 'doc'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            <svg v-else-if="card.icon === 'truck'" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" x="1" y="3" width="15" height="13" rx="1"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 8h4l3 5v4h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="1.8"/>
              <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </div>
          <div class="trust__card-body">
            <h3 class="trust__card-title">{{ card.title }}</h3>
            <p class="trust__card-desc">{{ card.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Лента с логотипами партнёров/сертификатов -->
      <div class="trust__badges" data-reveal>
        <div class="trust__badge-item" v-for="b in badges" :key="b">
          <span class="trust__badge-dot"></span>
          {{ b }}
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

const metricIcons = {
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
  building: '<path d="M3 21h18M5 21V7l5-4 5 4M14 21V11l5-3v13"/><path d="M9 9h0M9 13h0M9 17h0"/>',
  box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  star: '<path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 17l-5.4 2.6 1-6L3.3 9.4l6-.9L12 3z"/>',
}

const metrics = [
  { icon: 'calendar', value: '10+', label: 'лет на рынке' },
  { icon: 'building', value: '500+', label: 'выполненных объектов' },
  { icon: 'box', value: '2300+', label: 'позиций в каталоге' },
  { icon: 'star', value: '4.9', label: 'средняя оценка клиентов' },
]

const cards = [
  {
    icon: 'shield',
    title: 'Гарантия на все работы',
    desc: 'Даём официальную гарантию на монтаж заборов, свайных фундаментов и септиков. Приедем и устраним — бесплатно.',
  },
  {
    icon: 'doc',
    title: 'Официальная документация',
    desc: 'Работаем как ООО. Договор, счёт, акт выполненных работ — полный пакет документов для физических и юридических лиц.',
  },
  {
    icon: 'truck',
    title: 'Доставка по Приморью',
    desc: 'Доставляем материалы по Владивостоку и краю. Подберём удобное время, привезём точно в срок.',
  },
  {
    icon: 'phone',
    title: 'Консультация бесплатно',
    desc: 'Ответим на вопросы, поможем с расчётом материалов и выбором решения — без навязывания и без оплаты.',
  },
]

const badges = [
  'ООО «ДСР»', 'ИНН 2543194970', 'Договор и акт', 'Гарантия на монтаж', 'Работаем с 2015 года', 'Владивосток и Приморье',
]
</script>

<style scoped>
.trust {
  padding: 6rem 1.5rem;
  background: #060606;
  position: relative;
  overflow: hidden;
}
.trust::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(230,184,0,0.04), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.trust__container {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.trust__badge {
  display: inline-block;
  background: rgba(230,184,0,0.1);
  color: #e6b800;
  font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  padding: 0.35rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(230,184,0,0.2);
  margin-bottom: 1.25rem;
}

.trust__title {
  font-size: clamp(1.9rem, 4.2vw, 3rem);
  font-weight: 700;
  margin-bottom: 0.6rem;
  background: linear-gradient(118deg, #ffffff 0%, #ffe9a3 58%, #e6b800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trust__divider {
  width: 60px; height: 3px;
  background: linear-gradient(90deg, #e6b800, #f5c842);
  border-radius: 2px;
  margin-bottom: 3rem;
  box-shadow: 0 0 12px rgba(230,184,0,0.4);
}

/* Метрики */
.trust__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 2.5rem;
}

.trust__metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  background: #0d0d0d;
  gap: 0.5rem;
  transition: background 0.2s;
}
.trust__metric:hover { background: #111; }

.trust__metric-icon {
  width: 46px; height: 46px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  color: #e6b800;
  background: linear-gradient(150deg, rgba(245,200,66,0.13), rgba(230,184,0,0.03));
  border: 1px solid rgba(230,184,0,0.18);
  margin-bottom: 0.35rem;
  transition: transform 0.3s, border-color 0.3s;
}
.trust__metric:hover .trust__metric-icon {
  transform: translateY(-2px);
  border-color: rgba(230,184,0,0.4);
}

.trust__metric-value {
  font-family: 'Space Grotesk', 'Montserrat', sans-serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #e6b800;
  line-height: 1;
  letter-spacing: -0.03em;
}

.trust__metric-label {
  font-size: 0.8rem;
  color: #555;
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* Карточки */
.trust__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.trust__card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #0d0d0d;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  transition: border-color 0.25s, background 0.25s;
}
.trust__card:hover {
  border-color: rgba(230,184,0,0.25);
  background: #111;
}

.trust__card-icon {
  flex-shrink: 0;
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(230,184,0,0.08);
  border: 1px solid rgba(230,184,0,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #e6b800;
}

.trust__card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.35rem;
}

.trust__card-desc {
  font-size: 0.82rem;
  color: #555;
  line-height: 1.6;
}

/* Лента */
.trust__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.trust__badge-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid #1e1e1e;
  border-radius: 999px;
  font-size: 0.78rem;
  color: #555;
  font-weight: 500;
}

.trust__badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #e6b800;
  opacity: 0.5;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .trust { padding: 4rem 1.25rem; }
  .trust__metrics { grid-template-columns: repeat(2, 1fr); }
  .trust__cards { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .trust__metrics { grid-template-columns: repeat(2, 1fr); }
}
</style>
