<template>
  <main>

    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <TrustSection />
    <CtaBanner />
    <GallerySection />
    <ReviewsSection />
    <CtaBanner />
    <MapSection />
    <ContactForm />

  </main>
</template>

<script setup>
useHead({ title: 'Заборы 3D, сваи, септики — снабжение и монтаж во Владивостоке | ДСР' })
useSeoMeta({
  description: 'ООО ДСР, Владивосток: заборы 3D, винтовые и лопастные сваи, септики, кессоны, погреба, стройматериалы. Снабжение объектов, поставка и монтаж под ключ по Владивостоку и Приморскому краю. Прямые поставки. ☎ +7 914 329-29-29',
  ogTitle: 'ДСР — заборы, сваи, септики, снабжение и монтаж во Владивостоке',
  ogDescription: 'Заборы 3D, винтовые сваи, септики, стройматериалы. Снабжение объектов, поставка и монтаж под ключ. Владивосток и Приморский край. ☎ +7 914 329-29-29',
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
