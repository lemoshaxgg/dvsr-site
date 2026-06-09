<template>
  <section id="contact" class="contact">
    <div class="contact__container">
      <div class="contact__badge" data-reveal>Связаться с нами</div>
      <h2 class="contact__title" data-reveal data-delay="1">Оставьте заявку</h2>
      <p class="contact__desc" data-reveal data-delay="2">Опишите вашу задачу — мы перезвоним и рассчитаем стоимость.</p>
      <div class="contact__divider" data-reveal data-delay="2"></div>

      <div class="contact__grid">
        <form class="contact__form" data-reveal="left" @submit.prevent="submitForm">
          <div class="form-group">
            <label class="form-label">Ваше имя <span class="form-required">*</span></label>
            <input v-model="form.name" type="text" class="form-input" :class="{ 'form-input--error': errors.name }" placeholder="Иван Иванов" maxlength="100" />
            <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Телефон <span class="form-required">*</span></label>
            <input v-model="form.phone" type="tel" class="form-input" :class="{ 'form-input--error': errors.phone }" placeholder="+7 914 000-00-00" maxlength="20" />
            <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Email <span class="form-optional">(по желанию)</span></label>
            <input v-model="form.email" type="email" class="form-input" placeholder="mail@example.com" maxlength="100" />
          </div>

          <div class="form-group">
            <label class="form-label">Сообщение <span class="form-required">*</span></label>
            <textarea v-model="form.message" class="form-input form-textarea" :class="{ 'form-input--error': errors.message }" placeholder="Опишите вашу задачу..." rows="5" maxlength="1000"></textarea>
            <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
          </div>

          <label class="form-consent">
            <input v-model="form.consent" type="checkbox" class="form-consent__checkbox" />
            <span class="form-consent__text">
              Согласен на
              <a href="/privacy" target="_blank" class="form-consent__link">обработку персональных данных</a>
              в соответствии с Политикой конфиденциальности
            </span>
          </label>
          <span v-if="errors.consent" class="form-error">{{ errors.consent }}</span>

          <button type="submit" class="form-btn" :disabled="loading">
            <span v-if="loading">Отправка...</span>
            <span v-else>Отправить заявку</span>
          </button>

          <div v-if="success" class="form-success">
            Заявка отправлена! Мы свяжемся с вами в ближайшее время.
          </div>
        </form>

        <div class="contact__info" data-reveal="right">
          <h3 class="contact__info-title">Контакты</h3>
          <div class="contact__info-items">
            <div class="contact__info-item">
              <span class="contact__info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s-7-6.75-7-11a7 7 0 1 1 14 0c0 4.25-7 11-7 11z"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg></span>
              <span>г. Владивосток, ул. Русская, д. 17, каб. 704</span>
            </div>
            <div class="contact__info-item">
              <span class="contact__info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19 19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1.07 3.18 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.35 5.35l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
              <a href="tel:+79143292929" class="contact__info-link">+7 914 329-29-29</a>
            </div>
            <div class="contact__info-item">
              <span class="contact__info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m2 7 10 7 10-7"/></svg></span>
              <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener" class="contact__info-link">ooo-dsr@bk.ru</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
useScrollReveal()

const loading = ref(false)
const success = ref(false)

const form = reactive({ name: '', phone: '', email: '', message: '', consent: false })
const errors = reactive({ name: '', phone: '', message: '', consent: '' })

function validate() {
  errors.name = ''
  errors.phone = ''
  errors.message = ''
  errors.consent = ''
  let valid = true
  if (!form.name.trim()) { errors.name = 'Введите ваше имя'; valid = false }
  if (!form.phone.trim()) { errors.phone = 'Введите номер телефона'; valid = false }
  else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone.trim())) { errors.phone = 'Введите корректный номер'; valid = false }
  if (!form.message.trim()) { errors.message = 'Напишите сообщение'; valid = false }
  if (!form.consent) { errors.consent = 'Необходимо согласие на обработку данных'; valid = false }
  return valid
}

async function submitForm() {
  if (!validate()) return
  loading.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    success.value = true
    form.name = ''; form.phone = ''; form.email = ''; form.message = ''; form.consent = false
  } catch (e) {
    errors.message = 'Ошибка отправки. Позвоните нам напрямую.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact { padding: 6rem 1.5rem; background: #0f0f0f; }
.contact__container { max-width: 1100px; margin: 0 auto; }

.contact__badge {
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

.contact__title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.contact__desc { color: #888; font-size: 1rem; margin-bottom: 1.25rem; }
.contact__divider { width: 60px; height: 3px; background: #e6b800; border-radius: 2px; margin-bottom: 3rem; }

.contact__grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 4rem;
  align-items: start;
}

.contact__form { display: flex; flex-direction: column; gap: 1.25rem; }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label { font-size: 0.875rem; font-weight: 500; color: #c0c0c0; }
.form-required { color: #e6b800; }
.form-optional { color: #555; font-weight: 400; }

.form-input {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
  outline: none;
}
.form-input::placeholder { color: #444; }
.form-input:focus { border-color: #e6b800; }
.form-input--error { border-color: #e05555; }
.form-textarea { resize: vertical; min-height: 120px; }
.form-error { font-size: 0.8rem; color: #e05555; }

.form-consent { display: flex; align-items: flex-start; gap: 0.6rem; cursor: pointer; }
.form-consent__checkbox { margin-top: 2px; width: 16px; height: 16px; flex-shrink: 0; accent-color: #e6b800; cursor: pointer; }
.form-consent__text { font-size: 0.8rem; color: #666; line-height: 1.5; }
.form-consent__link { color: #e6b800; text-decoration: underline; }
.form-consent__link:hover { color: #f5c842; }

.form-btn {
  padding: 0.9rem 2rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  font-family: inherit;
}
.form-btn:hover:not(:disabled) { background: #f5c842; transform: translateY(-2px); }
.form-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.form-success {
  padding: 1rem 1.25rem;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 8px;
  color: #4ade80;
  font-size: 0.95rem;
}

.contact__info { background: #141414; border: 1px solid #222; border-radius: 16px; padding: 2rem; }
.contact__info-title { font-size: 1.2rem; font-weight: 600; color: #fff; margin-bottom: 1.5rem; }
.contact__info-items { display: flex; flex-direction: column; gap: 1.25rem; }
.contact__info-item { display: flex; align-items: flex-start; gap: 0.85rem; color: #b0b0b0; font-size: 0.95rem; line-height: 1.5; }
.contact__info-icon { flex-shrink: 0; margin-top: 2px; color: #e6b800; display: flex; align-items: center; }
.contact__info-link { color: #e6b800; text-decoration: none; transition: color 0.2s; }
.contact__info-link:hover { color: #f5c842; }

@media (max-width: 900px) { .contact__grid { grid-template-columns: 1fr; gap: 2.5rem; } }
@media (max-width: 768px) { .contact { padding: 4rem 1.25rem; } }
</style>
