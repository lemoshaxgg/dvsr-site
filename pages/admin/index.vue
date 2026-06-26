<template>
  <div class="login">
    <div class="login__card">
      <div class="login__logo">⚙ ДСР Admin</div>
      <h1 class="login__title">Вход в панель</h1>
      <form class="login__form" @submit.prevent="submit">
        <input
          v-model="password"
          type="password"
          class="login__input"
          placeholder="Пароль"
          autocomplete="current-password"
          :disabled="loading"
          autofocus
        />
        <p v-if="error" class="login__error">{{ error }}</p>
        <button class="login__btn" type="submit" :disabled="loading || !password">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const password = ref('')
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    await $fetch('/api/admin/me')
    await navigateTo('/admin/crm')
  } catch {}
})

async function submit() {
  if (!password.value) return
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/auth', { method: 'POST', body: { password: password.value } })
    await navigateTo('/admin/crm')
  } catch (e) {
    error.value = e?.data?.message || 'Неверный пароль'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  padding: 1rem;
}
.login__card {
  background: #161616;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
}
.login__logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e6b800;
  margin-bottom: 1.5rem;
}
.login__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1.5rem;
}
.login__form { display: flex; flex-direction: column; gap: 0.75rem; }
.login__input {
  background: #0f0f0f;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.login__input:focus { border-color: #e6b800; }
.login__error { color: #ff6b6b; font-size: 0.82rem; margin: 0; }
.login__btn {
  background: #e6b800;
  color: #000;
  border: none;
  border-radius: 10px;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
}
.login__btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>