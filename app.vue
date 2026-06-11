<template>
  <div>
    <NuxtPage />
    <TelegramBtn />
    <WhatsAppBtn />

    <!-- Кнопка «Наверх» -->
    <transition name="back-top">
      <button v-if="showBackTop" class="back-top" @click="scrollToTop" title="Наверх">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </transition>

    <!-- Кнопка корзины (плавающая) -->
    <transition name="cart-fab">
      <button v-if="count > 0" class="cart-fab" @click="drawerOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
        </svg>
        <span class="cart-fab__count">{{ count }}</span>
      </button>
    </transition>

    <!-- Drawer корзины -->
    <transition name="drawer-overlay">
      <div v-if="drawerOpen" class="cart-overlay" @click.self="drawerOpen = false">
        <transition name="drawer-slide">
          <div v-if="drawerOpen" class="cart-drawer">
            <div class="cart-drawer__header">
              <h2 class="cart-drawer__title">Список запросов <span>{{ count }}</span></h2>
              <div class="cart-drawer__header-actions">
                <button v-if="cartItems.length > 0" class="cart-drawer__clear" @click="clearCart">Очистить</button>
                <button class="cart-drawer__close" @click="drawerOpen = false">✕</button>
              </div>
            </div>

            <div class="cart-drawer__body">
              <div v-if="cartItems.length === 0" class="cart-drawer__empty">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" class="cart-drawer__empty-icon"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
                <p>Список пуст. Добавьте товары из каталога.</p>
                <a href="/catalog" class="cart-drawer__go-catalog" @click="drawerOpen = false">Перейти в каталог →</a>
              </div>

              <div v-else class="cart-drawer__items">
                <div v-for="item in cartItems" :key="item.id" class="cart-item">
                  <svg class="cart-item__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 16l5-5 4 4 3-3 6 6"/></svg>
                  <div class="cart-item__info">
                    <span class="cart-item__title">{{ item.title }}</span>
                    <div class="cart-item__qty">
                      <button @click="setQuantity(item.id, item.quantity - 1)">−</button>
                      <input :value="item.quantity" @change="setQuantity(item.id, $event.target.value)" type="number" min="1" class="cart-item__qty-input" />
                      <button @click="setQuantity(item.id, item.quantity + 1)">+</button>
                    </div>
                  </div>
                  <button class="cart-item__remove" @click="removeItem(item.id)">✕</button>
                </div>
              </div>

              <form v-if="cartItems.length > 0" class="cart-drawer__form" @submit.prevent="submitCart">
                <h3 class="cart-drawer__form-title">Оставить заявку на все позиции</h3>
                <input v-model="cartForm.name" type="text" placeholder="Ваше имя *" class="cart-input" maxlength="100" />
                <input :value="cartForm.phone" @input="cartForm.phone = phoneMask($event.target.value)" type="tel" placeholder="+7 (___) ___-__-__" class="cart-input" maxlength="18" />
                <textarea v-model="cartForm.message" placeholder="Комментарий — сроки, адрес объекта..." class="cart-input cart-textarea" rows="2" maxlength="500"></textarea>
                <button type="submit" class="cart-submit" :disabled="cartLoading">
                  {{ cartLoading ? 'Отправка...' : `Отправить запрос (${count} поз.)` }}
                </button>
                <p v-if="cartSuccess" class="cart-success">Заявка отправлена! Мы свяжемся с вами.</p>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { phoneMask } from '~/composables/usePhoneMask.js'

const { cartItems, drawerOpen, removeItem, setQuantity, clearCart, count } = useCart()

const showBackTop = ref(false)
function onScroll() { showBackTop.value = window.scrollY > 500 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const cartLoading = ref(false)
const cartSuccess = ref(false)
const cartForm = reactive({ name: '', phone: '', message: '' })

async function submitCart() {
  if (!cartForm.name || !cartForm.phone) return
  cartLoading.value = true

  const itemsList = cartItems.value
    .map(i => `${i.title}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`)
    .join('\n')

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: cartForm.name,
        phone: cartForm.phone,
        email: null,
        message: [cartForm.message, '---', itemsList].filter(Boolean).join('\n'),
        item_title: `Список из ${count.value} позиций`,
        item_price: null,
      },
    })
    cartSuccess.value = true
    cartForm.name = ''
    cartForm.phone = ''
    cartForm.message = ''
    clearCart()
  } catch {
    cartForm.message = 'Ошибка. Позвоните нам напрямую.'
  } finally {
    cartLoading.value = false
  }
}
</script>

