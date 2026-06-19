<template>
  <section id="about" class="about">
    <div class="about__container">
      <div class="about__badge" data-reveal>О компании</div>
      <h2 class="about__title" data-reveal data-delay="1">
        Дальневосточные Системы Развития <span class="about__title-accent">(ДСР)</span>
      </h2>
      <p class="about__tagline" data-reveal data-delay="2">Строительство. Снабжение. Проектирование.</p>
      <div class="about__divider" data-reveal data-delay="2"></div>

      <div class="about__grid">
        <div class="about__text" data-reveal="left">
          <h3 class="about__subtitle">Почему обращаются к нам</h3>
          <p>
            У нас есть три ресурса, которые экономят ваше время и деньги: собственная техника,
            прямые поставки материалов и опыт строительства в условиях Дальнего Востока.
          </p>
          <p>
            Никаких посредников. Никаких задержек из-за аренды. Вы платите за работу и результат,
            а не за логистические паузы.
          </p>
          <p class="about__slogan">
            Смета фиксируется в договоре. Сроки — под обязательства.<br/>
            <strong>ДСР. Построено с расчётом на годы.</strong>
          </p>
        </div>

        <!-- Счётчики с анимацией -->
        <div class="about__stats" ref="statsRef">
          <div class="about__stat grad-border" data-reveal="scale" data-delay="1">
            <div class="about__stat-glow"></div>
            <span class="about__stat-num">
              <span ref="c1" class="about__stat-count">10</span>+
            </span>
            <span class="about__stat-label">лет на рынке</span>
          </div>
          <div class="about__stat grad-border" data-reveal="scale" data-delay="2">
            <div class="about__stat-glow"></div>
            <span class="about__stat-num">
              <span ref="c2" class="about__stat-count">2300</span>+
            </span>
            <span class="about__stat-label">позиций в каталоге</span>
          </div>
          <div class="about__stat grad-border" data-reveal="scale" data-delay="3">
            <div class="about__stat-glow"></div>
            <span class="about__stat-num">
              <span ref="c3" class="about__stat-count">500</span>+
            </span>
            <span class="about__stat-label">выполненных заказов</span>
          </div>
          <div class="about__stat grad-border" data-reveal="scale" data-delay="4">
            <div class="about__stat-glow"></div>
            <span class="about__stat-num">
              <span ref="c4" class="about__stat-count">4</span>
            </span>
            <span class="about__stat-label">направления работ</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

const statsRef = ref(null)
const c1 = ref(null)
const c2 = ref(null)
const c3 = ref(null)
const c4 = ref(null)

function countUp(el, target, duration = 1600) {
  if (!el) return
  const start = performance.now()
  const easeOut = (t) => 1 - Math.pow(1 - t, 3)
  function update(now) {
    const p = Math.min((now - start) / duration, 1)
    el.textContent = Math.round(easeOut(p) * target).toLocaleString('ru')
    if (p < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(c1.value, 10, 1200)
        countUp(c2.value, 2300, 2000)
        countUp(c3.value, 500, 1800)
        countUp(c4.value, 4, 800)
        observer.disconnect()
      }
    })
  }, { threshold: 0.4 })

  if (statsRef.value) observer.observe(statsRef.value)
})
</script>

<style scoped>
.about {
  padding: 6rem 1.5rem;
  background: #0f0f0f;
  position: relative;
  overflow: hidden;
}
.about::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(230,184,0,0.04), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.about__container {
  max-width: 1100px;
  margin: 0 auto;
}

.about__badge {
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

.about__title {
  font-size: clamp(1.9rem, 4.2vw, 3rem);
  font-weight: 700; margin-bottom: 0.5rem;
  background: linear-gradient(118deg, #ffffff 0%, #ffe9a3 58%, #e6b800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.about__title-accent { color: #e6b800; -webkit-text-fill-color: #e6b800; }

.about__tagline {
  font-size: 0.95rem; color: #555;
  margin-bottom: 1.25rem; letter-spacing: 0.05em;
  text-transform: uppercase;
}

.about__divider {
  width: 60px; height: 3px;
  background: linear-gradient(90deg, #e6b800, #f5c842);
  border-radius: 2px;
  margin-bottom: 3rem;
  box-shadow: 0 0 12px rgba(230,184,0,0.4);
}

.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about__subtitle {
  font-size: 1.2rem; font-weight: 600; color: #fff; margin-bottom: 1.25rem;
}
.about__text p {
  color: #909090; line-height: 1.85; margin-bottom: 1.25rem; font-size: 0.97rem;
}
.about__slogan {
  color: #777 !important;
  font-size: 0.93rem !important;
  border-left: 2px solid #e6b800;
  padding-left: 1rem;
  background: rgba(230,184,0,0.03);
  padding: 0.75rem 1rem;
  border-radius: 0 8px 8px 0;
}
.about__slogan strong { color: #e6b800; }

/* ── Счётчики ── */
.about__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.about__stat {
  position: relative;
  background: rgba(26,26,26,0.8);
  border: 1px solid #222;
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: default;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
  backdrop-filter: blur(8px);
}
.about__stat:hover {
  border-color: rgba(230,184,0,0.45);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(230,184,0,0.08);
}

.about__stat-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(230,184,0,0.06), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.about__stat:hover .about__stat-glow { opacity: 1; }

.about__stat-num {
  font-family: 'Space Grotesk', 'Montserrat', sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #e6b800;
  line-height: 1;
  letter-spacing: -0.04em;
}
.about__stat-count { display: inline; }

.about__stat-label {
  font-size: 0.82rem;
  color: #666;
  line-height: 1.4;
  font-weight: 500;
}

@media (max-width: 768px) {
  .about { padding: 4rem 1.25rem; }
  .about__grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .about__stats { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 400px) {
  .about__stats { grid-template-columns: 1fr; }
}
</style>
