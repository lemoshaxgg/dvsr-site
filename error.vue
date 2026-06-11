<template>
  <div class="err">
    <nav class="err__nav">
      <a href="/" class="err__logo">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#e6b800"/>
          <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="18" font-weight="900" font-family="Arial,sans-serif" fill="#0a0a0a">ДСР</text>
        </svg>
      </a>
    </nav>

    <div class="err__body">
      <div class="err__code">{{ error?.statusCode || 404 }}</div>

      <h1 class="err__title">
        {{ error?.statusCode === 500 ? 'Ошибка сервера' : 'Страница не найдена' }}
      </h1>
      <p class="err__sub">
        {{ error?.statusCode === 500
          ? 'Что-то пошло не так. Попробуйте обновить страницу или вернитесь позже.'
          : 'Возможно, страница была удалена или вы перешли по устаревшей ссылке.' }}
      </p>

      <div class="err__actions">
        <a href="/" class="err__btn err__btn--primary">На главную</a>
        <a href="/catalog" class="err__btn err__btn--secondary">В каталог</a>
      </div>

      <div class="err__links">
        <a href="/about">О компании</a>
        <a href="/promotions">Акции</a>
        <a href="/blog">Блог</a>
      </div>
    </div>

    <div class="err__bg-text" aria-hidden="true">{{ error?.statusCode || 404 }}</div>
  </div>
</template>

<script setup>
const props = defineProps({ error: Object })
</script>

<style scoped>
.err {
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.err__nav {
  position: absolute;
  top: 1.5rem;
  left: 2rem;
}
.err__logo { text-decoration: none; display: flex; align-items: center; gap: 0.6rem; }
.err__logo-text { font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: 0.05em; }

.err__body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  max-width: 520px;
}

.err__code {
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: 900;
  color: #e6b800;
  line-height: 1;
  letter-spacing: -0.03em;
}

.err__title {
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.err__sub {
  color: #666;
  font-size: 1rem;
  line-height: 1.65;
  margin: 0;
}

.err__actions {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.err__btn {
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.err__btn--primary {
  background: #e6b800;
  color: #0a0a0a;
}
.err__btn--primary:hover { background: #f5c842; }
.err__btn--secondary {
  background: transparent;
  color: #e6b800;
  border: 1px solid rgba(230,184,0,0.4);
}
.err__btn--secondary:hover { background: rgba(230,184,0,0.1); border-color: #e6b800; }

.err__links {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}
.err__links a {
  color: #444;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
}
.err__links a:hover { color: #e6b800; }

.err__bg-text {
  position: absolute;
  bottom: -0.1em;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(10rem, 35vw, 22rem);
  font-weight: 900;
  color: rgba(255,255,255,0.015);
  line-height: 1;
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: -0.05em;
  z-index: 1;
}

@media (max-width: 480px) {
  .err__actions { flex-direction: column; width: 100%; }
  .err__btn { text-align: center; }
  .err__links { gap: 1rem; }
}
</style>
