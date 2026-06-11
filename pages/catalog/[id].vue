<template>
  <div>
    <NavBar />

    <main v-if="item" class="pp">
      <div class="pp__inner">

        <nav class="pp__breadcrumb">
          <a href="/">Главная</a>
          <span>/</span>
          <a href="/catalog">Каталог</a>
          <span>/</span>
          <a :href="`/catalog?cat=${item.category}`">{{ categoryMap[item.category] }}</a>
          <span>/</span>
          <span>{{ item.title }}</span>
        </nav>

        <div class="pp__layout">

          <!-- Изображение -->
          <div class="pp__img-wrap">
            <template v-if="item.photos && item.photos.length > 1">
              <img :src="item.photos[photoIdx]" :alt="item.title" class="pp__img" />
              <button class="pp__prev" @click="photoIdx = (photoIdx - 1 + item.photos.length) % item.photos.length">&#8249;</button>
              <button class="pp__next" @click="photoIdx = (photoIdx + 1) % item.photos.length">&#8250;</button>
              <div class="pp__dots">
                <span v-for="(_, i) in item.photos" :key="i" class="pp__dot" :class="{ active: i === photoIdx }" @click="photoIdx = i"></span>
              </div>
            </template>
            <img v-else-if="item.photo || item.photos" :src="item.photo || item.photos?.[0]" :alt="item.title" class="pp__img" />
            <div v-else class="pp__no-img"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1" d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></svg></div>
          </div>

          <!-- Информация -->
          <div class="pp__info">
            <a :href="`/catalog?cat=${item.category}`" class="pp__cat">{{ categoryMap[item.category] }}</a>
            <h1 class="pp__title">{{ item.title }}</h1>
            <p class="pp__desc">{{ item.description }}</p>

            <div class="pp__meta">
              <div v-if="item.sku" class="pp__meta-row">
                <span class="pp__meta-label">Артикул</span>
                <span class="pp__meta-val">{{ item.sku }}</span>
              </div>
              <div v-if="item.unit" class="pp__meta-row">
                <span class="pp__meta-label">Единица</span>
                <span class="pp__meta-val">{{ item.unit }}</span>
              </div>
            </div>

            <div class="pp__price-row">
              <span class="pp__price">Уточнить цену</span>
              <button
                class="pp__add-cart"
                :class="{ added: item && hasItem(item.id) }"
                @click="item && addItem(item)"
                type="button"
              >
                <svg v-if="item && hasItem(item.id)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 6L9 17l-5-5"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 5v14M5 12h14"/>
                </svg>
                {{ item && hasItem(item.id) ? 'В списке' : 'В список запросов' }}
              </button>
            </div>

            <form class="pp__form" @submit.prevent="submitOrder">
              <h3 class="pp__form-title">Запросить цену</h3>
              <input v-model="form.name" type="text" placeholder="Ваше имя *" class="pp__input" maxlength="100" />
              <input :value="form.phone" @input="form.phone = phoneMask($event.target.value)" type="tel" placeholder="+7 (___) ___-__-__" class="pp__input" maxlength="18" />
              <textarea v-model="form.message" placeholder="Комментарий — количество, размеры, адрес объекта..." class="pp__input pp__textarea" rows="3" maxlength="500"></textarea>
              <button type="submit" class="pp__submit" :disabled="loading">
                {{ loading ? 'Отправка...' : 'Отправить запрос' }}
              </button>
              <p v-if="success" class="pp__success">Заявка отправлена! Мы свяжемся с вами.</p>
            </form>

            <div class="pp__share">
              <button class="pp__share-btn" @click="copyLink">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                </svg>
                {{ copied ? 'Ссылка скопирована!' : 'Скопировать ссылку' }}
              </button>
            </div>

            <a href="/catalog" class="pp__back">← Вернуться в каталог</a>
          </div>
        </div>
      </div>
    </main>

    <main v-else class="pp pp--404">
      <div class="pp__inner">
        <div class="pp__404-icon">🔍</div>
        <h2 class="pp__404-title">Товар не найден</h2>
        <p class="pp__404-sub">Возможно, он был удалён или ссылка устарела.</p>
        <a href="/catalog" class="pp__back pp__back--center">← Вернуться в каталог</a>
      </div>
    </main>

    <!-- Похожие товары -->
    <section v-if="relatedItems.length > 0" class="pp-related">
      <div class="pp-related__inner">
        <h2 class="pp-related__title">Похожие товары</h2>
        <div class="pp-related__grid">
          <a v-for="rel in relatedItems" :key="rel.id" :href="`/catalog/${rel.id}`" class="pp-rel-card">
            <div class="pp-rel-card__img">
              <img v-if="rel.photo || rel.photos?.[0]" :src="rel.photo || rel.photos[0]" :alt="rel.title" loading="lazy" />
              <div v-else class="pp-rel-card__no-img">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.2" d="M3 16l5-5 4 4 3-3 6 6"/></svg>
              </div>
            </div>
            <div class="pp-rel-card__body">
              <span class="pp-rel-card__title">{{ rel.title }}</span>
              <span class="pp-rel-card__link">Подробнее →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <footer class="pp-footer">
      <div class="pp-footer__inner">
        <p>ДСР — Дальневосточные Системы Развития</p>
        <p>г. Владивосток, ул. Русская, д. 17 &nbsp;|&nbsp; <a href="tel:+79143292929">+7 914 329-29-29</a></p>
        <p>© {{ new Date().getFullYear() }} ДСР. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { categories, items as staticItems } from '~/data/catalog.js'
