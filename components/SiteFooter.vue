<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <!-- Бренд + контакты -->
      <div class="site-footer__col">
        <p class="site-footer__brand">{{ c.brand }}</p>
        <p class="site-footer__line">{{ c.publicAddress }}</p>
        <p class="site-footer__line">
          <a :href="'tel:' + c.phoneTel">{{ c.phone }}</a>
          &nbsp;|&nbsp;
          <a :href="c.emailLink" target="_blank" rel="noopener">{{ c.email }}</a>
        </p>
        <p class="site-footer__line">
          <a :href="c.telegram" target="_blank" rel="noopener">Telegram</a>
        </p>
      </div>

      <!-- Юридические реквизиты -->
      <div class="site-footer__col">
        <p class="site-footer__caption">Реквизиты</p>
        <p class="site-footer__req">{{ c.fullNameLong }}</p>
        <p class="site-footer__req">ИНН {{ c.inn }} · КПП {{ c.kpp }}</p>
        <p class="site-footer__req">ОГРН {{ c.ogrn }}</p>
        <p class="site-footer__req">Юр. адрес: {{ c.legalAddress }}</p>
        <p class="site-footer__req">{{ c.director }}</p>
      </div>

      <!-- Документы -->
      <div class="site-footer__col">
        <p class="site-footer__caption">Документы</p>
        <a href="/privacy" class="site-footer__doc">Политика конфиденциальности</a>
        <a href="/consent" class="site-footer__doc">Согласие на обработку ПД</a>
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>© {{ year }} {{ c.shortName }}. Все права защищены.</p>
    </div>
  </footer>
</template>

<script setup>
import { useCompany } from '~/composables/useCompany.js'
const c = useCompany()
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: #080808;
  border-top: 1px solid #1e1e1e;
  padding: 2.5rem 1.5rem 1.5rem;
}
.site-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 0.9fr;
  gap: 2rem;
}
.site-footer__brand {
  color: #e6b800;
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
}
.site-footer__caption {
  color: #777;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  margin: 0 0 0.75rem;
}
.site-footer__line {
  color: #999;
  font-size: 0.85rem;
  line-height: 1.7;
  margin: 0 0 0.35rem;
}
.site-footer__req {
  color: #6e6e6e;
  font-size: 0.78rem;
  line-height: 1.6;
  margin: 0 0 0.3rem;
}
.site-footer__doc {
  display: block;
  color: #999;
  font-size: 0.85rem;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.15s;
}
.site-footer__doc:hover { color: #e6b800; }
.site-footer a { color: #e6b800; text-decoration: none; }
.site-footer a:hover { text-decoration: underline; }
.site-footer__bottom {
  max-width: 1100px;
  margin: 2rem auto 0;
  padding-top: 1.25rem;
  border-top: 1px solid #161616;
  text-align: center;
}
.site-footer__bottom p {
  color: #444;
  font-size: 0.78rem;
  margin: 0;
}
@media (max-width: 760px) {
  .site-footer__inner { grid-template-columns: 1fr; gap: 1.75rem; }
}
</style>
