<template>
  <section id="gallery" class="gallery">
    <div class="gallery__container">
      <div class="gallery__badge" data-reveal>Наши работы</div>
      <h2 class="gallery__title" data-reveal data-delay="1">Выполненные проекты</h2>
      <div class="gallery__divider" data-reveal data-delay="2"></div>

      <div class="gallery__grid" data-reveal>
        <div
          v-for="(item, i) in photos"
          :key="i"
          class="gallery__item"
          :class="[`gallery__item--${item.size}`, item.whiteBg ? 'gallery__item--product' : '']"
          @click="openPhoto(item)"
        >
          <img v-if="item.src" :src="item.src" :alt="item.title" :class="item.whiteBg ? 'img--product' : ''" />
          <div v-else class="gallery__placeholder">
            <svg class="gallery__placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m3 16 5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></svg>
            <span class="gallery__placeholder-label">{{ item.title }}</span>
          </div>
          <div class="gallery__item-overlay">
            <span class="gallery__item-title">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <p class="gallery__note" data-reveal>Фото из нашего каталога — звоните, чтобы уточнить наличие и цену</p>
    </div>

    <!-- Лайтбокс -->
    <transition name="lightbox">
      <div v-if="activePhoto" class="lightbox" @click.self="activePhoto = null">
        <button class="lightbox__close" @click="activePhoto = null">✕</button>
        <button class="lightbox__prev" @click="prevPhoto">‹</button>
        <div class="lightbox__content">
          <img v-if="activePhoto.src" :src="activePhoto.src" :alt="activePhoto.title" />
          <div v-else class="lightbox__placeholder">
            <span>{{ activePhoto.icon }}</span>
            <p>{{ activePhoto.title }}</p>
          </div>
          <p class="lightbox__caption">{{ activePhoto.title }}</p>
        </div>
        <button class="lightbox__next" @click="nextPhoto">›</button>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

const activePhoto = ref(null)
const activeIndex = ref(0)

const photos = [
  { size: 'wide', icon: '🔩', title: 'Забор из 3D-панелей', src: '/gallery/zabor-panel-3d.jpg', whiteBg: true },
  { size: 'tall', icon: '🏠', title: 'Жилой дом под ключ', src: null },
  { size: 'normal', icon: '⚓', title: 'Сваи винтовые', src: '/gallery/svaya-shurup.jpg', whiteBg: true },
  { size: 'normal', icon: '💧', title: 'Монтаж септика', src: '/gallery/septik.jpg', whiteBg: true },
  { size: 'normal', icon: '📦', title: 'Бытовка металлическая', src: null },
  { size: 'wide', icon: '🚜', title: 'Земляные работы', src: null },
  { size: 'normal', icon: '🐕', title: 'Вольер из сетки', src: '/gallery/setka-volyer.jpg', whiteBg: true },
  { size: 'normal', icon: '🏗️', title: 'Металлоконструкции', src: null },
]

function openPhoto(item) {
  activeIndex.value = photos.indexOf(item)
  activePhoto.value = item
}

function prevPhoto() {
  activeIndex.value = (activeIndex.value - 1 + photos.length) % photos.length
  activePhoto.value = photos[activeIndex.value]
}

function nextPhoto() {
  activeIndex.value = (activeIndex.value + 1) % photos.length
  activePhoto.value = photos[activeIndex.value]
}
</script>

<style scoped>
.gallery {
  padding: 6rem 1.5rem;
  background: #0a0a0a;
}

.gallery__container {
  max-width: 1100px;
  margin: 0 auto;
}

.gallery__badge {
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

.gallery__title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
}

.gallery__divider {
  width: 60px;
  height: 3px;
  background: #e6b800;
  border-radius: 2px;
  margin-bottom: 3rem;
}

/* Сетка */
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 220px);
  gap: 0.75rem;
}

.gallery__item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #141414;
  border: 1px solid #1e1e1e;
  transition: transform 0.25s, box-shadow 0.25s;
}

.gallery__item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 1;
}

.gallery__item--wide { grid-column: span 2; }
.gallery__item--tall { grid-row: span 2; }

.gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery__item--product {
  background: #0d0d0d;
}

.gallery__item--product .img--product {
  object-fit: contain;
  padding: 8%;
  filter: drop-shadow(0 4px 24px rgba(230, 184, 0, 0.25));
  transition: filter 0.3s;
}

.gallery__item--product:hover .img--product {
  filter: drop-shadow(0 4px 36px rgba(230, 184, 0, 0.55));
}

.gallery__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(145deg, #1c1a10, #111);
}

.gallery__placeholder-icon { color: #2a2a2a; opacity: 0.8; }
.gallery__placeholder-label { font-size: 0.75rem; color: #333; text-align: center; padding: 0 0.5rem; }

.gallery__item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 0.75rem 0.75rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  opacity: 0;
  transition: opacity 0.25s;
}

.gallery__item:hover .gallery__item-overlay { opacity: 1; }

.gallery__item-title {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
}

.gallery__note {
  text-align: center;
  color: #333;
  font-size: 0.8rem;
  margin-top: 1.5rem;
}

/* Лайтбокс */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.93);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.lightbox__content {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.lightbox__content img {
  max-height: 70vh;
  width: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.lightbox__placeholder {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: #111;
  border-radius: 12px;
  font-size: 4rem;
  color: #555;
}

.lightbox__caption {
  color: #888;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.lightbox__close {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.lightbox__close:hover { background: rgba(255,255,255,0.2); }

.lightbox__prev,
.lightbox__next {
  background: rgba(255,255,255,0.08);
  border: none;
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: background 0.2s;
}
.lightbox__prev:hover,
.lightbox__next:hover { background: rgba(230,184,0,0.2); color: #e6b800; }

.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.25s; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .gallery { padding: 4rem 1.25rem; }
  .gallery__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
  .gallery__item--wide { grid-column: span 2; }
  .gallery__item--tall { grid-row: span 1; }
}
</style>