import { phoneMask } from '~/composables/usePhoneMask.js'
const { addItem, hasItem } = useCart()

const route = useRoute()
const itemId = Number(route.params.id)
const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.label]))

const { data: item } = await useAsyncData(`product-${itemId}`, async () => {
  const staticItem = staticItems.find(i => i.id === itemId)
  if (staticItem) return staticItem
  try {
    const all = await $fetch('/data/catalog-items.json')
    return all.find(i => i.id === itemId) ?? null
  } catch {
    return null
  }
})

useHead({
  title: item.value
    ? `${item.value.title} — купить во Владивостоке | ДСР`
    : 'Товар не найден — ДСР',
})
useSeoMeta({
  description: item.value
    ? (item.value.description || `Купить ${item.value.title} в Владивостоке. ООО ДСР — строительные материалы и оборудование.`).slice(0, 160)
    : 'Страница товара не найдена.',
  ogTitle: item.value ? `${item.value.title} — ДСР Владивосток` : 'ДСР',
  ogDescription: item.value ? (item.value.description || '').slice(0, 200) : '',
  ogImage: item.value?.photo || item.value?.photos?.[0] || 'https://dvsr-site.vercel.app/og-dsr.jpg',
  ogUrl: `https://dvsr-site.vercel.app/catalog/${itemId}`,
  twitterCard: 'summary_large_image',
})

const relatedItems = computed(() => {
  if (!item.value) return []
  return staticItems
    .filter(i => i.id !== itemId && i.category === item.value.category)
    .slice(0, 4)
})

const photoIdx = ref(0)
const loading = ref(false)
const success = ref(false)
const copied = ref(false)
const form = reactive({ name: '', phone: '', message: '' })

function copyLink() {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  }
}

async function submitOrder() {
  if (!form.name || !form.phone) return
  loading.value = true
  const priceText = item.value?.basePrice
    ? `от ${item.value.basePrice.toLocaleString('ru-RU')} ₽ / ${item.value.unit}`
    : 'уточнить'
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        email: null,
        message: form.message || '—',
        item_title: item.value?.title,
        item_price: priceText,
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
.pp {
  min-height: 100vh;
  background: #0a0a0a;
  padding-bottom: 4rem;
}

.pp__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 6rem 1.5rem 2rem;
}

