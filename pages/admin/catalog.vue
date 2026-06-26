<template>
  <div>
    <div class="cms__header">
      <h1 class="cms__title">Каталог</h1>
      <div class="cms__hint">Изменения сохраняются в Supabase и применяются поверх catalog.js</div>
    </div>

    <!-- Search + filter -->
    <div class="cms__controls">
      <input v-model="search" class="cms__search" placeholder="Поиск по названию..." />
      <select v-model="catFilter" class="cms__cat-filter">
        <option value="">Все категории</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="cms__wrap">
      <div v-if="loading" class="cms__loading">Загрузка...</div>
      <table v-else class="cms__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Категория</th>
            <th>Название</th>
            <th>Фото</th>
            <th>CMS</th>
            <th>Скрыт</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginated" :key="item.id" :class="{ 'cms__row--hidden': item.is_hidden, 'cms__row--cms': item._cms }">
            <td class="cms__id">{{ item.id }}</td>
            <td class="cms__cat">{{ catLabel(item.category) }}</td>
            <td class="cms__name">{{ item.title }}</td>
            <td class="cms__photo-cell">
              <img v-if="item.photo || (item.photos && item.photos[0])" :src="item.photo || item.photos[0]" class="cms__thumb" loading="lazy" />
              <span v-else class="cms__no-photo">—</span>
            </td>
            <td class="cms__cms-cell">
              <span v-if="item._cms" class="cms__badge-cms">●</span>
            </td>
            <td class="cms__hidden-cell">
              <button
                class="cms__toggle"
                :class="{ 'cms__toggle--hidden': item.is_hidden }"
                @click="toggleHidden(item)"
                :title="item.is_hidden ? 'Показать' : 'Скрыть'"
              >{{ item.is_hidden ? '🙈' : '👁' }}</button>
            </td>
            <td class="cms__edit-cell">
              <button class="cms__edit-btn" @click="openEdit(item)">Ред.</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div class="cms__pagination" v-if="totalPages > 1">
        <button :disabled="page <= 1" @click="page--" class="cms__page-btn">←</button>
        <span class="cms__page-info">{{ page }} / {{ totalPages }}</span>
        <button :disabled="page >= totalPages" @click="page++" class="cms__page-btn">→</button>
      </div>
    </div>

    <!-- Edit modal -->
    <div v-if="editItem" class="cms__modal-bg" @click.self="editItem = null">
      <div class="cms__modal">
        <h2 class="cms__modal-title">Редактировать #{{ editItem.id }}</h2>
        <div class="cms__fields">
          <label class="cms__label">Название
            <input v-model="editForm.title" class="cms__input" />
          </label>
          <label class="cms__label">Описание
            <textarea v-model="editForm.description" class="cms__input cms__textarea" rows="3" />
          </label>
          <label class="cms__label">URL фото
            <input v-model="editForm.photo" class="cms__input" placeholder="/catalog/products/1.jpg" />
          </label>
          <label class="cms__label">Единица
            <input v-model="editForm.unit" class="cms__input" style="width:80px" />
          </label>
          <label class="cms__label cms__label--check">
            <input type="checkbox" v-model="editForm.is_hidden" />
            Скрыть товар
          </label>
        </div>
        <div v-if="editError" class="cms__modal-error">{{ editError }}</div>
        <div class="cms__modal-actions">
          <button class="cms__save" @click="saveEdit" :disabled="saving">{{ saving ? 'Сохранение...' : 'Сохранить' }}</button>
          <button class="cms__cancel" @click="editItem = null">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const loading = ref(true)
const items = ref([])
const categories = ref([])
const search = ref('')
const catFilter = ref('')
const page = ref(1)
const PER_PAGE = 40

const editItem = ref(null)
const editForm = ref({})
const saving = ref(false)
const editError = ref('')

const catMap = computed(() => Object.fromEntries(categories.value.map(c => [c.id, c.label])))
function catLabel(id) { return catMap.value[id] || id }

const filteredItems = computed(() => {
  let list = items.value
  if (catFilter.value) list = list.filter(i => i.category === catFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(i => i.title.toLowerCase().includes(q))
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / PER_PAGE))
const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return filteredItems.value.slice(start, start + PER_PAGE)
})

watch([search, catFilter], () => { page.value = 1 })

async function load() {
  loading.value = true
  try {
    const data = await $fetch('/api/admin/items')
    items.value = data.items || []
    categories.value = (data.categories || []).filter(c => c.id !== 'all')
  } catch {}
  loading.value = false
}

function openEdit(item) {
  editItem.value = item
  editForm.value = {
    title: item.title,
    description: item.description || '',
    photo: item.photo || '',
    unit: item.unit || 'шт',
    is_hidden: !!item.is_hidden,
  }
  editError.value = ''
}

async function saveEdit() {
  saving.value = true
  editError.value = ''
  try {
    await $fetch(`/api/admin/items/${editItem.value.id}`, {
      method: 'PATCH',
      body: { ...editForm.value, category: editItem.value.category, sub: editItem.value.sub },
    })
    // Update local state
    const idx = items.value.findIndex(i => i.id === editItem.value.id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...editForm.value, _cms: true }
    editItem.value = null
  } catch (e) {
    editError.value = e?.data?.message || 'Ошибка сохранения'
  }
  saving.value = false
}

