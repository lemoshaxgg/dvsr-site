<template>
  <div>


    <main class="promo-page">
      <div class="promo-page__hero">
        <div class="promo-page__hero-inner">
          <nav class="promo-page__breadcrumb">
            <a href="/">Главная</a><span>/</span><span>Акции</span>
          </nav>
          <h1 class="promo-page__title">Акции и спецпредложения</h1>
          <p class="promo-page__sub">Актуальные скидки и специальные условия для наших клиентов</p>
        </div>
      </div>

      <div class="promo-page__inner">
        <div class="promo-grid">
          <div v-for="promo in activePromos" :key="promo.id" class="promo-card">
            <div class="promo-card__top">
              <span class="promo-card__badge" :style="{ background: promo.badgeColor + '22', color: promo.badgeColor, borderColor: promo.badgeColor + '44' }">
                {{ promo.badge }}
              </span>
              <span class="promo-card__until">до {{ formatDate(promo.validUntil) }}</span>
            </div>
            <h2 class="promo-card__title">{{ promo.title }}</h2>
            <p class="promo-card__desc">{{ promo.description }}</p>
            <div class="promo-card__footer">
              <a :href="`/catalog?cat=${promo.category}`" class="promo-card__cat">{{ promo.catLabel }}</a>
              <button class="promo-card__btn" @click="openOrder(promo)">Узнать подробнее</button>
            </div>
          </div>
        </div>

        <div v-if="activePromos.length === 0" class="promo-page__empty">
          <p>Сейчас активных акций нет. Следите за обновлениями!</p>
        </div>
      </div>
    </main>

    <!-- Модалка заявки -->
    <transition name="modal">
      <div v-if="orderPromo" class="modal-overlay" @click.self="orderPromo = null">
        <div class="modal">
          <button class="modal__close" @click="orderPromo = null">✕</button>
          <h2 class="modal__title">{{ orderPromo.title }}</h2>
          <p class="modal__desc">{{ orderPromo.description }}</p>
          <form class="modal__form" @submit.prevent="submitOrder">
            <input v-model="form.name" type="text" placeholder="Ваше имя *" class="modal__input" maxlength="100" />
            <input :value="form.phone" @input="form.phone = phoneMask($event.target.value)" type="tel" placeholder="+7 (___) ___-__-__" class="modal__input" maxlength="18" />
            <textarea v-model="form.message" placeholder="Комментарий..." class="modal__input modal__textarea" rows="3" maxlength="500"></textarea>
            <button type="submit" class="modal__submit" :disabled="loading">
              {{ loading ? 'Отправка...' : 'Отправить заявку' }}
            </button>
            <p v-if="success" class="modal__success">Заявка отправлена! Мы свяжемся с вами.</p>
          </form>
        </div>
      </div>
    </transition>

    <footer class="page-footer">
      <div class="page-footer__inner">
        <p>ДСР — Дальневосточные Системы Развития</p>
        <p>г. Владивосток, ул. Русская, д. 17 &nbsp;|&nbsp; <a href="tel:+79143292929">+7 914 329-29-29</a></p>
        <p>© {{ new Date().getFullYear() }} ДСР. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { promotions } from '~/data/promotions.js'
import { phoneMask } from '~/composables/usePhoneMask.js'

useHead({ title: 'Акции и спецпредложения — ДСР Владивосток' })
useSeoMeta({
  description: 'Актуальные акции и специальные предложения ООО ДСР. Скидки на трубопроводную арматуру, 3D заборы, септики и кабели.',
})

const activePromos = computed(() => promotions.filter(p => p.active))

const orderPromo = ref(null)
const loading = ref(false)
const success = ref(false)
const form = reactive({ name: '', phone: '', message: '' })

function formatDate(str) {
  const d = new Date(str)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function openOrder(promo) {
  orderPromo.value = promo
  success.value = false
  form.name = ''
  form.phone = ''
  form.message = ''
}

async function submitOrder() {
  if (!form.name || !form.phone) return
  loading.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        email: null,
        message: form.message || '—',
        item_title: `Акция: ${orderPromo.value.title}`,
        item_price: orderPromo.value.badge,
      },
    })
    success.value = true
    form.name = ''
    form.phone = ''
    form.message = ''
  } catch {
    form.message = 'Ошибка. Позвоните нам напрямую.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.promo-page { min-height: 100vh; background: #0a0a0a; padding-bottom: 4rem; }

.promo-page__hero {
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 80%);
  padding: 6rem 1.5rem 2.5rem;
  border-bottom: 1px solid #1a1a1a;
}
.promo-page__hero-inner { max-width: 1100px; margin: 0 auto; }

.promo-page__breadcrumb {
  display: flex; gap: 0.5rem; font-size: 0.8rem; color: #555; margin-bottom: 1rem;
}
.promo-page__breadcrumb a { color: #e6b800; text-decoration: none; opacity: 0.8; }
.promo-page__breadcrumb a:hover { opacity: 1; }
.promo-page__breadcrumb span { color: #333; }
.promo-page__breadcrumb span:last-child { color: #777; }

.promo-page__title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #fff; margin-bottom: 0.75rem; }
.promo-page__sub { color: #666; font-size: 1rem; }

.promo-page__inner { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

.promo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.promo-card {
  background: linear-gradient(145deg, #141410, #111);
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.promo-card:hover {
  border-color: rgba(230,184,0,0.3);
  box-shadow: 0 4px 24px rgba(230,184,0,0.06);
}

.promo-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.promo-card__badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  border: 1px solid;
}
.promo-card__until {
  font-size: 0.75rem;
  color: #555;
}
.promo-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin: 0;
}
.promo-card__desc {
  font-size: 0.875rem;
  color: #777;
  line-height: 1.6;
  flex: 1;
  margin: 0;
}
.promo-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}
.promo-card__cat {
  font-size: 0.75rem;
  color: #e6b800;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.promo-card__cat:hover { opacity: 1; }
.promo-card__btn {
  padding: 0.55rem 1.2rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.promo-card__btn:hover { background: #f5c842; }

.promo-page__empty { text-align: center; padding: 4rem; color: #555; }

/* Модалка */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal { background: #141414; border: 1px solid #2a2412; border-radius: 20px; padding: 2rem; width: 100%; max-width: 460px; position: relative; }
.modal__close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #666; font-size: 1.1rem; cursor: pointer; transition: color 0.2s; }
.modal__close:hover { color: #fff; }
.modal__title { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.modal__desc { color: #888; font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.5rem; }
.modal__form { display: flex; flex-direction: column; gap: 0.85rem; }
.modal__input { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
.modal__input:focus { border-color: #e6b800; }
.modal__input::placeholder { color: #444; }
.modal__textarea { resize: vertical; min-height: 80px; }
.modal__submit { padding: 0.85rem; background: #e6b800; color: #0a0a0a; font-size: 1rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.modal__submit:hover:not(:disabled) { background: #f5c842; }
.modal__submit:disabled { opacity: 0.6; cursor: not-allowed; }
.modal__success { color: #4ade80; font-size: 0.9rem; text-align: center; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* Футер */
.page-footer { padding: 2.5rem 1.5rem; background: #080808; border-top: 1px solid #1e1e1e; text-align: center; }
.page-footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.4rem; color: #555; font-size: 0.85rem; }
.page-footer__inner a { color: #888; text-decoration: none; }
.page-footer__inner a:hover { color: #e6b800; }
.page-footer__inner p:first-child { color: #e6b800; font-weight: 600; }

@media (max-width: 640px) {
  .promo-grid { grid-template-columns: 1fr; }
}
</style>
