<template>
  <div>
    <NavBar />

    <main class="about-page">

      <!-- Герой -->
      <section class="ap-hero">
        <div class="ap-hero__inner">
          <div class="ap-hero__badge">О компании</div>
          <h1 class="ap-hero__title">
            Дальневосточные<br/>
            <span class="ap-accent">Системы Развития</span>
          </h1>
          <p class="ap-hero__sub">Снабжение. Строительство. Спецтехника — всё для Дальнего Востока</p>
          <div class="ap-hero__meta">
            <span>📍 Владивосток, ул. Русская, 17</span>
            <span>📞 <a href="tel:+79143292929">+7 914 329-29-29</a></span>
          </div>
        </div>
      </section>

      <!-- Кто мы -->
      <section class="ap-section">
        <div class="ap-container ap-who">
          <div class="ap-who__text" data-reveal="left">
            <div class="ap-badge">Коротко о нас</div>
            <h2 class="ap-section__title">Комплексный партнёр<br/>для бизнеса и строительства</h2>
            <p>
              ДСР — владивостокская компания, которая поставляет строительные материалы,
              промышленное оборудование, судовые комплектующие и обеспечивает работу
              спецтехники на объектах Дальнего Востока.
            </p>
            <p>
              Работаем напрямую с производителями и официальными дистрибьюторами —
              без лишних звеньев в цепочке. Принимаем заявки на разовые поставки
              и долгосрочное снабжение.
            </p>
            <div class="ap-who__list">
              <div class="ap-who__item">
                <span class="ap-who__dot"></span>
                Прямые поставки — без посредников
              </div>
              <div class="ap-who__item">
                <span class="ap-who__dot"></span>
                Широкая номенклатура: от метизов до септиков
              </div>
              <div class="ap-who__item">
                <span class="ap-who__dot"></span>
                Собственная спецтехника на объекте
              </div>
              <div class="ap-who__item">
                <span class="ap-who__dot"></span>
                Работаем с юридическими и физическими лицами
              </div>
            </div>
          </div>
          <div class="ap-who__photo" data-reveal="right">
            <img src="/catalog/fence3d.jpg" alt="Заборы ДСР — забор 3D из профнастила" />
            <div class="ap-who__photo-label">Объекты по всему Владивостоку</div>
          </div>
        </div>
      </section>

      <!-- Направления -->
      <section class="ap-section ap-section--dark">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Чем занимаемся</div>
            <h2 class="ap-section__title">Основные направления</h2>
          </div>
          <div class="ap-dirs">
            <div class="ap-dir" data-reveal="scale" data-delay="1">
              <div class="ap-dir__img">
                <img src="/catalog/proflist.jpg" alt="Строительные материалы" />
              </div>
              <div class="ap-dir__body">
                <h3 class="ap-dir__title">Строительные материалы</h3>
                <p class="ap-dir__text">
                  Трубопрокат стальной и пластиковый, профлист, метизы, сантехника,
                  трубы ПНД/ПЭ/ПП, арматура трубопроводная. Любая номенклатура под заказ.
                </p>
              </div>
            </div>
            <div class="ap-dir" data-reveal="scale" data-delay="2">
              <div class="ap-dir__img">
                <img src="/catalog/piles.jpg" alt="Сваи и фундаменты" />
              </div>
              <div class="ap-dir__body">
                <h3 class="ap-dir__title">Заборы, сваи, септики</h3>
                <p class="ap-dir__text">
                  3D-заборы и ворота, сетки, винтовые и лопастные сваи, септики,
                  кессоны, погреба, пластиковые ёмкости — всё для частного дома и объекта.
                </p>
              </div>
            </div>
            <div class="ap-dir" data-reveal="scale" data-delay="3">
              <div class="ap-dir__img">
                <img src="/catalog/proflist.jpg" alt="Промышленное оборудование" />
              </div>
              <div class="ap-dir__body">
                <h3 class="ap-dir__title">Промышленное оборудование</h3>
                <p class="ap-dir__text">
                  Котлы отопительные, дымоходы, РТИ и комплектующие, судовые подшипники,
                  запасные части (ЗИП). Поставка оборудования известных брендов.
                </p>
              </div>
            </div>
            <div class="ap-dir" data-reveal="scale" data-delay="4">
              <div class="ap-dir__img">
                <img src="/catalog/septic.jpg" alt="Спецтехника и грузоперевозки" />
              </div>
              <div class="ap-dir__body">
                <h3 class="ap-dir__title">Спецтехника и перевозки</h3>
                <p class="ap-dir__text">
                  Услуги экскаватора и самосвала для земляных и строительных работ.
                  Грузоперевозки по Владивостоку и Приморскому краю.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Преимущества -->
      <section class="ap-section">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Почему выбирают нас</div>
            <h2 class="ap-section__title">Наши преимущества</h2>
          </div>
          <div class="ap-advantages">
            <div class="ap-adv" data-reveal data-delay="1">
              <div class="ap-adv__icon">⚡</div>
              <h3 class="ap-adv__title">Быстро</h3>
              <p class="ap-adv__text">Оперативная обработка заявок. Доставка в согласованные сроки без задержек.</p>
            </div>
            <div class="ap-adv" data-reveal data-delay="2">
              <div class="ap-adv__icon">🎯</div>
              <h3 class="ap-adv__title">Точно</h3>
              <p class="ap-adv__text">Поставляем именно то, что заказано. Проверка комплектности перед отгрузкой.</p>
            </div>
            <div class="ap-adv" data-reveal data-delay="3">
              <div class="ap-adv__icon">🔗</div>
              <h3 class="ap-adv__title">Прямые поставки</h3>
              <p class="ap-adv__text">Работаем напрямую с заводами и официальными дистрибьюторами — никаких посредников.</p>
            </div>
            <div class="ap-adv" data-reveal data-delay="4">
              <div class="ap-adv__icon">📦</div>
              <h3 class="ap-adv__title">Широкий ассортимент</h3>
              <p class="ap-adv__text">Более 190 позиций в каталоге. Строительные материалы, оборудование, техника.</p>
            </div>
            <div class="ap-adv" data-reveal data-delay="5">
              <div class="ap-adv__icon">🤝</div>
              <h3 class="ap-adv__title">Работаем с бизнесом</h3>
              <p class="ap-adv__text">НДС, договоры, счета-фактуры. Удобная работа для юридических лиц.</p>
            </div>
            <div class="ap-adv" data-reveal data-delay="6">
              <div class="ap-adv__icon">🏗️</div>
              <h3 class="ap-adv__title">Комплексно</h3>
              <p class="ap-adv__text">Материалы + монтаж + техника в одном месте. Один подрядчик — меньше координации.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Галерея продукции -->
      <section class="ap-section ap-section--dark">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Продукция</div>
            <h2 class="ap-section__title">Что поставляем</h2>
          </div>
          <div class="ap-gallery">
            <div class="ap-gallery__item" data-reveal="scale" data-delay="1">
              <img src="/catalog/kalitka-3d.jpg" alt="Ворота и калитки" />
              <div class="ap-gallery__label">Ворота и калитки</div>
            </div>
            <div class="ap-gallery__item" data-reveal="scale" data-delay="2">
              <img src="/catalog/piles.jpg" alt="Сваи лопастные" />
              <div class="ap-gallery__label">Сваи лопастные</div>
            </div>
            <div class="ap-gallery__item" data-reveal="scale" data-delay="3">
              <img src="/catalog/septic.jpg" alt="Септики и накопители" />
              <div class="ap-gallery__label">Септики</div>
            </div>
            <div class="ap-gallery__item" data-reveal="scale" data-delay="4">
              <img src="/catalog/piles-flange.jpg" alt="Погреба пластиковые" />
              <div class="ap-gallery__label">Погреба</div>
            </div>
            <div class="ap-gallery__item" data-reveal="scale" data-delay="5">
              <img src="/catalog/proflist.jpg" alt="Котлы отопительные" />
              <div class="ap-gallery__label">Котлы</div>
            </div>
            <div class="ap-gallery__item" data-reveal="scale" data-delay="6">
              <img src="/catalog/mesh.jpg" alt="Кованые элементы" />
              <div class="ap-gallery__label">Кованые элементы</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Контакты -->
      <section class="ap-section">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Связаться с нами</div>
            <h2 class="ap-section__title">Контакты</h2>
          </div>
          <div class="ap-contacts">
            <div class="ap-contact" data-reveal data-delay="1">
              <div class="ap-contact__icon">📍</div>
              <div class="ap-contact__label">Адрес</div>
              <div class="ap-contact__value">г. Владивосток, ул. Русская, д. 17, каб. 704</div>
            </div>
            <div class="ap-contact" data-reveal data-delay="2">
              <div class="ap-contact__icon">📞</div>
              <div class="ap-contact__label">Телефон</div>
              <a href="tel:+79143292929" class="ap-contact__value ap-contact__link">+7 914 329-29-29</a>
            </div>
            <div class="ap-contact" data-reveal data-delay="3">
              <div class="ap-contact__icon">✉️</div>
              <div class="ap-contact__label">Email</div>
              <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener" class="ap-contact__value ap-contact__link">ooo-dsr@bk.ru</a>
            </div>
            <div class="ap-contact" data-reveal data-delay="4">
              <div class="ap-contact__icon">💬</div>
              <div class="ap-contact__label">Telegram</div>
              <a href="https://t.me/dsr2025" target="_blank" class="ap-contact__value ap-contact__link">@dsr2025</a>
            </div>
          </div>
          <div class="ap-cta" data-reveal data-delay="2">
            <p class="ap-cta__text">Нужна консультация или расчёт стоимости?</p>
            <div class="ap-cta__btns">
              <a href="/catalog" class="ap-cta__btn ap-cta__btn--primary">Открыть каталог</a>
              <a href="/#contact" class="ap-cta__btn ap-cta__btn--outline">Оставить заявку</a>
            </div>
          </div>
        </div>
      </section>

    </main>

    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__name">ДСР — Дальневосточные Системы Развития</p>
        <p class="footer__contacts">
          г. Владивосток, ул. Русская, д. 17, каб. 704 &nbsp;|&nbsp;
          <a href="tel:+79143292929">+7 914 329-29-29</a> &nbsp;|&nbsp;
          <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener">ooo-dsr@bk.ru</a>
        </p>
        <p class="footer__copy">© {{ new Date().getFullYear() }} ДСР. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useHead({ title: 'О компании – ДСР' })
