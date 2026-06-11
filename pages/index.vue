<template>
  <main>
    <NavBar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <GallerySection />
    <ReviewsSection />
    <MapSection />
    <ContactForm />

    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__name">ДСР — Дальневосточные Системы Развития</p>
        <p class="footer__contacts">
          г. Владивосток, ул. Русская, д. 17, каб. 704 &nbsp;|&nbsp;
          <a href="tel:+79143292929">+7 914 329-29-29</a> &nbsp;|&nbsp;
          <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener">ooo-dsr@bk.ru</a>
        </p>
        <p class="footer__copy">© {{ new Date().getFullYear() }} ДСР. Все права защищены.</p>
      </div>
    </footer>
  </main>
</template>

<script setup>
useHead({ title: 'ДСР — Дальневосточные Системы Развития | Владивосток' })
useSeoMeta({
  description: 'ООО ДСР — строительные материалы, трубопроводная арматура, металлопрокат, септики, заборы 3D, сваи и оборудование во Владивостоке. Более 2300 позиций в каталоге.',
  ogTitle: 'ДСР — Дальневосточные Системы Развития',
  ogDescription: 'Строительные материалы и оборудование во Владивостоке. Более 2300 позиций. Звоните: +7 914 329-29-29',
  ogImage: 'https://dvsr-site.vercel.app/og-dsr.jpg',
  ogUrl: 'https://dvsr-site.vercel.app',
  twitterCard: 'summary_large_image',
})
</script>

<style scoped>
.footer {
  padding: 2.5rem 1.5rem;
  background: #080808;
  border-top: 1px solid #1e1e1e;
  text-align: center;
}

.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__name {
  color: #e6b800;
  font-weight: 600;
  font-size: 0.95rem;
}

.footer__contacts {
  color: #555;
  font-size: 0.85rem;
}

.footer__contacts a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.footer__contacts a:hover {
  color: #e6b800;
}

.footer__copy {
  color: #333;
  font-size: 0.8rem;
}
</style>
