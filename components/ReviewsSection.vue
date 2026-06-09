<template>
  <section id="reviews" class="reviews">
    <div class="reviews__container">
      <div class="reviews__badge" data-reveal>Отзывы</div>
      <h2 class="reviews__title" data-reveal data-delay="1">Что говорят клиенты</h2>
      <div class="reviews__divider" data-reveal data-delay="2"></div>

      <!-- Карусель -->
      <div class="reviews__carousel" data-reveal>
        <div class="reviews__track" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
          <div v-for="(review, i) in reviews" :key="i" class="reviews__slide">
            <div class="review-card">
              <div class="review-card__header">
                <div class="review-card__avatar">{{ review.initials }}</div>
                <div>
                  <p class="review-card__name">{{ review.name }}</p>
                  <p class="review-card__service">{{ review.service }}</p>
                </div>
                <div class="review-card__stars">
                  <span v-for="s in 5" :key="s" class="review-card__star">★</span>
                </div>
              </div>
              <p class="review-card__text">{{ review.text }}</p>
              <p class="review-card__date">{{ review.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Навигация -->
      <div class="reviews__nav">
        <button class="reviews__nav-btn" @click="prev" :disabled="activeIndex === 0">‹</button>
        <div class="reviews__dots">
          <button
            v-for="(_, i) in reviews"
            :key="i"
            class="reviews__dot"
            :class="{ active: activeIndex === i }"
            @click="activeIndex = i"
          ></button>
        </div>
        <button class="reviews__nav-btn" @click="next" :disabled="activeIndex === reviews.length - 1">›</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

const activeIndex = ref(0)

const reviews = [
  {
    initials: 'АК',
    name: 'Андрей Козлов',
    service: 'Забор из профнастила',
    text: 'Заказывал установку забора на даче. Приехали вовремя, сделали быстро и аккуратно. Смета не изменилась — заплатил ровно столько, сколько договорились. Очень доволен результатом, рекомендую!',
    date: 'Март 2025',
  },
  {
    initials: 'МС',
    name: 'Марина Степанова',
    service: 'Септик под ключ',
    text: 'Обращались по монтажу автономной канализации. Специалисты грамотно подобрали объём, объяснили все нюансы. Работу выполнили за 2 дня, убрали за собой территорию. Всё работает отлично уже полгода.',
    date: 'Февраль 2025',
  },
  {
    initials: 'ДП',
    name: 'Дмитрий Петров',
    service: 'Свайное поле',
    text: 'Нужен был фундамент для бани на сложном грунте. Ребята предложили оптимальное решение — винтовые сваи. Работу выполнили в один день. Фундамент стоит как влитой. Цена честная, без накруток.',
    date: 'Январь 2025',
  },
  {
    initials: 'ОВ',
    name: 'Ольга Васильева',
    service: 'Бытовка металлическая',
    text: 'Заказывала бытовку для строительной площадки. Привезли и установили за полдня. Качество хорошее, утепление нормальное. Зимой внутри тепло. Работать с компанией приятно — вежливые и ответственные.',
    date: 'Декабрь 2024',
  },
  {
    initials: 'ИР',
    name: 'Иван Романов',
    service: 'Услуги техники',
    text: 'Арендовал экскаватор для земляных работ. Оператор опытный, технику знает хорошо. Работу выполнили быстро и качественно. Цена ниже чем у конкурентов, при этом без аренды — только оплата работы.',
    date: 'Ноябрь 2024',
  },
]

function prev() {
  if (activeIndex.value > 0) activeIndex.value--
}

function next() {
  if (activeIndex.value < reviews.length - 1) activeIndex.value++
}
</script>

<style scoped>
.reviews {
  padding: 6rem 1.5rem;
  background: #0f0f0f;
  overflow: hidden;
}

.reviews__container {
  max-width: 900px;
  margin: 0 auto;
}

.reviews__badge {
  display: inline-block;
  background: rgba(230,184,0,0.12);
  color: #e6b800;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(230,184,0,0.25);
  margin-bottom: 1.25rem;
}

.reviews__title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
}

.reviews__divider {
  width: 60px;
  height: 3px;
  background: #e6b800;
  border-radius: 2px;
  margin-bottom: 3rem;
}

/* Карусель */
.reviews__carousel {
  overflow: hidden;
  border-radius: 16px;
}

.reviews__track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.reviews__slide {
  min-width: 100%;
}

/* Карточка */
.review-card {
  background: linear-gradient(145deg, #1c1a10, #141414);
  border: 1px solid rgba(230,184,0,0.15);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card__header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.review-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(230,184,0,0.15);
  border: 2px solid rgba(230,184,0,0.3);
  color: #e6b800;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-card__name {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

.review-card__service {
  font-size: 0.78rem;
  color: #e6b800;
  margin-top: 0.1rem;
}

.review-card__stars {
  margin-left: auto;
  display: flex;
  gap: 2px;
}
.review-card__star {
  color: #e6b800;
  font-size: 0.9rem;
  line-height: 1;
}

.review-card__text {
  color: #a0a0a0;
  line-height: 1.75;
  font-size: 0.95rem;
  font-style: italic;
}

.review-card__date {
  font-size: 0.75rem;
  color: #444;
  margin-top: 0.25rem;
}

/* Навигация */
.reviews__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.reviews__nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #2a2a2a;
  background: #141414;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reviews__nav-btn:hover:not(:disabled) { border-color: #e6b800; color: #e6b800; }
.reviews__nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.reviews__dots {
  display: flex;
  gap: 0.4rem;
}

.reviews__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #2a2a2a;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}
.reviews__dot.active {
  background: #e6b800;
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .reviews { padding: 4rem 1.25rem; }
  .review-card { padding: 1.5rem; }
  .review-card__stars { display: none; }
}
</style>
