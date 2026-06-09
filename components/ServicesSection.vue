<template>
  <section id="services" class="services">
    <div class="services__container">
      <div class="services__badge" data-reveal>Товары и услуги</div>
      <h2 class="services__title" data-reveal data-delay="1">Что мы предлагаем</h2>
      <div class="services__divider" data-reveal data-delay="2"></div>

      <div class="services__list">
        <a
          v-for="(item, index) in services"
          :key="index"
          :href="`/catalog?cat=${item.cat}`"
          class="service-row"
          data-reveal
          :data-delay="(index % 4) + 1"
        >
          <span class="service-row__left">
            <span class="service-row__info">
              <span class="service-row__title">{{ item.title }}</span>
              <span class="service-row__desc">{{ item.description }}</span>
            </span>
          </span>
          <span class="service-row__right">
            <span class="service-row__price">{{ item.price }}</span>
            <span class="service-row__arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </span>
        </a>
      </div>

      <!-- Кнопка каталога -->
      <div class="services__catalog" data-reveal>
        <a href="/catalog" class="services__catalog-btn">
          Открыть полный каталог
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

const services = [
  { title: 'Заборы и ограждения',       price: 'от 800 ₽/м.п.',   cat: 'fence3d',  description: 'Установка под ключ. Профнастил, сетка рабица, евроштакетник. Работаем по всему Приморскому краю.' },
  { title: 'Септики',                    price: 'от 45 000 ₽',     cat: 'septic',   description: 'Автономная канализация. Монтаж с земляными работами под ключ. Гарантия на установку.' },
  { title: 'Свайное поле',               price: 'от 3 500 ₽/свая', cat: 'piles',    description: 'Винтовые и забивные сваи. Надёжные фундаменты для любых грунтов. Собственная техника.' },
  { title: 'Малоэтажное строительство',  price: 'от 35 000 ₽/м²',  cat: 'services', description: 'Жилые дома и технические здания. Строительство с нуля под ключ. Смета в договоре.' },
  { title: 'Сварочные работы',           price: 'Уточнить',         cat: 'welding',  description: 'Вольеры, курятники, ворота, навесы, металлоконструкции под заказ. Сварка любой сложности.' },
  { title: 'Бытовки',                    price: 'от 65 000 ₽',     cat: 'garden',   description: 'Металлические и деревянные хозблоки. Утепление, окна, двери. Доставка и установка.' },
  { title: 'Коспострой',                 price: 'от 120 000 ₽',    cat: 'services', description: 'Быстровозводимые хозпостройки. Оперативное строительство без потери качества.' },
  { title: 'Снабжение',                  price: 'По запросу',       cat: 'services', description: 'Прямые поставки стройматериалов и оборудования. Металлопрокат, трубы, арматура и др.' },
  { title: 'Услуги техники',             price: 'от 2 500 ₽/час',  cat: 'services', description: 'Собственный парк — экскаватор, самосвал. Работа без аренды, быстро и выгодно.' },
]
</script>

<style scoped>
.services {
  padding: 6rem 1.5rem;
  background: #0a0a0a;
}

.services__container {
  max-width: 1100px;
  margin: 0 auto;
}

.services__badge {
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

.services__title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.25rem;
}

.services__divider {
  width: 60px;
  height: 3px;
  background: #e6b800;
  border-radius: 2px;
  margin-bottom: 3rem;
}

/* Список */
.services__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
}

/* Строка — теперь ссылка */
.service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  border: 1px solid #1e1e1e;
  border-radius: 14px;
  background: linear-gradient(145deg, #141410 0%, #111 100%);
  text-decoration: none;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  cursor: pointer;
}

.service-row:hover {
  border-color: rgba(230, 184, 0, 0.4);
  background: linear-gradient(145deg, #1c1a10 0%, #141414 100%);
  box-shadow: 0 4px 24px rgba(230, 184, 0, 0.06);
}

.service-row__left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex: 1;
  min-width: 0;
}

.service-row__info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.service-row__title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  transition: color 0.25s;
}

.service-row:hover .service-row__title {
  color: #e6b800;
}

.service-row__desc {
  font-size: 0.82rem;
  color: #555;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-row__right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.service-row__price {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e6b800;
  white-space: nowrap;
}

.service-row__arrow {
  color: #444;
  display: flex;
  align-items: center;
  transition: transform 0.25s, color 0.2s;
}

.service-row:hover .service-row__arrow {
  transform: translateX(4px);
  color: #e6b800;
}

/* Кнопка каталога */
.services__catalog { text-align: center; }

.services__catalog-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 2.5rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.services__catalog-btn:hover {
  background: #f5c842;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .services { padding: 4rem 1.25rem; }

  .service-row { padding: 0.9rem 1.1rem; }
  .service-row__price { display: none; }
  .service-row__desc { display: none; }
}
</style>
