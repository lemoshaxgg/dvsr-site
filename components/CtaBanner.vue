<template>
  <section class="cta-banner">
    <div class="cta-banner__glow"></div>
    <div class="cta-banner__inner" data-reveal="fade">
      <div class="cta-banner__text">
        <p class="cta-banner__pre">Бесплатная консультация</p>
        <h2 class="cta-banner__title">Подберём решение под ваш объект</h2>
        <p class="cta-banner__sub">Заборы, сваи, септики, трубопроводная арматура — звоните или пишите, ответим быстро</p>
      </div>
      <div class="cta-banner__actions">
        <a href="tel:+79143292929" class="cta-banner__btn cta-banner__btn--primary btn-shimmer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
          </svg>
          +7 914 329-29-29
        </a>
        <a href="/#contact" class="cta-banner__btn cta-banner__btn--secondary">
          Оставить заявку
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()
</script>

<style scoped>
.cta-banner {
  position: relative;
  padding: 4rem 1.5rem;
  background: linear-gradient(135deg, #0d0b00 0%, #0a0a0a 40%, #0b0d00 100%);
  border-top: 1px solid rgba(230,184,0,0.12);
  border-bottom: 1px solid rgba(230,184,0,0.12);
  overflow: hidden;
}

.cta-banner__glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 20% 50%, rgba(230,184,0,0.07), transparent),
    radial-gradient(ellipse 40% 60% at 80% 50%, rgba(230,184,0,0.05), transparent);
  pointer-events: none;
}

.cta-banner__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.cta-banner__text { flex: 1; }

.cta-banner__pre {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #e6b800;
  margin-bottom: 0.5rem;
  font-family: var(--font-body);
}

.cta-banner__title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  font-family: var(--font-display);
}

.cta-banner__sub {
  font-size: 0.9rem;
  color: #777;
  line-height: 1.6;
  max-width: 520px;
  font-family: var(--font-body);
}

.cta-banner__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
}

.cta-banner__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, transform 0.2s, box-shadow 0.25s;
  min-width: 220px;
}

.cta-banner__btn--primary {
  background: #e6b800;
  color: #0a0a0a;
}
.cta-banner__btn--primary:hover {
  background: #f5c842;
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px #e6b800, 0 8px 32px rgba(230,184,0,0.5), 0 0 60px rgba(230,184,0,0.2);
}

.cta-banner__btn--secondary {
  background: transparent;
  color: #e6b800;
  border: 1px solid rgba(230,184,0,0.35);
}
.cta-banner__btn--secondary:hover {
  background: rgba(230,184,0,0.08);
  border-color: rgba(230,184,0,0.6);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .cta-banner { padding: 3rem 1.25rem; }
  .cta-banner__inner {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  .cta-banner__sub { margin: 0 auto; }
  .cta-banner__actions { width: 100%; }
  .cta-banner__btn { width: 100%; min-width: unset; }
}
</style>
