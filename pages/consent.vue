<template>
  <div>
    <main class="privacy">
      <div class="privacy__container">
        <a href="/" class="privacy__back">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          На главную
        </a>

        <h1 class="privacy__title">Согласие на обработку персональных данных</h1>
        <p class="privacy__date">Редакция от 19 июня 2026 г.</p>

        <div class="privacy__content">
          <p>Заполняя и отправляя форму на сайте, пользователь (далее — «Субъект») свободно, своей волей и в своём интересе даёт согласие {{ c.fullNameLong }} (ИНН {{ c.inn }}, ОГРН {{ c.ogrn }}, адрес: {{ c.legalAddress }}) (далее — «Оператор») на обработку своих персональных данных на условиях, указанных ниже.</p>

          <h2>1. Перечень персональных данных</h2>
          <p>Фамилия, имя, отчество (имя); номер телефона; адрес электронной почты; содержание сообщения, а также иные данные, добровольно указанные Субъектом в форме.</p>

          <h2>2. Цели обработки</h2>
          <p>Обработка заявок и обращений, обратная связь, подготовка коммерческих предложений, заключение и исполнение договоров.</p>

          <h2>3. Перечень действий и способы обработки</h2>
          <p>Сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (предоставление, доступ) обработчикам Оператора, блокирование, удаление, уничтожение — с использованием средств автоматизации и без таковых.</p>

          <h2>4. Срок действия согласия</h2>
          <p>Согласие действует с момента отправки формы и до достижения целей обработки либо до его отзыва. Согласие может быть отозвано в любой момент путём направления письменного заявления на адрес <a :href="c.emailLink" target="_blank" rel="noopener">{{ c.email }}</a>.</p>

          <h2>5. Правовое основание</h2>
          <p>Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных». Подробный порядок обработки изложен в
            <a href="/privacy">Политике в отношении обработки персональных данных</a>.</p>

          <h2>6. Подтверждение</h2>
          <p>Субъект подтверждает, что ознакомлен с настоящим Согласием и Политикой, осознаёт их содержание и согласен с условиями обработки.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useCompany } from '~/composables/useCompany.js'
const c = useCompany()
useHead({ title: 'Согласие на обработку персональных данных — ДСР' })
</script>

<style scoped>
.privacy { min-height: 100vh; background: #0a0a0a; padding: 7rem 1.5rem 4rem; }
.privacy__container { max-width: 780px; margin: 0 auto; }
.privacy__back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #e6b800;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 2rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.privacy__back:hover { opacity: 1; }
.privacy__title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
.privacy__date { font-size: 0.85rem; color: #555; margin-bottom: 3rem; }
.privacy__content h2 { font-size: 1.1rem; font-weight: 700; color: #e6b800; margin: 2rem 0 0.75rem; }
.privacy__content p { color: #a0a0a0; line-height: 1.8; margin-bottom: 0.75rem; font-size: 0.95rem; }
.privacy__content a { color: #e6b800; text-decoration: none; }
.privacy__content a:hover { text-decoration: underline; }
</style>
