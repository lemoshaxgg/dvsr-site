<template>
  <transition name="cookie-fade">
    <div v-if="visible" class="cookie" role="dialog" aria-label="Уведомление об использовании cookie">
      <p class="cookie__text">
        Мы используем файлы cookie и сервисы аналитики для корректной работы сайта и улучшения сервиса.
        Продолжая пользоваться сайтом, вы соглашаетесь с
        <a href="/privacy" class="cookie__link">Политикой конфиденциальности</a>
        и обработкой cookie.
      </p>
      <button class="cookie__btn" @click="accept">Принять</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const KEY = 'dsr-cookie-consent'

onMounted(() => {
  try {
    if (!localStorage.getItem(KEY)) visible.value = true
  } catch {
    visible.value = true
  }
})

function accept() {
  try { localStorage.setItem(KEY, new Date().toISOString()) } catch {}
  visible.value = false
}
</script>

<style scoped>
.cookie {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 400;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.1rem;
  background: rgba(14, 14, 14, 0.97);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(230, 184, 0, 0.25);
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55);
}
.cookie__text {
  margin: 0;
  flex: 1;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #b0b0b0;
}
.cookie__link {
  color: #e6b800;
  text-decoration: underline;
}
.cookie__btn {
  flex-shrink: 0;
  padding: 0.6rem 1.4rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.cookie__btn:hover {
  background: #f5c842;
  transform: translateY(-1px);
}
.cookie-fade-enter-active { transition: opacity 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.cookie-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.cookie-fade-enter-from, .cookie-fade-leave-to { opacity: 0; transform: translateY(16px); }

@media (max-width: 560px) {
  .cookie { flex-direction: column; align-items: stretch; text-align: left; gap: 0.7rem; }
  .cookie__btn { width: 100%; }
}
</style>
