<template>
  <div>


    <main class="blog-page">
      <div class="blog-page__hero">
        <div class="blog-page__hero-inner">
          <nav class="blog-page__breadcrumb">
            <a href="/">Главная</a><span>/</span><span>Блог</span>
          </nav>
          <h1 class="blog-page__title">Блог и полезные статьи</h1>
          <p class="blog-page__sub">Советы по выбору материалов и оборудования от специалистов ДСР</p>
        </div>
      </div>

      <div class="blog-page__inner">
        <div class="blog-grid">
          <a v-for="post in posts" :key="post.slug" :href="`/blog/${post.slug}`" class="blog-card">
            <div class="blog-card__img-wrap">
              <img v-if="post.image" :src="post.image" :alt="post.title" class="blog-card__img" loading="lazy" />
              <div v-else class="blog-card__img-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7 8h10M7 12h10M7 16h6"/></svg></div>
            </div>
            <div class="blog-card__body">
              <div class="blog-card__meta">
                <span class="blog-card__cat">{{ post.category }}</span>
                <span class="blog-card__date">{{ formatDate(post.date) }}</span>
              </div>
              <h2 class="blog-card__title">{{ post.title }}</h2>
              <p class="blog-card__excerpt">{{ post.excerpt }}</p>
              <span class="blog-card__link">Читать статью →</span>
            </div>
          </a>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { posts } from '~/data/blog.js'

useHead({ title: 'Блог — ДСР Владивосток' })
useSeoMeta({
  description: 'Полезные статьи о выборе строительных материалов, трубопроводной арматуры, септиков и заборов от специалистов ДСР.',
})

function formatDate(str) {
  return new Date(str).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.blog-page { min-height: 100vh; background: #0a0a0a; padding-bottom: 4rem; }

.blog-page__hero {
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 80%);
  padding: 6rem 1.5rem 2.5rem;
  border-bottom: 1px solid #1a1a1a;
}
.blog-page__hero-inner { max-width: 1100px; margin: 0 auto; }
.blog-page__breadcrumb { display: flex; gap: 0.5rem; font-size: 0.8rem; color: #555; margin-bottom: 1rem; }
.blog-page__breadcrumb a { color: #e6b800; text-decoration: none; opacity: 0.8; }
.blog-page__breadcrumb a:hover { opacity: 1; }
.blog-page__breadcrumb span { color: #333; }
.blog-page__breadcrumb span:last-child { color: #777; }
.blog-page__title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #fff; margin-bottom: 0.75rem; }
.blog-page__sub { color: #666; font-size: 1rem; }

.blog-page__inner { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }

.blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.75rem; }

.blog-card {
  background: linear-gradient(145deg, #141410, #111);
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}
.blog-card:hover {
  border-color: rgba(230,184,0,0.35);
  box-shadow: 0 8px 32px rgba(230,184,0,0.07);
  transform: translateY(-3px);
}

.blog-card__img-wrap { height: 200px; overflow: hidden; background: #0d0d0d; }
.blog-card__img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85); transition: transform 0.4s, filter 0.4s; }
.blog-card:hover .blog-card__img { transform: scale(1.04); filter: brightness(1); }
.blog-card__img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.15; color: #e6b800; }

.blog-card__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }

.blog-card__meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.blog-card__cat {
  font-size: 0.72rem; font-weight: 700; color: #e6b800;
  background: rgba(230,184,0,0.1); border: 1px solid rgba(230,184,0,0.2);
  padding: 0.2rem 0.65rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.08em;
}
.blog-card__date { font-size: 0.75rem; color: #555; }

.blog-card__title { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.35; margin: 0; }
.blog-card__excerpt { font-size: 0.875rem; color: #777; line-height: 1.6; flex: 1; margin: 0; }
.blog-card__link { font-size: 0.85rem; font-weight: 600; color: #e6b800; opacity: 0.8; transition: opacity 0.2s; margin-top: auto; }
.blog-card:hover .blog-card__link { opacity: 1; }

.page-footer { padding: 2.5rem 1.5rem; background: #080808; border-top: 1px solid #1e1e1e; text-align: center; }
.page-footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.4rem; color: #555; font-size: 0.85rem; }
.page-footer__inner a { color: #888; text-decoration: none; }
.page-footer__inner a:hover { color: #e6b800; }
.page-footer__inner p:first-child { color: #e6b800; font-weight: 600; }

@media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; } }
</style>