useScrollReveal()
</script>

<style scoped>
.about-page {
  background: #0a0a0a;
  color: #fff;
}

/* ── Герой ── */
.ap-hero {
  padding: 8rem 1.5rem 5rem;
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 65%);
  text-align: center;
}
.ap-hero__inner { max-width: 760px; margin: 0 auto; }
.ap-hero__badge {
  display: inline-block;
  background: rgba(230,184,0,0.12);
  color: #e6b800;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(230,184,0,0.25);
  margin-bottom: 1.5rem;
}
.ap-hero__title {
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.15;
  color: #fff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}
.ap-accent { color: #e6b800; }
.ap-hero__sub {
  font-size: 1.05rem;
  color: #909090;
  margin-bottom: 1.75rem;
  letter-spacing: 0.03em;
}
.ap-hero__meta {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: #606060;
}
.ap-hero__meta a { color: #e6b800; text-decoration: none; }
.ap-hero__meta a:hover { text-decoration: underline; }

/* ── Общие элементы ── */
.ap-section { padding: 5rem 1.5rem; }
.ap-section--dark { background: #0f0f0f; }
.ap-container { max-width: 1100px; margin: 0 auto; }
.ap-section__head { margin-bottom: 3rem; }
.ap-section__title {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 700;
  color: #fff;
  margin-top: 0.75rem;
  line-height: 1.3;
}
.ap-badge {
  display: inline-block;
  background: rgba(230,184,0,0.1);
  color: #e6b800;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(230,184,0,0.2);
}

/* ── Кто мы ── */
.ap-who {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
.ap-who__text .ap-badge { margin-bottom: 1rem; }
.ap-who__text h2 { margin-top: 0.75rem; margin-bottom: 1.25rem; }
.ap-who__text p {
  color: #b0b0b0;
  line-height: 1.8;
  margin-bottom: 1.1rem;
  font-size: 1rem;
}
.ap-who__list { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.7rem; }
.ap-who__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #c0c0c0;
  font-size: 0.95rem;
}
.ap-who__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #e6b800;
  flex-shrink: 0;
}
.ap-who__photo { position: relative; border-radius: 16px; overflow: hidden; }
.ap-who__photo img { width: 100%; height: 340px; object-fit: cover; border-radius: 16px; }
.ap-who__photo-label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 0.75rem 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  font-size: 0.82rem;
  color: #ccc;
  border-radius: 0 0 16px 16px;
}

/* ── Направления ── */
.ap-dirs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
.ap-dir {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.ap-dir:hover { border-color: rgba(230,184,0,0.4); transform: translateY(-3px); }
.ap-dir__img { height: 180px; overflow: hidden; }
.ap-dir__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.ap-dir:hover .ap-dir__img img { transform: scale(1.04); }
.ap-dir__body { padding: 1.25rem 1.5rem 1.5rem; }
.ap-dir__title { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.6rem; }
.ap-dir__text { font-size: 0.875rem; color: #909090; line-height: 1.7; }

/* ── Преимущества ── */
.ap-advantages {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.ap-adv {
  background: #111;
  border: 1px solid #222;
  border-radius: 14px;
  padding: 1.75rem 1.5rem;
  transition: border-color 0.2s;
}
.ap-adv:hover { border-color: rgba(230,184,0,0.35); }
.ap-adv__icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
.ap-adv__title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.ap-adv__text { font-size: 0.875rem; color: #808080; line-height: 1.65; }

/* ── Галерея продукции ── */
.ap-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.ap-gallery__item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
}
.ap-gallery__item img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.ap-gallery__item:hover img { transform: scale(1.05); }
.ap-gallery__label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 0.6rem 0.75rem;
  background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

/* ── Контакты ── */
.ap-contacts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 3rem;
}
.ap-contact {
  background: #111;
  border: 1px solid #222;
  border-radius: 14px;
  padding: 1.5rem 1.25rem;
  transition: border-color 0.2s;
}
.ap-contact:hover { border-color: rgba(230,184,0,0.35); }
.ap-contact__icon { font-size: 1.5rem; margin-bottom: 0.6rem; }
.ap-contact__label { font-size: 0.72rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem; }
.ap-contact__value { font-size: 0.92rem; color: #d0d0d0; font-weight: 500; display: block; }
.ap-contact__link { color: #e6b800; text-decoration: none; }
.ap-contact__link:hover { text-decoration: underline; }

/* ── CTA ── */
.ap-cta {
  background: linear-gradient(135deg, #1a1a0a 0%, #151510 100%);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
}
.ap-cta__text { font-size: 1.1rem; color: #c0c0c0; margin-bottom: 1.5rem; }
.ap-cta__btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.ap-cta__btn {
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.ap-cta__btn--primary { background: #e6b800; color: #0a0a0a; }
.ap-cta__btn--primary:hover { background: #f5c842; }
.ap-cta__btn--outline { border: 1px solid rgba(230,184,0,0.4); color: #e6b800; }
.ap-cta__btn--outline:hover { background: rgba(230,184,0,0.1); }

/* ── Footer ── */
.footer {
  padding: 2.5rem 1.5rem;
  background: #080808;
  border-top: 1px solid #1a1a1a;
  text-align: center;
}
.footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.5rem; }
.footer__name { font-size: 0.9rem; color: #505050; font-weight: 600; }
.footer__contacts { font-size: 0.85rem; color: #404040; }
.footer__contacts a { color: #606060; text-decoration: none; }
.footer__contacts a:hover { color: #e6b800; }
.footer__copy { font-size: 0.78rem; color: #303030; }

/* ── Адаптив ── */
@media (max-width: 900px) {
  .ap-who { grid-template-columns: 1fr; gap: 2.5rem; }
  .ap-dirs { grid-template-columns: 1fr 1fr; }
  .ap-advantages { grid-template-columns: 1fr 1fr; }
  .ap-contacts { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .ap-hero { padding: 7rem 1.25rem 3.5rem; }
  .ap-dirs { grid-template-columns: 1fr; }
  .ap-advantages { grid-template-columns: 1fr; }
  .ap-gallery { grid-template-columns: 1fr 1fr; }
  .ap-contacts { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 420px) {
  .ap-gallery { grid-template-columns: 1fr; }
  .ap-contacts { grid-template-columns: 1fr; }
}
</style>
