<template>
  <div>


    <main v-if="post" class="article">
      <div class="article__hero" :style="post.image ? `background-image: url(${post.image})` : ''">
        <div class="article__hero-overlay">
          <div class="article__hero-inner">
            <nav class="article__breadcrumb">
              <a href="/">Главная</a><span>/</span>
              <a href="/blog">Блог</a><span>/</span>
              <span>{{ post.title }}</span>
            </nav>
            <div class="article__cat">{{ post.category }}</div>
            <h1 class="article__title">{{ post.title }}</h1>
            <div class="article__meta">
              <span>{{ formatDate(post.date) }}</span>
              <span>{{ post.author }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="article__layout">
        <article class="article__content" v-html="post.content"></article>

        <aside class="article__sidebar">
          <div class="article__sidebar-card">
            <h3>Нужна консультация?</h3>
            <p>Наши специалисты помогут подобрать материалы для вашего проекта</p>
            <a href="tel:+79143292929" class="article__sidebar-phone">+7 914 329-29-29</a>
            <a href="/catalog" class="article__sidebar-btn">Перейти в каталог</a>
          </div>

          <div class="article__sidebar-posts">
            <h3>Другие статьи</h3>
            <a v-for="p in otherPosts" :key="p.slug" :href="`/blog/${p.slug}`" class="article__sidebar-link">
              <span class="article__sidebar-link-cat">{{ p.category }}</span>
              <span class="article__sidebar-link-title">{{ p.title }}</span>
            </a>
          </div>
        </aside>
      </div>
    </main>

    <main v-else class="article article--404">
      <div class="article__404">
        <h2>Статья не найдена</h2>
        <a href="/blog">← Вернуться в блог</a>
      </div>
    </main>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { posts } from '~/data/blog.js'

const route = useRoute()
const post = posts.find(p => p.slug === route.params.slug) ?? null
const otherPosts = posts.filter(p => p.slug !== route.params.slug)

if (post) {
  useHead({ title: `${post.title} — ДСР Владивосток` })
  useSeoMeta({
    description: post.excerpt.slice(0, 160),
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogImage: post.image ? `https://dsr-dv.ru${post.image}` : undefined,
    ogUrl: `https://dsr-dv.ru/blog/${post.slug}`,
  })
} else {
  useHead({ title: 'Статья не найдена — ДСР' })
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.article { min-height: 100vh; background: #0a0a0a; }

.article__hero {
  background-color: #0d0d0d;
  background-size: cover;
  background-position: center;
  min-height: 340px;
  display: flex;
  align-items: flex-end;
}
.article__hero-overlay {
  width: 100%;
  background: linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.6) 60%, rgba(10,10,10,0.3) 100%);
  padding: 5rem 1.5rem 2.5rem;
}
.article__hero-inner { max-width: 800px; margin: 0 auto; }

.article__breadcrumb { display: flex; gap: 0.5rem; font-size: 0.8rem; color: #555; margin-bottom: 1rem; flex-wrap: wrap; }
.article__breadcrumb a { color: #e6b800; text-decoration: none; opacity: 0.8; }
.article__breadcrumb a:hover { opacity: 1; }
.article__breadcrumb span { color: #333; }
.article__breadcrumb span:last-child { color: #888; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.article__cat {
  display: inline-block;
  font-size: 0.72rem; font-weight: 700; color: #e6b800;
  background: rgba(230,184,0,0.1); border: 1px solid rgba(230,184,0,0.25);
  padding: 0.25rem 0.75rem; border-radius: 999px;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 1rem;
}
.article__title { font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 800; color: #fff; line-height: 1.25; margin-bottom: 1rem; }
.article__meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #555; }

.article__layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  align-items: start;
}

/* Article content */
.article__content {
  color: #b0b0b0;
  font-size: 1rem;
  line-height: 1.8;
}
.article__content :deep(h2) {
  font-size: 1.3rem; font-weight: 700; color: #fff;
  margin: 2rem 0 1rem; padding-bottom: 0.5rem;
  border-bottom: 1px solid #1e1e1e;
}
.article__content :deep(p) { margin-bottom: 1.25rem; }
.article__content :deep(strong) { color: #e0e0e0; }
.article__content :deep(a) { color: #e6b800; text-decoration: none; }
.article__content :deep(a:hover) { text-decoration: underline; }

/* Sidebar */
.article__sidebar { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 1.5rem; }

.article__sidebar-card {
  background: #111;
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.article__sidebar-card h3 { font-size: 1rem; font-weight: 700; color: #fff; margin: 0; }
.article__sidebar-card p { font-size: 0.875rem; color: #777; line-height: 1.5; margin: 0; }

.article__sidebar-phone {
  font-size: 1.1rem; font-weight: 700; color: #e6b800;
  text-decoration: none; transition: opacity 0.2s;
}
.article__sidebar-phone:hover { opacity: 0.8; }

.article__sidebar-btn {
  display: block; text-align: center;
  padding: 0.75rem; background: #e6b800; color: #0a0a0a;
  font-weight: 700; font-size: 0.9rem; border-radius: 10px;
  text-decoration: none; transition: background 0.2s;
}
.article__sidebar-btn:hover { background: #f5c842; }

.article__sidebar-posts {
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.article__sidebar-posts h3 { font-size: 0.85rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.25rem; }

.article__sidebar-link {
  display: flex; flex-direction: column; gap: 0.2rem;
  text-decoration: none; padding: 0.6rem; border-radius: 8px;
  transition: background 0.15s;
}
.article__sidebar-link:hover { background: rgba(230,184,0,0.06); }
.article__sidebar-link-cat { font-size: 0.7rem; color: #e6b800; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
.article__sidebar-link-title { font-size: 0.85rem; color: #b0b0b0; line-height: 1.35; }
.article__sidebar-link:hover .article__sidebar-link-title { color: #fff; }

/* 404 */
.article--404 .article__404 { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 1rem; text-align: center; }
.article__404 h2 { color: #fff; font-size: 1.8rem; }
.article__404 a { color: #e6b800; text-decoration: none; }

.page-footer { padding: 2.5rem 1.5rem; background: #080808; border-top: 1px solid #1e1e1e; text-align: center; margin-top: 4rem; }
.page-footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.4rem; color: #555; font-size: 0.85rem; }
.page-footer__inner a { color: #888; text-decoration: none; }
.page-footer__inner a:hover { color: #e6b800; }
.page-footer__inner p:first-child { color: #e6b800; font-weight: 600; }

@media (max-width: 900px) {
  .article__layout { grid-template-columns: 1fr; }
  .article__sidebar { position: static; }
}
</style>
