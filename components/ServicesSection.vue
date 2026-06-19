<template>
  <section id="services" class="services">
    <div class="services__container">
      <div class="services__badge" data-reveal>Каталог</div>
      <h2 class="services__title" data-reveal data-delay="1">Наши товары и услуги</h2>
      <p class="services__desc" data-reveal data-delay="2">
        Более 2300 позиций — строительные материалы, оборудование и услуги для Дальнего Востока
      </p>
      <div class="services__divider" data-reveal data-delay="2"></div>

      <!-- Карточки направлений -->
      <div class="services__grid">
        <a
          v-for="(s, i) in services"
          :key="s.id"
          :href="`/catalog?cat=${s.id}`"
          class="svc-card grad-border"
          data-reveal="scale"
          :data-delay="String(i + 1)"
        >
          <div class="svc-card__glow"></div>
          <span class="svc-card__index">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="svc-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" v-html="icons[s.id]"></svg>
          </div>
          <div class="svc-card__body">
            <h3 class="svc-card__title">{{ s.title }}</h3>
            <p class="svc-card__desc">{{ s.desc }}</p>
          </div>
          <div class="svc-card__footer">
            <span class="svc-card__count">{{ s.count }} позиций</span>
            <svg class="svc-card__arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </a>
      </div>

      <!-- CTA -->
      <div class="services__cta" data-reveal>
        <a href="/catalog" class="services__cta-btn btn-shimmer">
          Открыть весь каталог
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <span class="services__cta-note">2300+ позиций · бесплатная консультация</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

// Чистые line-иконки (lucide-style) под каждое направление
const icons = {
  fence3d: '<path d="M3 8h18M3 14h18M7 4v17M12 4v17M17 4v17"/>',
  piles: '<path d="M12 3v12"/><path d="M8 6h8M8 9h8M8 12h8"/><path d="M9 15l3 6 3-6"/>',
  septic: '<path d="M12 3c4 5 6 7.6 6 11a6 6 0 1 1-12 0c0-3.4 2-6 6-11z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  metalroll: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
  pipe: '<path d="M14.6 4.6a4 4 0 0 0-5.3 5.3L3 16.2V21h4.8l6.3-6.3a4 4 0 0 0 5.3-5.3l-2.8 2.8-2.5-2.5 2.8-2.8z"/>',
  tanks: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
}

const services = [
  {
    id: 'fence3d',
    icon: '🏗️',
    title: 'Заборы 3D и сетчатые',
    desc: 'Панели 3D, сетки-рабицы, профнастил, ворота и калитки',
    count: '80+',
  },
  {
    id: 'piles',
    icon: '🔩',
    title: 'Свайные фундаменты',
    desc: 'Винтовые сваи, оголовки, фланцы для любых грунтов',
    count: '40+',
  },
  {
    id: 'septic',
    icon: '💧',
    title: 'Септики и канализация',
    desc: 'Автономные септики, монтаж под ключ, фитинги ПНД',
    count: '60+',
  },
  {
    id: 'metalroll',
    icon: '⚙️',
    title: 'Металлопрокат',
    desc: 'Трубы, профильный металл, нержавеющий прокат, арматура',
    count: '200+',
  },
  {
    id: 'pipe',
    icon: '🔧',
    title: 'Трубопроводная арматура',
    desc: 'Краны, задвижки, вентили, клапаны, фильтры, фитинги',
    count: '300+',
  },
  {
    id: 'tanks',
    icon: '🏠',
    title: 'Ёмкости и котлы',
    desc: 'Резервуары, котлы отопления, бытовки металлические',
    count: '50+',
  },
]
</script>

<style scoped>
.services {
  padding: 6rem 1.5rem;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}
.services::before {
  content: '';
  position: absolute;
  bottom: -200px; left: -200px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(230,184,0,0.04), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.services__container {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.services__badge {
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

.services__title {
  font-size: clamp(1.9rem, 4.2vw, 3rem);
  font-weight: 700;
  margin-bottom: 0.6rem;
  background: linear-gradient(118deg, #ffffff 0%, #ffe9a3 58%, #e6b800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.services__desc {
  font-size: 0.97rem; color: #666; margin-bottom: 1.25rem; line-height: 1.6;
}

.services__divider {
  width: 60px; height: 3px;
  background: linear-gradient(90deg, #e6b800, #f5c842);
  border-radius: 2px;
  margin-bottom: 3rem;
  box-shadow: 0 0 12px rgba(230,184,0,0.4);
}

/* ── Сетка карточек ── */
.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;
}

/* ── Карточка ── */
.svc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem 1.5rem 1.25rem;
  background: rgba(18,18,18,0.9);
  border: 1px solid #1e1e1e;
  border-radius: 18px;
  text-decoration: none;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.svc-card:hover {
  border-color: rgba(230,184,0,0.5);
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(230,184,0,0.06);
}

.svc-card__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(230,184,0,0.07), transparent 65%);
  opacity: 0;
  transition: opacity 0.35s;
  pointer-events: none;
}
.svc-card:hover .svc-card__glow { opacity: 1; }

.svc-card__icon {
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 14px;
  color: #e6b800;
  background: linear-gradient(150deg, rgba(245,200,66,0.14), rgba(230,184,0,0.04));
  border: 1px solid rgba(230,184,0,0.22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 18px rgba(230,184,0,0.10);
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s;
}
.svc-card:hover .svc-card__icon {
  transform: translateY(-3px);
  border-color: rgba(230,184,0,0.5);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 26px rgba(230,184,0,0.22);
}

.svc-card__index {
  position: absolute;
  top: 1.1rem; right: 1.2rem;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2e2e2e;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}
.svc-card:hover .svc-card__index { color: rgba(230,184,0,0.55); }

.svc-card__body { flex: 1; }

.svc-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  transition: color 0.2s;
}
.svc-card:hover .svc-card__title { color: #f5c842; }

.svc-card__desc {
  font-size: 0.82rem;
  color: #666;
  line-height: 1.6;
}

.svc-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.04);
  margin-top: auto;
}

.svc-card__count {
  font-size: 0.72rem;
  color: #444;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.svc-card__arrow {
  color: #333;
  transform: translateX(-4px);
  transition: transform 0.25s, color 0.25s;
}
.svc-card:hover .svc-card__arrow {
  color: #e6b800;
  transform: translateX(0);
}

/* ── CTA ── */
.services__cta {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.services__cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.75rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 1rem; font-weight: 700; font-family: inherit;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.services__cta-btn:hover {
  background: #f5c842;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(230,184,0,0.45);
}

.services__cta-note {
  font-size: 0.8rem;
  color: #444;
  letter-spacing: 0.04em;
}

@media (max-width: 900px) {
  .services__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 580px) {
  .services { padding: 4rem 1.25rem; }
  .services__grid { grid-template-columns: 1fr; }
}
</style>