<style>
/* Кнопка Наверх */
.back-top {
  position: fixed;
  bottom: 13rem;
  right: 2rem;
  z-index: 89;
  width: 42px;
  height: 42px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 50%;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
}
.back-top:hover { background: #e6b800; color: #000; border-color: #e6b800; transform: translateY(-2px); }
.back-top-enter-active, .back-top-leave-active { transition: opacity 0.25s, transform 0.25s; }
.back-top-enter-from, .back-top-leave-to { opacity: 0; transform: translateY(10px); }

/* Плавающая кнопка корзины */
.cart-fab {
  position: fixed;
  bottom: 9rem;
  right: 2rem;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 1.1rem;
  height: 46px;
  background: #e6b800;
  color: #0a0a0a;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(230,184,0,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.cart-fab:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 28px rgba(230,184,0,0.55); }
.cart-fab__count {
  background: #0a0a0a;
  color: #e6b800;
  font-size: 0.78rem;
  font-weight: 800;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-fab-enter-active, .cart-fab-leave-active { transition: opacity 0.25s, transform 0.25s; }
.cart-fab-enter-from, .cart-fab-leave-to { opacity: 0; transform: scale(0.8); }

/* Overlay */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(3px);
  z-index: 300;
  display: flex;
  justify-content: flex-end;
}
.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity 0.3s; }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0; }

/* Drawer */
.cart-drawer {
  width: 100%;
  max-width: 420px;
  background: #111;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.6);
}
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.3s ease; }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

.cart-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #1e1e1e;
  flex-shrink: 0;
}
.cart-drawer__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.cart-drawer__title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(230,184,0,0.15);
  color: #e6b800;
  font-size: 0.8rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-left: 0.5rem;
}
.cart-drawer__header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.cart-drawer__clear {
  background: none;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #555;
  font-size: 0.78rem;
  font-family: inherit;
  padding: 0.3rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.cart-drawer__clear:hover { border-color: #ff6b6b; color: #ff6b6b; }
.cart-drawer__close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.25rem;
}
.cart-drawer__close:hover { color: #fff; }

.cart-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.75rem;
  flex: 1;
  padding: 3rem 1rem;
}
.cart-drawer__empty-icon { opacity: 0.25; color: #e6b800; }
.cart-drawer__empty p { color: #666; font-size: 0.9rem; }
.cart-drawer__go-catalog {
  color: #e6b800;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.cart-drawer__go-catalog:hover { opacity: 1; }

/* Cart items */
.cart-drawer__items { display: flex; flex-direction: column; gap: 0.75rem; }

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #1a1a1a;
  border: 1px solid #252525;
  border-radius: 10px;
  padding: 0.85rem;
}
.cart-item__icon { flex-shrink: 0; color: #555; }
.cart-item__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.cart-item__title { font-size: 0.85rem; color: #d0d0d0; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item__qty {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.cart-item__qty button {
  width: 24px; height: 24px;
  background: #2a2a2a; border: none; border-radius: 4px;
  color: #888; font-size: 0.9rem; cursor: pointer; transition: background 0.15s, color 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.cart-item__qty button:hover { background: #e6b800; color: #000; }
.cart-item__qty-input {
  width: 36px; text-align: center;
  background: #2a2a2a; border: 1px solid #333; border-radius: 4px;
  color: #fff; font-size: 0.8rem; font-family: inherit;
  padding: 0.15rem; outline: none;
  -moz-appearance: textfield;
}
.cart-item__qty-input::-webkit-outer-spin-button,
.cart-item__qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }
.cart-item__remove {
  background: none; border: none; color: #444; cursor: pointer;
  font-size: 0.85rem; padding: 0.25rem; transition: color 0.2s; flex-shrink: 0;
}
.cart-item__remove:hover { color: #ff6b6b; }

/* Form */
.cart-drawer__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #1e1e1e;
}
.cart-drawer__form-title { font-size: 0.9rem; font-weight: 700; color: #fff; margin: 0 0 0.25rem; }
.cart-input {
  background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;
  padding: 0.7rem 0.9rem; color: #fff; font-size: 0.9rem;
  font-family: inherit; outline: none; transition: border-color 0.2s;
}
.cart-input:focus { border-color: #e6b800; }
.cart-input::placeholder { color: #444; }
.cart-textarea { resize: none; min-height: 60px; }
.cart-submit {
  padding: 0.85rem;
  background: #e6b800; color: #0a0a0a;
  font-size: 0.95rem; font-weight: 700; border: none; border-radius: 10px;
  cursor: pointer; font-family: inherit; transition: background 0.2s;
}
.cart-submit:hover:not(:disabled) { background: #f5c842; }
.cart-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.cart-success { color: #4ade80; font-size: 0.875rem; text-align: center; }

@media (max-width: 480px) {
  .cart-fab { bottom: 8.5rem; right: 1.25rem; }
  .cart-drawer { max-width: 100%; }
}
</style>