/* Breadcrumb */
.pp__breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 2rem;
}
.pp__breadcrumb a { color: #e6b800; text-decoration: none; opacity: 0.8; transition: opacity 0.2s; }
.pp__breadcrumb a:hover { opacity: 1; }
.pp__breadcrumb span { color: #333; }
.pp__breadcrumb span:last-child { color: #777; }

/* Layout */
.pp__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Image */
.pp__img-wrap {
  position: relative;
  background: #0d0d0d;
  border: 1px solid #1e1e1e;
  border-radius: 20px;
  overflow: hidden;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pp__img {
  width: 100%;
  max-height: 480px;
  object-fit: contain;
  padding: 8%;
  filter: drop-shadow(0 4px 24px rgba(230,184,0,0.2));
}
.pp__no-img {
  opacity: 0.15;
  padding: 3rem;
  color: #e6b800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pp__prev, .pp__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.6);
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 40px;
  height: 56px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.pp__prev { left: 8px; }
.pp__next { right: 8px; }
.pp__prev:hover, .pp__next:hover { background: rgba(230,184,0,0.7); color: #000; }

.pp__dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.pp__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.pp__dot.active { background: #e6b800; transform: scale(1.3); }

/* Info */
.pp__info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pp__cat {
  display: inline-block;
  background: rgba(230,184,0,0.12);
  color: #e6b800;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(230,184,0,0.25);
  text-decoration: none;
  width: fit-content;
  transition: background 0.2s;
}
.pp__cat:hover { background: rgba(230,184,0,0.2); }

.pp__title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  margin: 0;
}

.pp__desc {
  color: #888;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

.pp__meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 10px;
  padding: 0.85rem 1.1rem;
}
.pp__meta-row {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
}
.pp__meta-label { color: #555; min-width: 70px; }
.pp__meta-val { color: #c0c0c0; font-weight: 500; }

.pp__price-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.pp__price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #e6b800;
}
.pp__add-cart {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(230,184,0,0.1);
  border: 1px solid rgba(230,184,0,0.3);
  border-radius: 999px;
  color: #e6b800;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  padding: 0.45rem 1.1rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.pp__add-cart:hover { background: rgba(230,184,0,0.18); border-color: rgba(230,184,0,0.5); }
.pp__add-cart.added { background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.35); color: #4ade80; }

/* Form */
.pp__form {
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.pp__form-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem;
}
.pp__input {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.pp__input:focus { border-color: #e6b800; }
.pp__input::placeholder { color: #444; }
.pp__textarea { resize: vertical; min-height: 80px; }

.pp__submit {
  padding: 0.9rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}
.pp__submit:hover:not(:disabled) { background: #f5c842; }
.pp__submit:disabled { opacity: 0.6; cursor: not-allowed; }

.pp__success {
  color: #4ade80;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.pp__share {
  display: flex;
  align-items: center;
}
.pp__share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: none;
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  padding: 0.4rem 1rem;
  color: #666;
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.pp__share-btn:hover { border-color: rgba(230,184,0,0.4); color: #e6b800; }

.pp__back {
  color: #e6b800;
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.pp__back:hover { opacity: 1; }
.pp__back--center { display: block; text-align: center; margin-top: 1rem; }

/* 404 */
.pp--404 .pp__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  gap: 1rem;
}
.pp__404-icon { font-size: 4rem; opacity: 0.3; }
.pp__404-title { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0; }
.pp__404-sub { color: #666; margin: 0; }

/* Footer */
.pp-footer {
  padding: 2.5rem 1.5rem;
  background: #080808;
  border-top: 1px solid #1e1e1e;
  text-align: center;
}
.pp-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #555;
  font-size: 0.85rem;
}
.pp-footer__inner a { color: #888; text-decoration: none; }
.pp-footer__inner a:hover { color: #e6b800; }
.pp-footer__inner p:first-child { color: #e6b800; font-weight: 600; }

/* Похожие товары */
.pp-related {
  background: #080808;
  border-top: 1px solid #1a1a1a;
  padding: 3rem 1.5rem;
}
.pp-related__inner { max-width: 1100px; margin: 0 auto; }
.pp-related__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1.5rem;
}
.pp-related__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.pp-rel-card {
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, transform 0.2s;
}
.pp-rel-card:hover { border-color: rgba(230,184,0,0.35); transform: translateY(-2px); }
.pp-rel-card__img {
  height: 130px;
  background: #0d0d0d;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pp-rel-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
.pp-rel-card:hover .pp-rel-card__img img { transform: scale(1.04); }
.pp-rel-card__no-img { opacity: 0.15; color: #e6b800; }
.pp-rel-card__body {
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  justify-content: space-between;
}
.pp-rel-card__title { font-size: 0.85rem; color: #ccc; font-weight: 500; line-height: 1.4; }
.pp-rel-card__link { font-size: 0.78rem; color: #e6b800; opacity: 0.7; transition: opacity 0.2s; }
.pp-rel-card:hover .pp-rel-card__link { opacity: 1; }

@media (max-width: 768px) {
  .pp__layout { grid-template-columns: 1fr; gap: 2rem; }
  .pp__img-wrap { min-height: 260px; }
  .pp-related__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
