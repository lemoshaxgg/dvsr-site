<template>
  <div>
    <main class="about-page">

      <!-- ═══ Космический герой ═══ -->
      <section class="ap-hero">
        <div class="ap-hero__orb ap-hero__orb--1"></div>
        <div class="ap-hero__orb ap-hero__orb--2"></div>
        <div class="ap-hero__orb ap-hero__orb--3"></div>
        <div class="ap-hero__inner">
          <div class="ap-hero__kicker">
            <span class="ap-hero__kicker-dot"></span>
            Владивосток · Приморский край · с 2015 года
          </div>
          <h1 class="ap-hero__title">
            Дальневосточные<br/>
            <span class="ap-hero__title-grad">Системы Развития</span>
          </h1>
          <p class="ap-hero__sub">
            Снабжаем, строим и двигаем Дальний Восток вперёд.<br/>
            Полный цикл — от поставки материалов до техники на площадке.
          </p>
          <div class="ap-hero__btns">
            <a href="/catalog" class="ap-hero__btn ap-hero__btn--primary">Открыть каталог</a>
            <a href="/#contact" class="ap-hero__btn ap-hero__btn--ghost">Оставить заявку</a>
          </div>
        </div>
      </section>

      <!-- ═══ Манифест / Кто мы ═══ -->
      <section class="ap-section">
        <div class="ap-container ap-who">
          <div class="ap-who__text" data-reveal="left">
            <div class="ap-badge">Коротко о нас</div>
            <h2 class="ap-section__title">Инфраструктура снабжения,<br/>собранная под Дальний Восток</h2>
            <p>
              ДСР закрывает полный цикл: строительные материалы, промышленное оборудование,
              судовые комплектующие и собственная спецтехника на объекте. Один подрядчик —
              вместо десятка поставщиков и бесконечной координации.
            </p>
            <p>
              Работаем напрямую с заводами и официальными дистрибьюторами. Никаких лишних
              звеньев, накруток посредников и простоев из-за аренды техники — вы платите
              за результат, а не за логистические паузы.
            </p>
            <div class="ap-who__list">
              <div class="ap-who__item"><span class="ap-who__check"></span>Прямые поставки — без посредников</div>
              <div class="ap-who__item"><span class="ap-who__check"></span>Широкая номенклатура: от метизов до септиков</div>
              <div class="ap-who__item"><span class="ap-who__check"></span>Собственная спецтехника на площадке</div>
              <div class="ap-who__item"><span class="ap-who__check"></span>Работаем с юр. и физ. лицами, договоры и НДС</div>
            </div>
          </div>
          <div class="ap-who__photo grad-border" data-reveal="right">
            <img src="/works/work-1.jpg" alt="Объект ДСР во Владивостоке" loading="lazy" />
            <div class="ap-who__photo-label">Реальные объекты ДСР · Владивосток и край</div>
          </div>
        </div>
      </section>

      <!-- ═══ Статистика (count-up) ═══ -->
      <section class="ap-stats-wrap">
        <div class="ap-container ap-stats" ref="statsRef">
          <div class="ap-stat" data-reveal="scale" data-delay="1">
            <span class="ap-stat__num"><span ref="s1">10</span>+</span>
            <span class="ap-stat__label">лет на рынке</span>
          </div>
          <div class="ap-stat" data-reveal="scale" data-delay="2">
            <span class="ap-stat__num"><span ref="s2">500</span>+</span>
            <span class="ap-stat__label">выполненных объектов</span>
          </div>
          <div class="ap-stat" data-reveal="scale" data-delay="3">
            <span class="ap-stat__num"><span ref="s3">2300</span>+</span>
            <span class="ap-stat__label">позиций в каталоге</span>
          </div>
          <div class="ap-stat" data-reveal="scale" data-delay="4">
            <span class="ap-stat__num"><span ref="s4">24</span>ч</span>
            <span class="ap-stat__label">ответ на заявку</span>
          </div>
        </div>
      </section>

      <!-- ═══ Направления ═══ -->
      <section class="ap-section ap-section--dark">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Чем занимаемся</div>
            <h2 class="ap-section__title">Основные направления</h2>
          </div>
          <div class="ap-dirs">
            <div class="ap-dir grad-border" v-for="(d,i) in directions" :key="d.title" data-reveal="scale" :data-delay="String(i+1)">
              <div class="ap-dir__img"><img :src="d.img" :alt="d.title" loading="lazy" /></div>
              <div class="ap-dir__body">
                <h3 class="ap-dir__title">{{ d.title }}</h3>
                <p class="ap-dir__text">{{ d.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Преимущества ═══ -->
      <section class="ap-section">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Почему выбирают нас</div>
            <h2 class="ap-section__title">Наши преимущества</h2>
          </div>
          <div class="ap-advantages">
            <div class="ap-adv grad-border" v-for="(a,i) in advantages" :key="a.title" data-reveal :data-delay="String(i+1)">
              <div class="ap-adv__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" v-html="a.icon"></svg>
              </div>
              <h3 class="ap-adv__title">{{ a.title }}</h3>
              <p class="ap-adv__text">{{ a.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Реальные работы ═══ -->
      <section class="ap-section ap-section--dark">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Наши работы</div>
            <h2 class="ap-section__title">Объекты, которые мы сделали</h2>
          </div>
          <div class="ap-gallery">
            <div class="ap-gallery__item" v-for="n in 6" :key="n" data-reveal="scale" :data-delay="String(n)">
              <img :src="`/works/work-${n + 1}.jpg`" :alt="`Объект ДСР ${n}`" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Контакты ═══ -->
      <section class="ap-section">
        <div class="ap-container">
          <div class="ap-section__head" data-reveal>
            <div class="ap-badge">Связаться с нами</div>
            <h2 class="ap-section__title">Контакты</h2>
          </div>
          <div class="ap-contacts">
            <a href="https://yandex.ru/maps/?text=Владивосток ул. Русская 17" target="_blank" rel="noopener" class="ap-contact grad-border" data-reveal data-delay="1">
              <div class="ap-contact__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 21s-7-6.75-7-11a7 7 0 0 1 14 0c0 4.25-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></div>
              <div class="ap-contact__label">Адрес</div>
              <div class="ap-contact__value">г. Владивосток, ул. Русская, 17, каб. 704</div>
            </a>
            <a href="tel:+79143292929" class="ap-contact grad-border" data-reveal data-delay="2">
              <div class="ap-contact__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
              <div class="ap-contact__label">Телефон</div>
              <div class="ap-contact__value ap-contact__link">+7 914 329-29-29</div>
            </a>
            <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener" class="ap-contact grad-border" data-reveal data-delay="3">
              <div class="ap-contact__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg></div>
              <div class="ap-contact__label">Email</div>
              <div class="ap-contact__value ap-contact__link">ooo-dsr@bk.ru</div>
            </a>
            <a href="https://t.me/dsr2025" target="_blank" rel="noopener" class="ap-contact grad-border" data-reveal data-delay="4">
              <div class="ap-contact__icon"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M22 2 2 10l6 2 2 6 3-4 5 4 4-16z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" fill="none"/></svg></div>
              <div class="ap-contact__label">Telegram</div>
              <div class="ap-contact__value ap-contact__link">@dsr2025</div>
            </a>
          </div>

          <div class="ap-cta" data-reveal>
            <div class="ap-cta__glow"></div>
            <h3 class="ap-cta__title">Нужна консультация или расчёт стоимости?</h3>
            <p class="ap-cta__text">Ответим в течение рабочего дня — без навязывания и без оплаты.</p>
            <div class="ap-cta__btns">
              <a href="/catalog" class="ap-cta__btn ap-cta__btn--primary">Открыть каталог</a>
              <a href="/#contact" class="ap-cta__btn ap-cta__btn--outline">Оставить заявку</a>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
useHead({ title: 'О компании — ДСР Владивосток' })
useSeoMeta({
  description: 'ООО ДСР — владивостокская компания по поставке строительных материалов, оборудования и спецтехники. Работаем с 2015 года. Прямые поставки без посредников.',
  ogTitle: 'О компании ДСР — Владивосток',
  ogDescription: 'Снабжение, строительство и спецтехника для Дальнего Востока. Прямые поставки, собственная техника, более 2300 позиций.',
  ogUrl: 'https://dsr-dv.ru/about',
})
useScrollReveal()

const directions = [
  { title: 'Строительные материалы', img: '/catalog/proflist.jpg', text: 'Трубопрокат стальной и пластиковый, профлист, метизы, сантехника, трубы ПНД/ПЭ/ПП, трубопроводная арматура. Любая номенклатура под заказ.' },
  { title: 'Заборы, сваи, септики', img: '/catalog/piles.jpg', text: '3D-заборы и ворота, сетки, винтовые и лопастные сваи, септики, кессоны, погреба, пластиковые ёмкости — всё для частного дома и объекта.' },
  { title: 'Промышленное оборудование', img: '/catalog/proflist.jpg', text: 'Котлы отопительные, дымоходы, РТИ и комплектующие, судовые подшипники, запчасти (ЗИП). Поставка оборудования известных брендов.' },
  { title: 'Спецтехника и перевозки', img: '/catalog/septic.jpg', text: 'Услуги экскаватора и самосвала для земляных и строительных работ. Грузоперевозки по Владивостоку и Приморскому краю.' },
]

const advantages = [
  { title: 'Быстро', icon: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>', text: 'Оперативная обработка заявок и доставка в согласованные сроки — без задержек.' },
  { title: 'Точно', icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>', text: 'Поставляем именно то, что заказано. Проверка комплектности перед отгрузкой.' },
  { title: 'Прямые поставки', icon: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>', text: 'Работаем напрямую с заводами и официальными дистрибьюторами — без посредников.' },
  { title: 'Широкий ассортимент', icon: '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>', text: 'Более 2300 позиций в каталоге: материалы, оборудование, техника.' },
  { title: 'Работаем с бизнесом', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>', text: 'Договоры, счета-фактуры, НДС. Удобная и прозрачная работа для юр. лиц.' },
  { title: 'Комплексно', icon: '<path d="M3 21h18M5 21V7l5-4 5 4M14 21V11l5-3v13"/><path d="M9 9h0M9 13h0M9 17h0"/>', text: 'Материалы + монтаж + техника в одном месте. Один подрядчик — меньше хлопот.' },
]

// Count-up статистики
const statsRef = ref(null)
const s1 = ref(null), s2 = ref(null), s3 = ref(null), s4 = ref(null)
function countUp(el, target, dur = 1600) {
  if (!el) return
  const start = performance.now()
  const ease = t => 1 - Math.pow(1 - t, 3)
  const step = now => {
    const p = Math.min((now - start) / dur, 1)
    el.textContent = Math.round(ease(p) * target).toLocaleString('ru')
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
let onScroll = null
onMounted(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(s1.value, 10, 1200); countUp(s2.value, 500, 1800)
        countUp(s3.value, 2300, 2000); countUp(s4.value, 24, 1000)
        obs.disconnect()
      }
    })
  }, { threshold: 0.4 })
  if (statsRef.value) obs.observe(statsRef.value)

  // Параллакс-скролл героя (контент уезжает медленнее и плавно тает)
  const inner = document.querySelector('.ap-hero__inner')
  const orbs = document.querySelectorAll('.ap-hero__orb')
  onScroll = () => {
    const y = window.scrollY
    if (inner && y < 900) {
      inner.style.transform = `translateY(${y * 0.28}px)`
      inner.style.opacity = String(Math.max(0, 1 - y / 650))
    }
    orbs.forEach((o, i) => { o.style.marginTop = `${y * (0.12 + i * 0.05)}px` })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => { if (onScroll) window.removeEventListener('scroll', onScroll) })
</script>

<style scoped>
.about-page { background: #0a0a0a; color: #fff; }

/* ═══ Космический герой ═══ */
.ap-hero {
  position: relative;
  overflow: hidden;
  padding: 9rem 1.5rem 6rem;
  text-align: center;
  background:
    radial-gradient(ellipse 70% 60% at 50% -10%, #1c1c38 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 85% 30%, rgba(230,184,0,0.07) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 10% 80%, rgba(0,180,120,0.06) 0%, transparent 55%),
    #0a0a0a;
}
.ap-hero::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230,184,0,0.55), transparent);
  box-shadow: 0 0 26px 2px rgba(230,184,0,0.22);
}
.ap-hero__orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
.ap-hero__orb--1 { width: 480px; height: 480px; background: radial-gradient(circle, rgba(230,184,0,0.12), transparent 70%); top: -160px; left: -120px; animation: apOrb 16s ease-in-out infinite; }
.ap-hero__orb--2 { width: 420px; height: 420px; background: radial-gradient(circle, rgba(90,70,210,0.12), transparent 70%); top: -80px; right: -100px; animation: apOrb 20s ease-in-out infinite reverse; }
.ap-hero__orb--3 { width: 360px; height: 360px; background: radial-gradient(circle, rgba(0,200,120,0.08), transparent 70%); bottom: -140px; left: 45%; animation: apOrb 24s ease-in-out infinite; }
@keyframes apOrb { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(40px,30px) scale(1.15);} }

.ap-hero__inner { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; }
.ap-hero__kicker {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 1rem; margin-bottom: 1.5rem;
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: #b9b9b9; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 999px; backdrop-filter: blur(10px);
}
.ap-hero__kicker-dot { width: 7px; height: 7px; border-radius: 50%; background: #e6b800; box-shadow: 0 0 10px #e6b800; }
.ap-hero__title {
  font-family: 'Space Grotesk', 'Montserrat', sans-serif;
  font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 700; line-height: 1.05;
  letter-spacing: -0.035em; color: #fff; margin: 0 0 1.25rem; text-shadow: 0 2px 40px rgba(0,0,0,0.5);
}
.ap-hero__title-grad {
  background: linear-gradient(118deg, #ffffff 0%, #ffe9a3 55%, #e6b800 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ap-hero__sub { font-size: clamp(1rem, 2vw, 1.15rem); color: #9a9a9a; line-height: 1.7; margin: 0 0 2rem; }
.ap-hero__btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.ap-hero__btn { padding: 0.85rem 2rem; border-radius: 999px; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s, background 0.2s; }
.ap-hero__btn--primary { background: linear-gradient(135deg, #f5c842, #e6b800 55%, #c9a000); color: #0a0a0a; box-shadow: 0 6px 24px rgba(230,184,0,0.3); }
.ap-hero__btn--primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(230,184,0,0.45); }
.ap-hero__btn--ghost { color: #e6b800; border: 1px solid rgba(230,184,0,0.4); }
.ap-hero__btn--ghost:hover { background: rgba(230,184,0,0.1); }

/* ═══ Общие ═══ */
.ap-section { padding: 5.5rem 1.5rem; }
.ap-section--dark { background: #0f0f0f; }
.ap-container { max-width: 1100px; margin: 0 auto; }
.ap-section__head { margin-bottom: 3rem; }
.ap-section__title {
  font-family: 'Space Grotesk', 'Montserrat', sans-serif;
  font-size: clamp(1.7rem, 3.6vw, 2.6rem); font-weight: 700; margin: 0.75rem 0 0; line-height: 1.2; letter-spacing: -0.03em;
  background: linear-gradient(118deg, #ffffff 0%, #ffe9a3 60%, #e6b800 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ap-badge {
  display: inline-block; background: rgba(230,184,0,0.1); color: #e6b800;
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 0.3rem 0.9rem; border-radius: 999px; border: 1px solid rgba(230,184,0,0.2);
}

/* ═══ Кто мы ═══ */
.ap-who { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.ap-who__text .ap-badge { margin-bottom: 1rem; }
.ap-who__text h2 { margin-bottom: 1.4rem; }
.ap-who__text p { color: #a9a9a9; line-height: 1.85; margin: 0 0 1.1rem; font-size: 1rem; }
.ap-who__list { margin-top: 1.6rem; display: flex; flex-direction: column; gap: 0.8rem; }
.ap-who__item { display: flex; align-items: center; gap: 0.7rem; color: #cfcfcf; font-size: 0.95rem; }
.ap-who__check { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: rgba(230,184,0,0.15); border: 1px solid rgba(230,184,0,0.4); position: relative; }
.ap-who__check::after { content: ''; position: absolute; left: 5px; top: 4px; width: 4px; height: 7px; border: solid #e6b800; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.ap-who__photo { position: relative; border-radius: 18px; overflow: hidden; border: 1px solid #1e1e1e; }
.ap-who__photo img { width: 100%; height: 360px; object-fit: cover; display: block; transition: transform 0.5s; }
.ap-who__photo:hover img { transform: scale(1.04); }
.ap-who__photo-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); font-size: 0.82rem; color: #ddd; }

/* ═══ Статы ═══ */
.ap-stats-wrap { padding: 0 1.5rem; }
.ap-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: #1a1a1a; border: 1px solid #1e1e1e; border-radius: 18px; overflow: hidden;
  box-shadow: 0 24px 70px rgba(0,0,0,0.5);
}
.ap-stat { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; padding: 2.25rem 1rem; background: #0d0d0d; text-align: center; transition: background 0.25s; }
.ap-stat:hover { background: #121210; }
.ap-stat__num { font-family: 'Space Grotesk', 'Montserrat', sans-serif; font-size: clamp(2rem, 4vw, 2.9rem); font-weight: 700; color: #e6b800; line-height: 1; letter-spacing: -0.04em; }
.ap-stat__label { font-size: 0.8rem; color: #777; }

/* ═══ Направления ═══ */
.ap-dirs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.ap-dir { position: relative; background: rgba(20,20,20,0.9); border: 1px solid #1e1e1e; border-radius: 16px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
.ap-dir:hover { transform: translateY(-4px); border-color: rgba(230,184,0,0.35); box-shadow: 0 24px 60px rgba(0,0,0,0.55); }
.ap-dir__img { height: 190px; overflow: hidden; }
.ap-dir__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.ap-dir:hover .ap-dir__img img { transform: scale(1.06); }
.ap-dir__body { padding: 1.4rem 1.6rem 1.6rem; }
.ap-dir__title { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0 0 0.6rem; }
.ap-dir__text { font-size: 0.88rem; color: #8f8f8f; line-height: 1.7; }

/* ═══ Преимущества ═══ */
.ap-advantages { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.ap-adv { position: relative; background: rgba(17,17,17,0.9); border: 1px solid #1e1e1e; border-radius: 16px; padding: 1.85rem 1.6rem; transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
.ap-adv:hover { transform: translateY(-4px); border-color: rgba(230,184,0,0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.ap-adv__icon {
  width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
  border-radius: 14px; color: #e6b800; margin-bottom: 1rem;
  background: linear-gradient(150deg, rgba(245,200,66,0.14), rgba(230,184,0,0.04));
  border: 1px solid rgba(230,184,0,0.22); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
}
.ap-adv__title { font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0 0 0.5rem; }
.ap-adv__text { font-size: 0.88rem; color: #888; line-height: 1.65; }

/* ═══ Галерея работ ═══ */
.ap-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.ap-gallery__item { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 4/3; border: 1px solid #1e1e1e; }
.ap-gallery__item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.ap-gallery__item:hover img { transform: scale(1.06); }

/* ═══ Контакты ═══ */
.ap-contacts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 3rem; }
.ap-contact { position: relative; display: block; text-decoration: none; background: rgba(17,17,17,0.9); border: 1px solid #1e1e1e; border-radius: 16px; padding: 1.6rem 1.35rem; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; }
.ap-contact:hover { transform: translateY(-3px); border-color: rgba(230,184,0,0.35); box-shadow: 0 14px 40px rgba(0,0,0,0.5); }
.ap-contact__icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: #e6b800; background: linear-gradient(150deg, rgba(245,200,66,0.13), rgba(230,184,0,0.03)); border: 1px solid rgba(230,184,0,0.2); margin-bottom: 0.85rem; }
.ap-contact__label { font-size: 0.72rem; color: #666; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem; }
.ap-contact__value { font-size: 0.92rem; color: #d0d0d0; font-weight: 500; }
.ap-contact__link { color: #e6b800; }

/* ═══ CTA ═══ */
.ap-cta { position: relative; overflow: hidden; background: linear-gradient(135deg, #16160c 0%, #121210 100%); border: 1px solid rgba(230,184,0,0.25); border-radius: 20px; padding: 3rem 2rem; text-align: center; }
.ap-cta__glow { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(230,184,0,0.14), transparent 70%); top: -200px; left: 50%; transform: translateX(-50%); pointer-events: none; }
.ap-cta__title { position: relative; font-family: 'Space Grotesk','Montserrat',sans-serif; font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 700; color: #fff; margin: 0 0 0.6rem; }
.ap-cta__text { position: relative; font-size: 1rem; color: #b0b0b0; margin: 0 0 1.75rem; }
.ap-cta__btns { position: relative; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.ap-cta__btn { padding: 0.85rem 2.2rem; border-radius: 999px; font-size: 0.95rem; font-weight: 700; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s, background 0.2s; }
.ap-cta__btn--primary { background: linear-gradient(135deg, #f5c842, #e6b800 55%, #c9a000); color: #0a0a0a; box-shadow: 0 6px 24px rgba(230,184,0,0.35); }
.ap-cta__btn--primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(230,184,0,0.5); }
.ap-cta__btn--outline { border: 1px solid rgba(230,184,0,0.4); color: #e6b800; }
.ap-cta__btn--outline:hover { background: rgba(230,184,0,0.1); }

/* ═══ Footer ═══ */
.footer { padding: 2.5rem 1.5rem; background: #080808; border-top: 1px solid #1a1a1a; text-align: center; }
.footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.5rem; }
.footer__name { font-size: 0.9rem; color: #e6b800; font-weight: 600; }
.footer__contacts { font-size: 0.85rem; color: #555; }
.footer__contacts a { color: #888; text-decoration: none; }
.footer__contacts a:hover { color: #e6b800; }
.footer__copy { font-size: 0.78rem; color: #333; }

/* ═══ Адаптив ═══ */
@media (max-width: 900px) {
  .ap-who { grid-template-columns: 1fr; gap: 2.5rem; }
  .ap-advantages { grid-template-columns: 1fr 1fr; }
  .ap-stats { grid-template-columns: 1fr 1fr; }
  .ap-contacts { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .ap-hero { padding: 7.5rem 1.25rem 4rem; }
  .ap-section { padding: 4rem 1.25rem; }
  .ap-dirs { grid-template-columns: 1fr; }
  .ap-advantages { grid-template-columns: 1fr; }
  .ap-gallery { grid-template-columns: 1fr 1fr; }
  .ap-contacts { grid-template-columns: 1fr; }
}
</style>
