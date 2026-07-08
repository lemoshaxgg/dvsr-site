<template>
  <div>
    <div class="us__header">
      <h1 class="us__title">Сотрудники</h1>
      <button class="us__add" @click="openCreate">+ Добавить сотрудника</button>
    </div>
    <p class="us__hint">У каждого свой логин и пароль. Снимите «Работает», чтобы мгновенно закрыть доступ уволенному.</p>

    <div class="us__wrap">
      <div v-if="loading" class="us__loading">Загрузка...</div>
      <table v-else class="us__table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Работает</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" :class="{ 'us__row--off': !u.is_active }">
            <td class="us__login">{{ u.login }}</td>
            <td>{{ u.name }}</td>
            <td>
              <span class="us__role" :class="u.role === 'admin' ? 'us__role--admin' : ''">
                {{ u.role === 'admin' ? 'Владелец' : 'Менеджер' }}
              </span>
            </td>
            <td>
              <button
                class="us__toggle"
                :class="{ 'us__toggle--on': u.is_active }"
                :disabled="u.id === meId"
                :title="u.id === meId ? 'Свой аккаунт' : (u.is_active ? 'Отключить доступ' : 'Включить доступ')"
                @click="toggleActive(u)"
              >{{ u.is_active ? '✅ Да' : '🚫 Нет' }}</button>
            </td>
            <td class="us__actions">
              <button class="us__btn" @click="openPassword(u)">Пароль</button>
              <button v-if="u.id !== meId" class="us__btn us__btn--del" @click="removeUser(u)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create modal -->
    <div v-if="showCreate" class="us__modal-bg" @click.self="showCreate = false">
      <div class="us__modal">
        <h2 class="us__modal-title">Новый сотрудник</h2>
        <div class="us__fields">
          <label class="us__label">Логин (латиница)
            <input v-model="form.login" class="us__input" placeholder="ivan" />
          </label>
          <label class="us__label">Имя
            <input v-model="form.name" class="us__input" placeholder="Иван Петров" />
          </label>
          <label class="us__label">Пароль
            <input v-model="form.password" class="us__input" placeholder="минимум 6 символов" />
          </label>
          <label class="us__label">Роль
            <select v-model="form.role" class="us__input">
              <option value="manager">Менеджер (только заявки)</option>
              <option value="admin">Владелец (полный доступ)</option>
            </select>
          </label>
        </div>
        <div v-if="formError" class="us__error">{{ formError }}</div>
        <div class="us__modal-actions">
          <button class="us__save" @click="createUser" :disabled="saving">{{ saving ? 'Сохранение...' : 'Создать' }}</button>
          <button class="us__cancel" @click="showCreate = false">Отмена</button>
        </div>
      </div>
    </div>

    <!-- Password modal -->
    <div v-if="pwUser" class="us__modal-bg" @click.self="pwUser = null">
      <div class="us__modal">
        <h2 class="us__modal-title">Новый пароль для {{ pwUser.login }}</h2>
        <div class="us__fields">
          <label class="us__label">Пароль
            <input v-model="pwValue" class="us__input" placeholder="минимум 6 символов" />
          </label>
        </div>
        <div v-if="formError" class="us__error">{{ formError }}</div>
        <div class="us__modal-actions">
          <button class="us__save" @click="savePassword" :disabled="saving">{{ saving ? 'Сохранение...' : 'Сменить пароль' }}</button>
          <button class="us__cancel" @click="pwUser = null">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const loading = ref(true)
const users = ref([])
const meId = ref(0)
const saving = ref(false)
const formError = ref('')

const showCreate = ref(false)
const form = ref({ login: '', name: '', password: '', role: 'manager' })

const pwUser = ref(null)
const pwValue = ref('')

async function load() {
  loading.value = true
  try {
    const me = await $fetch('/api/admin/me')
    // Страница доступна только владельцу — менеджера уводим на заявки
    if (me.role !== 'admin') {
      await navigateTo('/admin/crm')
      return
    }
    meId.value = me.id
    users.value = await $fetch('/api/admin/users')
  } catch {}
  loading.value = false
}

function openCreate() {
  form.value = { login: '', name: '', password: '', role: 'manager' }
  formError.value = ''
  showCreate.value = true
}

