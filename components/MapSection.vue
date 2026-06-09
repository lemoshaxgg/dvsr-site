<template>
  <section id="map" class="map-section">
    <div class="map-section__container">
      <div class="map-section__badge" data-reveal>Где мы находимся</div>
      <h2 class="map-section__title" data-reveal data-delay="1">Наш офис во Владивостоке</h2>
      <div class="map-section__divider" data-reveal data-delay="2"></div>

      <div class="map-section__grid">
        <div class="map-section__info" data-reveal="left">
          <div class="map-section__contact-card">
            <div class="map-section__contact-item">
              <div class="map-section__contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s-7-6.75-7-11a7 7 0 1 1 14 0c0 4.25-7 11-7 11z"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
              </div>
              <div>
                <p class="map-section__contact-label">Адрес</p>
                <p class="map-section__contact-value">г. Владивосток, ул. Русская, д. 17, каб. 704</p>
              </div>
            </div>

            <div class="map-section__contact-item">
              <div class="map-section__contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1.07 3.18 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.35 5.35l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <p class="map-section__contact-label">Телефон</p>
                <a href="tel:+79143292929" class="map-section__contact-value map-section__contact-link">+7 914 329-29-29</a>
              </div>
            </div>

            <div class="map-section__contact-item">
              <div class="map-section__contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m2 7 10 7 10-7"/></svg>
              </div>
              <div>
                <p class="map-section__contact-label">Email</p>
                <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener" class="map-section__contact-value map-section__contact-link">ooo-dsr@bk.ru</a>
              </div>
            </div>

            <div class="map-section__contact-item">
              <div class="map-section__contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 7v5l3 3"/></svg>
              </div>
              <div>
                <p class="map-section__contact-label">Режим работы</p>
                <p class="map-section__contact-value">Пн–Пт: 9:00 – 18:00</p>
              </div>
            </div>
          </div>

          <div class="map-section__map-links">
            <a href="https://yandex.ru/maps/?text=Владивосток+ул+Русская+17" target="_blank" rel="noopener" class="map-section__map-btn map-section__map-btn--yandex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4c2.21 0 4 1.79 4 4 0 3-4 8.4-4 8.4S8 11 8 8c0-2.21 1.79-4 4-4zm0 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
              Яндекс.Карты
            </a>
            <a href="https://2gis.ru/vladivostok/search/ул%20Русская%2017" target="_blank" rel="noopener" class="map-section__map-btn map-section__map-btn--2gis">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              2ГИС
            </a>
            <a href="https://maps.google.com/?q=Владивосток+ул+Русская+17" target="_blank" rel="noopener" class="map-section__map-btn map-section__map-btn--google">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Google Maps
            </a>
          </div>
        </div>

        <div class="map-section__map" data-reveal="right">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=131.940080%2C43.133645&z=16&pt=131.940080%2C43.133645,pm2rdl&text=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BA%2C%20%D1%83%D0%BB.%20%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B0%D1%8F%2C%2017"
            width="100%" height="100%" frameborder="0" allowfullscreen title="Офис ДСР на карте"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()
</script>

<style scoped>
.map-section { padding: 6rem 1.5rem; background: #0f0f0f; }
.map-section__container { max-width: 1100px; margin: 0 auto; }

.map-section__badge {
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

.map-section__title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 700; color: #fff; margin-bottom: 1.25rem; }
.map-section__divider { width: 60px; height: 3px; background: #e6b800; border-radius: 2px; margin-bottom: 3rem; }

.map-section__grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2rem;
  align-items: stretch;
  min-height: 400px;
}

.map-section__info { display: flex; flex-direction: column; gap: 1.5rem; }

.map-section__contact-card {
  background: #141414;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.map-section__contact-item { display: flex; align-items: flex-start; gap: 0.85rem; }
.map-section__contact-icon { flex-shrink: 0; margin-top: 2px; color: #e6b800; display: flex; align-items: center; }
.map-section__contact-label { font-size: 0.72rem; color: #555; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.2rem; }
.map-section__contact-value { font-size: 0.95rem; color: #c0c0c0; line-height: 1.4; }
.map-section__contact-link { color: #e6b800; text-decoration: none; transition: color 0.2s; }
.map-section__contact-link:hover { color: #f5c842; }

.map-section__map-links { display: flex; flex-direction: column; gap: 0.5rem; }
.map-section__map-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}
.map-section__map-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.map-section__map-btn--yandex { background: #fc3f1d; color: #fff; }
.map-section__map-btn--2gis   { background: #1b5e20; color: #fff; }
.map-section__map-btn--google { background: #4285f4; color: #fff; }

.map-section__map { border-radius: 16px; overflow: hidden; border: 1px solid #222; min-height: 400px; }
.map-section__map iframe { width: 100%; height: 100%; min-height: 400px; display: block; filter: grayscale(30%) brightness(0.85); }

@media (max-width: 900px) {
  .map-section__grid { grid-template-columns: 1fr; }
  .map-section__map { min-height: 300px; }
  .map-section__map iframe { min-height: 300px; }
  .map-section__map-links { flex-direction: row; }
  .map-section__map-btn { flex: 1; justify-content: center; font-size: 0.8rem; }
}
@media (max-width: 480px) {
  .map-section { padding: 4rem 1.25rem; }
  .map-section__map-links { flex-direction: column; }
}
</style>
