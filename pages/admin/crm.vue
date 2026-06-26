<template>
  <div>
    <div class="crm__header">
      <h1 class="crm__title">Заявки</h1>
      <button class="crm__refresh" @click="loadLeads" :disabled="loading">↻ Обновить</button>
    </div>

    <!-- Stats -->
    <div class="crm__stats">
      <div class="crm__stat" v-for="s in stats" :key="s.key" :class="'crm__stat--' + s.key" @click="activeFilter = s.key">
        <div class="crm__stat-num">{{ s.count }}</div>
        <div class="crm__stat-lbl">{{ s.label }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="crm__filters">
      <button
        v-for="f in filters"
        :key="f.key"
        class="crm__filter"
        :class="{ 'crm__filter--active': activeFilter === f.key }"
        @click="activeFilter = f.key"
      >{{ f.label }}</button>
    </div>

    <!-- Table -->
    <div class="crm__wrap">
      <div v-if="loading" class="crm__loading">Загрузка...</div>
      <div v-else-if="!filtered.length" class="crm__empty">Заявок нет</div>
      <table v-else class="crm__table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Товар / Комментарий</th>
            <th>Статус</th>
            <th>Заметка</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in filtered" :key="lead.id" :class="'crm__row--' + (lead.status || 'new')">
            <td class="crm__date">{{ fmtDate(lead.created_at) }}</td>
            <td class="crm__name">{{ lead.name }}</td>
            <td class="crm__phone"><a :href="'tel:' + lead.phone">{{ lead.phone }}</a></td>
            <td class="crm__msg">
              <div v-if="lead.item_title" class="crm__item-title">{{ lead.item_title }}</div>
              <div class="crm__comment">{{ lead.message }}</div>
            </td>
            <td class="crm__status-cell">
              <select
                class="crm__status"
                :value="lead.status || 'new'"
                :class="'crm__status--' + (lead.status || 'new')"
                @change="updateStatus(lead, $event.target.value)"
              >
                <option value="new">Новая</option>
                <option value="in_work">В работе</option>
                <option value="done">Закрыта</option>
                <option value="spam">Спам</option>
              </select>
            </td>
            <td class="crm__notes-cell">
              <input
                class="crm__notes"
                type="text"
                :value="lead.notes || ''"
                placeholder="Добавить заметку..."
                @blur="updateNotes(lead, $event.target.value)"
                @keydown.enter="$event.target.blur()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const loading = ref(true)
const leads = ref([])
const activeFilter = ref('all')

const filters = [
  { key: 'all',     label: 'Все' },
  { key: 'new',     label: 'Новые' },
  { key: 'in_work', label: 'В работе' },
  { key: 'done',    label: 'Закрытые' },
  { key: 'spam',    label: 'Спам' },
]

const stats = computed(() => [
  { key: 'all',     label: 'Всего',    count: leads.value.length },
  { key: 'new',     label: 'Новые',    count: leads.value.filter(l => !l.status || l.status === 'new').length },
  { key: 'in_work', label: 'В работе', count: leads.value.filter(l => l.status === 'in_work').length },
  { key: 'done',    label: 'Закрыты',  count: leads.value.filter(l => l.status === 'done').length },
])

const filtered = computed(() => {
  if (activeFilter.value === 'all') return leads.value
  if (activeFilter.value === 'new') return leads.value.filter(l => !l.status || l.status === 'new')
  return leads.value.filter(l => l.status === activeFilter.value)
})

async function loadLeads() {
  loading.value = true
  try {
    leads.value = await $fetch('/api/admin/leads')
  } catch {}
  loading.value = false
}

async function updateStatus(lead, status) {
  lead.status = status
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { status } })
  } catch {}
}

async function updateNotes(lead, notes) {
  if (notes === (lead.notes || '')) return
  lead.notes = notes
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { notes } })
  } catch {}
}

function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
    + ' ' + dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

onMounted(loadLeads)
</script>

<style scoped>
.crm__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.crm__title { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.crm__refresh {
  background: #1e1e1e; border: 1px solid #333; color: #aaa;
  padding: 0.4rem 0.9rem; border-radius: 8px; cursor: pointer;
  font-size: 0.82rem; font-family: inherit; transition: all 0.15s;
}
.crm__refresh:hover { color: #fff; border-color: #555; }
.crm__refresh:disabled { opacity: 0.4; cursor: not-allowed; }

.crm__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.crm__stat {
  background: #161616;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: border-color 0.15s;
}
.crm__stat:hover { border-color: #444; }
.crm__stat-num { font-size: 1.75rem; font-weight: 700; color: #fff; }
.crm__stat-lbl { font-size: 0.78rem; color: #666; margin-top: 0.2rem; }
.crm__stat--new .crm__stat-num { color: #e6b800; }
.crm__stat--in_work .crm__stat-num { color: #4da6ff; }
.crm__stat--done .crm__stat-num { color: #4caf50; }

.crm__filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.crm__filter {
  background: #161616;
  border: 1px solid #2a2a2a;
  color: #888;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.82rem;
  font-family: inherit;
  transition: all 0.15s;
}
.crm__filter:hover { color: #fff; border-color: #444; }
.crm__filter--active { background: #e6b800; border-color: #e6b800; color: #000; font-weight: 600; }

.crm__wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #222; }
.crm__loading, .crm__empty { padding: 3rem; text-align: center; color: #555; }

.crm__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.83rem;
}
.crm__table thead tr { border-bottom: 1px solid #222; }
.crm__table th {
  padding: 0.75rem 1rem;
  text-align: left;
  color: #555;
  font-weight: 600;
  white-space: nowrap;
  background: #161616;
}
.crm__table tbody tr { border-bottom: 1px solid #1a1a1a; transition: background 0.1s; }
.crm__table tbody tr:hover { background: #1a1a1a; }
.crm__table td { padding: 0.7rem 1rem; vertical-align: top; }

.crm__row--done { opacity: 0.5; }
.crm__row--spam { opacity: 0.35; }

.crm__date { color: #555; white-space: nowrap; font-size: 0.75rem; }
.crm__name { color: #ddd; font-weight: 600; white-space: nowrap; }
.crm__phone a { color: #e6b800; text-decoration: none; white-space: nowrap; }
.crm__phone a:hover { text-decoration: underline; }
.crm__item-title { color: #aaa; font-size: 0.78rem; margin-bottom: 0.25rem; }
.crm__comment { color: #666; font-size: 0.78rem; max-width: 260px; }

.crm__status {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #ddd;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
}
.crm__status--new { border-color: #e6b800; color: #e6b800; }
.crm__status--in_work { border-color: #4da6ff; color: #4da6ff; }
.crm__status--done { border-color: #4caf50; color: #4caf50; }
.crm__status--spam { border-color: #555; color: #555; }

.crm__notes {
  background: transparent;
  border: 1px solid transparent;
  color: #888;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-family: inherit;
  width: 160px;
  outline: none;
  transition: border-color 0.15s;
}
.crm__notes:hover { border-color: #333; }
.crm__notes:focus { border-color: #555; color: #ddd; background: #1a1a1a; }

@media (max-width: 768px) {
  .crm__stats { grid-template-columns: repeat(2, 1fr); }
}
</style>