<template>
  <div>
    <NavBar />

    <main class="privacy">
      <div class="privacy__container">
        <a href="/" class="privacy__back">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          На главную
        </a>

        <h1 class="privacy__title">Политика конфиденциальности</h1>
        <p class="privacy__date">Дата вступления в силу: 1 июня 2025 г.</p>

        <div class="privacy__content">
          <h2>1. Общие положения</h2>
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта ООО «ДСР» (Дальневосточные Системы Развития), расположенного по адресу: г. Владивосток, ул. Русская, д. 17, каб. 704.</p>
          <p>Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>

          <h2>2. Какие данные мы собираем</h2>
          <p>При заполнении форм на сайте мы можем получать следующие персональные данные:</p>
          <ul>
            <li>Фамилия, имя, отчество</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты (по желанию)</li>
            <li>Содержание сообщения / запроса</li>
          </ul>

          <h2>3. Цели обработки персональных данных</h2>
          <p>Персональные данные обрабатываются в следующих целях:</p>
          <ul>
            <li>Обработка заявок и обращений пользователей</li>
            <li>Обратная связь по вопросам товаров и услуг</li>
            <li>Подготовка коммерческих предложений</li>
            <li>Заключение и исполнение договоров</li>
          </ul>

          <h2>4. Правовые основания обработки</h2>
          <p>Обработка персональных данных осуществляется на основании согласия субъекта персональных данных, выраженного при заполнении формы на сайте.</p>

          <h2>5. Передача данных третьим лицам</h2>
          <p>Персональные данные не передаются третьим лицам, за исключением случаев, предусмотренных действующим законодательством Российской Федерации.</p>

          <h2>6. Хранение данных</h2>
          <p>Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, но не более 3 (трёх) лет с момента получения согласия, либо до его отзыва.</p>

          <h2>7. Права субъекта персональных данных</h2>
          <p>Вы имеете право:</p>
          <ul>
            <li>Получить информацию об обработке ваших персональных данных</li>
            <li>Потребовать уточнения, блокировки или уничтожения ваших данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
          </ul>
          <p>Для реализации прав обратитесь по адресу: <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener">ooo-dsr@bk.ru</a></p>

          <h2>8. Контакты оператора</h2>
          <p>
            ООО «Дальневосточные Системы Развития» (ДСР)<br/>
            Адрес: г. Владивосток, ул. Русская, д. 17, каб. 704<br/>
            Телефон: <a href="tel:+79143292929">+7 914 329-29-29</a><br/>
            Email: <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener">ooo-dsr@bk.ru</a>
          </p>

          <h2>9. Изменения в Политике</h2>
          <p>Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда доступна на данной странице.</p>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__name">ДСР — Дальневосточные Системы Развития</p>
        <p class="footer__copy">© {{ new Date().getFullYear() }} ДСР. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
useHead({ title: 'Политика конфиденциальности — ДСР' })
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
.privacy__content ul { color: #a0a0a0; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.privacy__content li { line-height: 1.8; font-size: 0.95rem; }
.privacy__content a { color: #e6b800; text-decoration: none; }
.privacy__content a:hover { text-decoration: underline; }
.footer { padding: 2rem 1.5rem; background: #080808; border-top: 1px solid #1e1e1e; text-align: center; }
.footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.4rem; }
.footer__name { color: #e6b800; font-weight: 600; font-size: 0.9rem; }
.footer__copy { color: #333; font-size: 0.8rem; }
</style>
