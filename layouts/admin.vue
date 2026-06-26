<template>
  <div class="adm">
    <aside class="adm__side">
      <div class="adm__brand">
        <span class="adm__brand-icon">⚙</span>
        <span class="adm__brand-txt">ДСР Admin</span>
      </div>
      <nav class="adm__nav">
        <NuxtLink to="/admin/crm" class="adm__link" active-class="adm__link--active">
          <span class="adm__link-icon">📋</span> Заявки
          <span v-if="newCount" class="adm__badge">{{ newCount }}</span>
        </NuxtLink>
        <NuxtLink to="/admin/catalog" class="adm__link" active-class="adm__link--active">
          <span class="adm__link-icon">📦</span> Каталог
        </NuxtLink>
      </nav>
      <div class="adm__bottom">
        <a href="/" target="_blank" class="adm__site-link">→ Открыть сайт</a>
        <button class="adm__logout" @click="logout">Выйти</button>
      </div>
    </aside>
    <main class="adm__main">
      <slot />
    </main>
  </div>
</template>

<script setup>
const newCount = ref(0)

onMounted(async () => {
  // Check auth
  try {
    await $fetch('/api/admin/me')
  } catch {
    await navigateTo('/admin')
    return
  }
  // Badge count
  try {
    const leads = await $fetch('/api/admin/leads?status=new')
    newCount.value = leads.length
  } catch {}
})

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin')
}
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; }
</style>

<style scoped>
.adm {
  display: flex;
  min-height: 100vh;
  background: #0f0f0f;
  color: #e0e0e0;
  font-family: 'Montserrat', sans-serif;
}

.adm__side {
  width: 220px;
  flex-shrink: 0;
  background: #161616;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 10;
}

.adm__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.25rem 1.25rem;
  border-bottom: 1px solid #222;
  font-weight: 700;
  font-size: 1rem;
  color: #e6b800;
}
.adm__brand-icon { font-size: 1.2rem; }

.adm__nav {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.adm__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.25rem;
  color: #aaa;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.15s;
}
.adm__link:hover { color: #fff; background: #1e1e1e; }
.adm__link--active { color: #e6b800; border-left-color: #e6b800; background: #1e1e1e; }
.adm__link-icon { font-size: 1rem; }

.adm__badge {
  margin-left: auto;
  background: #e6b800;
  color: #000;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}

.adm__bottom {
  padding: 1rem 1.25rem;
  border-top: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.adm__site-link {
  color: #555;
  font-size: 0.78rem;
  text-decoration: none;
  transition: color 0.15s;
}
.adm__site-link:hover { color: #aaa; }
.adm__logout {
  background: #1e1e1e;
  border: 1px solid #333;
  color: #888;
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: inherit;
  transition: all 0.15s;
  text-align: left;
}
.adm__logout:hover { color: #fff; border-color: #555; }

.adm__main {
  flex: 1;
  margin-left: 220px;
  padding: 2rem;
  min-height: 100vh;
}

@media (max-width: 640px) {
  .adm__side { width: 100%; position: static; border-right: none; border-bottom: 1px solid #222; flex-direction: row; padding: 0.75rem 1rem; flex-shrink: 0; }
  .adm { flex-direction: column; }
  .adm__main { margin-left: 0; padding: 1rem; }
  .adm__brand { border-bottom: none; padding-bottom: 0; }
  .adm__nav { flex-direction: row; padding: 0; gap: 0; border-left: none; }
  .adm__link { padding: 0.5rem 0.75rem; border-left: none; border-bottom: 3px solid transparent; }
  .adm__link--active { border-left-color: transparent; border-bottom-color: #e6b800; }
  .adm__bottom { display: none; }
}
</style>