<template>
  <section id="about" class="about">
    <div class="about__container">
      <div class="about__badge" data-reveal>О компании</div>
      <h2 class="about__title" data-reveal data-delay="1">Дальневосточные Системы Развития <span class="about__title-accent">(ДСР)</span></h2>
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
          <p class="about__slogan">Смета фиксируется в договоре. Сроки — под обязательства.<br/>
          <strong>ДСР. Построено с расчётом на годы.</strong></p>
        </div>

        <div class="about__stats">
          <div class="about__stat" data-reveal="scale" data-delay="1">
            <span class="about__stat-icon">01</span>
            <span class="about__stat-label">Собственная техника</span>
          </div>
          <div class="about__stat" data-reveal="scale" data-delay="2">
            <span class="about__stat-icon">02</span>
            <span class="about__stat-label">Прямые поставки материалов</span>
          </div>
          <div class="about__stat" data-reveal="scale" data-delay="3">
            <span class="about__stat-icon">03</span>
            <span class="about__stat-label">Фиксированная смета в договоре</span>
          </div>
          <div class="about__stat" data-reveal="scale" data-delay="4">
            <span class="about__stat-icon">04</span>
            <span class="about__stat-label">Опыт работы на Дальнем Востоке</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()
</script>

<style scoped>
.about {
  padding: 6rem 1.5rem;
  background: #0f0f0f;
}

.about__container {
  max-width: 1100px;
  margin: 0 auto;
}

.about__badge {
  display: inline-block;
  background: rgba(230, 184, 0, 0.12);
  color: #e6b800;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(230, 184, 0, 0.25);
  margin-bottom: 1.25rem;
}

.about__title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.about__title-accent {
  color: #e6b800;
}

.about__tagline {
  font-size: 1rem;
  color: #707070;
  margin-bottom: 1.25rem;
  letter-spacing: 0.04em;
}

.about__divider {
  width: 60px;
  height: 3px;
  background: #e6b800;
  border-radius: 2px;
  margin-bottom: 3rem;
}

.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about__subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.25rem;
}

.about__text p {
  color: #b0b0b0;
  line-height: 1.8;
  margin-bottom: 1.25rem;
  font-size: 1rem;
}

.about__slogan {
  color: #909090 !important;
  font-size: 0.95rem !important;
  border-left: 2px solid #e6b800;
  padding-left: 1rem;
}

.about__slogan strong {
  color: #e6b800;
}

.about__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.about__stat {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: border-color 0.2s;
}

.about__stat:hover {
  border-color: rgba(230, 184, 0, 0.4);
}

.about__stat-icon {
  font-size: 1.4rem;
  font-weight: 800;
  color: #e6b800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.about__stat-label {
  font-size: 0.85rem;
  color: #909090;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .about {
    padding: 4rem 1.25rem;
  }

  .about__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .about__stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 400px) {
  .about__stats {
    grid-template-columns: 1fr;
  }
}
</style>