async function createUser() {
  saving.value = true
  formError.value = ''
  try {
    await $fetch('/api/admin/users', { method: 'POST', body: { ...form.value } })
    showCreate.value = false
    await load()
  } catch (e) {
    formError.value = e?.data?.message || 'Ошибка создания'
  }
  saving.value = false
}

async function toggleActive(u) {
  const newVal = !u.is_active
  u.is_active = newVal
  try {
    await $fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { is_active: newVal } })
  } catch (e) {
    u.is_active = !newVal
    alert(e?.data?.message || 'Ошибка')
  }
}

function openPassword(u) {
  pwUser.value = u
  pwValue.value = ''
  formError.value = ''
}

async function savePassword() {
  saving.value = true
  formError.value = ''
  try {
    await $fetch(`/api/admin/users/${pwUser.value.id}`, { method: 'PATCH', body: { password: pwValue.value } })
    pwUser.value = null
  } catch (e) {
    formError.value = e?.data?.message || 'Ошибка'
  }
  saving.value = false
}

async function removeUser(u) {
  if (!confirm(`Удалить сотрудника ${u.login}?`)) return
  try {
    await $fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    await load()
  } catch (e) {
    alert(e?.data?.message || 'Ошибка удаления')
  }
}

onMounted(load)
</script>

<style scoped>
.us__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.us__title { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.us__hint { font-size: 0.8rem; color: #666; margin: 0 0 1.5rem; }
.us__add {
  background: #e6b800; color: #000; border: none; padding: 0.55rem 1rem;
  border-radius: 8px; font-weight: 700; font-family: inherit; cursor: pointer; font-size: 0.85rem;
}

.us__wrap { border-radius: 12px; border: 1px solid #222; overflow-x: auto; }
.us__loading { padding: 3rem; text-align: center; color: #555; }
.us__table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
.us__table thead tr { border-bottom: 1px solid #222; }
.us__table th { padding: 0.7rem 0.9rem; text-align: left; color: #555; font-weight: 600; background: #161616; white-space: nowrap; }
.us__table tbody tr { border-bottom: 1px solid #1a1a1a; }
.us__table tbody tr:hover { background: #1a1a1a; }
.us__table td { padding: 0.6rem 0.9rem; color: #ddd; vertical-align: middle; }
.us__row--off { opacity: 0.45; }
.us__login { font-weight: 600; color: #fff; }

.us__role { font-size: 0.78rem; color: #888; }
.us__role--admin { color: #e6b800; font-weight: 600; }

.us__toggle {
  background: #1e1e1e; border: 1px solid #333; color: #888;
  padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-family: inherit;
}
.us__toggle--on { color: #7dd977; border-color: #2f5a2f; }
.us__toggle:disabled { opacity: 0.4; cursor: not-allowed; }

.us__actions { display: flex; gap: 0.4rem; }
.us__btn {
  background: #1e1e1e; border: 1px solid #333; color: #999;
  padding: 0.3rem 0.65rem; border-radius: 6px; cursor: pointer; font-size: 0.76rem; font-family: inherit;
}
.us__btn:hover { color: #fff; border-color: #555; }
.us__btn--del:hover { color: #ff6b6b; border-color: #5a2f2f; }

.us__modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.us__modal { background: #161616; border: 1px solid #2a2a2a; border-radius: 16px; padding: 2rem; width: 100%; max-width: 440px; }
.us__modal-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0 0 1.5rem; }
.us__fields { display: flex; flex-direction: column; gap: 0.9rem; margin-bottom: 1.25rem; }
.us__label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.8rem; color: #888; }
.us__input { background: #0f0f0f; border: 1px solid #333; color: #ddd; padding: 0.6rem 0.85rem; border-radius: 8px; font-size: 0.88rem; font-family: inherit; outline: none; }
.us__input:focus { border-color: #e6b800; }
.us__error { color: #ff6b6b; font-size: 0.8rem; margin-bottom: 0.75rem; }
.us__modal-actions { display: flex; gap: 0.75rem; }
.us__save { background: #e6b800; color: #000; border: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 700; font-family: inherit; cursor: pointer; font-size: 0.88rem; }
.us__save:disabled { opacity: 0.5; cursor: not-allowed; }
.us__cancel { background: #1e1e1e; border: 1px solid #333; color: #888; padding: 0.6rem 1.25rem; border-radius: 8px; font-family: inherit; cursor: pointer; font-size: 0.88rem; }
.us__cancel:hover { color: #fff; border-color: #555; }
</style>