async function toggleHidden(item) {
  const newVal = !item.is_hidden
  item.is_hidden = newVal
  item._cms = true
  try {
    await $fetch(`/api/admin/items/${item.id}`, {
      method: 'PATCH',
      body: { ...item, is_hidden: newVal },
    })
  } catch { item.is_hidden = !newVal }
}

onMounted(load)
</script>

<style scoped>
.cms__header { margin-bottom: 1.5rem; }
.cms__title { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0 0 0.35rem; }
.cms__hint { font-size: 0.78rem; color: #555; }

.cms__controls {
  display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;
}
.cms__search, .cms__cat-filter {
  background: #161616; border: 1px solid #2a2a2a; color: #ddd;
  padding: 0.55rem 0.9rem; border-radius: 10px; font-size: 0.85rem;
  font-family: inherit; outline: none; transition: border-color 0.15s;
}
.cms__search { flex: 1; min-width: 180px; }
.cms__search:focus, .cms__cat-filter:focus { border-color: #e6b800; }
.cms__cat-filter { min-width: 180px; }

.cms__wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #222; }
.cms__loading { padding: 3rem; text-align: center; color: #555; }

.cms__table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.cms__table thead tr { border-bottom: 1px solid #222; }
.cms__table th {
  padding: 0.7rem 0.9rem; text-align: left; color: #555;
  font-weight: 600; white-space: nowrap; background: #161616;
}
.cms__table tbody tr { border-bottom: 1px solid #1a1a1a; transition: background 0.1s; }
.cms__table tbody tr:hover { background: #1a1a1a; }
.cms__table td { padding: 0.55rem 0.9rem; vertical-align: middle; }

.cms__row--hidden { opacity: 0.4; }
.cms__row--cms td:nth-child(3) { color: #e6b800; }

.cms__id { color: #444; font-size: 0.75rem; }
.cms__cat { color: #666; font-size: 0.78rem; white-space: nowrap; }
.cms__name { color: #ddd; max-width: 280px; }
.cms__thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; }
.cms__no-photo { color: #333; }
.cms__badge-cms { color: #e6b800; font-size: 0.7rem; }

.cms__toggle {
  background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0;
  transition: opacity 0.2s;
}
.cms__toggle--hidden { opacity: 0.4; }

.cms__edit-btn {
  background: #1e1e1e; border: 1px solid #333; color: #888;
  padding: 0.3rem 0.65rem; border-radius: 6px; cursor: pointer;
  font-size: 0.75rem; font-family: inherit; transition: all 0.15s;
}
.cms__edit-btn:hover { color: #fff; border-color: #555; }

.cms__pagination {
  display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem;
  border-top: 1px solid #1a1a1a; justify-content: center;
}
.cms__page-btn {
  background: #1e1e1e; border: 1px solid #333; color: #aaa;
  padding: 0.3rem 0.75rem; border-radius: 6px; cursor: pointer;
  font-family: inherit; transition: all 0.15s;
}
.cms__page-btn:hover:not(:disabled) { color: #fff; border-color: #555; }
.cms__page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.cms__page-info { color: #666; font-size: 0.82rem; }

/* Modal */
.cms__modal-bg {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.cms__modal {
  background: #161616; border: 1px solid #2a2a2a; border-radius: 16px;
  padding: 2rem; width: 100%; max-width: 500px;
}
.cms__modal-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0 0 1.5rem; }
.cms__fields { display: flex; flex-direction: column; gap: 0.9rem; margin-bottom: 1.25rem; }
.cms__label {
  display: flex; flex-direction: column; gap: 0.35rem;
  font-size: 0.8rem; color: #888;
}
.cms__label--check { flex-direction: row; align-items: center; gap: 0.5rem; }
.cms__input {
  background: #0f0f0f; border: 1px solid #333; color: #ddd;
  padding: 0.6rem 0.85rem; border-radius: 8px; font-size: 0.88rem;
  font-family: inherit; outline: none; transition: border-color 0.15s;
}
.cms__input:focus { border-color: #e6b800; }
.cms__textarea { resize: vertical; }
.cms__modal-error { color: #ff6b6b; font-size: 0.8rem; margin-bottom: 0.75rem; }
.cms__modal-actions { display: flex; gap: 0.75rem; }
.cms__save {
  background: #e6b800; color: #000; border: none;
  padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 700;
  font-family: inherit; cursor: pointer; font-size: 0.88rem;
  transition: opacity 0.2s;
}
.cms__save:disabled { opacity: 0.5; cursor: not-allowed; }
.cms__cancel {
  background: #1e1e1e; border: 1px solid #333; color: #888;
  padding: 0.6rem 1.25rem; border-radius: 8px;
  font-family: inherit; cursor: pointer; font-size: 0.88rem;
  transition: all 0.15s;
}
.cms__cancel:hover { color: #fff; border-color: #555; }
</style>