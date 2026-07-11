<template>
  <div>
    <div class="crm__header">
      <h1 class="crm__title">Сделки</h1>
      <div class="crm__view-switch">
        <button :class="{ on: view === 'board' }" @click="view = 'board'">▦ Воронка</button>
        <button :class="{ on: view === 'list' }" @click="view = 'list'">☰ Список</button>
      </div>
      <div class="crm__header-actions">
        <span v-if="mailMsg" class="crm__mail-msg">{{ mailMsg }}</span>
        <button class="crm__refresh crm__refresh--mail" @click="checkMail" :disabled="checkingMail" title="Прочитать входящие письма и завести заявки">
          {{ checkingMail ? '⏳ Проверяю…' : '✉ Проверить почту' }}
        </button>
        <button class="crm__refresh" @click="loadLeads" :disabled="loading">↻ Обновить</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="crm__stats">
      <div class="crm__stat" @click="view = 'list'; activeFilter = 'all'">
        <div class="crm__stat-num">{{ leads.length }}</div>
        <div class="crm__stat-lbl">Всего сделок</div>
      </div>
      <div class="crm__stat" @click="view = 'board'">
        <div class="crm__stat-num" style="color:#e6b800">{{ countStage('new') }}</div>
        <div class="crm__stat-lbl">Новые</div>
      </div>
      <div class="crm__stat" @click="view = 'board'">
        <div class="crm__stat-num" style="color:#4da6ff">{{ countStage('contacted') + countStage('invoice') + countStage('payment') }}</div>
        <div class="crm__stat-lbl">В работе</div>
      </div>
      <div class="crm__stat" @click="view = 'board'">
        <div class="crm__stat-num" style="color:#4caf50">{{ countStage('won') }}</div>
        <div class="crm__stat-lbl">Успешно</div>
      </div>
    </div>

    <!-- ВОРОНКА (канбан) -->
    <div v-if="view === 'board'" class="crm__board">
      <div v-if="loading" class="crm__loading">Загрузка...</div>
      <div v-else class="crm__cols">
        <div
          v-for="st in STAGES"
          :key="st.key"
          class="crm__col"
          :class="{ 'crm__col--over': dragOver === st.key }"
          @dragover.prevent="dragOver = st.key"
          @dragleave="dragOver === st.key && (dragOver = null)"
          @drop="onDrop(st.key)"
        >
          <div class="crm__col-head" :style="{ '--c': st.color }">
            <span class="crm__col-dot"></span>
            <span class="crm__col-name">{{ st.label }}</span>
            <span class="crm__col-count">{{ byStage(st.key).length }}</span>
          </div>
          <div class="crm__col-body">
            <div
              v-for="lead in byStage(st.key)"
              :key="lead.id"
              class="crm__card"
              draggable="true"
              @dragstart="dragId = lead.id"
              @dragend="dragId = null; dragOver = null"
              @click="openDeal(lead)"
            >
              <div class="crm__card-top">
                <span class="crm__card-name">{{ lead.name || 'Без имени' }}</span>
                <span v-if="lead.source === 'email'" class="crm__card-src" title="Из письма">✉</span>
              </div>
              <div v-if="lead.item_title" class="crm__card-item">{{ lead.item_title }}</div>
              <div v-if="lead.message" class="crm__card-msg">{{ lead.message }}</div>
              <div class="crm__card-foot">
                <a v-if="lead.phone && lead.phone !== '—'" class="crm__card-phone" :href="'tel:' + lead.phone" @click.stop>{{ lead.phone }}</a>
                <span class="crm__card-date">{{ fmtDate(lead.created_at) }}</span>
              </div>
            </div>
            <div v-if="!byStage(st.key).length" class="crm__col-empty">—</div>
          </div>
        </div>
      </div>
    </div>

    <!-- СПИСОК -->
    <div v-else>
      <div class="crm__filters">
        <button v-for="f in listFilters" :key="f.key" class="crm__filter"
          :class="{ 'crm__filter--active': activeFilter === f.key }" @click="activeFilter = f.key">{{ f.label }}</button>
      </div>
      <div class="crm__wrap">
        <div v-if="loading" class="crm__loading">Загрузка...</div>
        <div v-else-if="!filtered.length" class="crm__empty">Сделок нет</div>
        <table v-else class="crm__table">
          <thead>
            <tr><th>Дата</th><th>Имя</th><th>Телефон</th><th>Товар / Комментарий</th><th>Этап</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="lead in filtered" :key="lead.id" :class="{ 'crm__row--muted': stageOf(lead) === 'won' || stageOf(lead) === 'lost' }">
              <td class="crm__date">{{ fmtDate(lead.created_at) }}</td>
              <td class="crm__name crm__link" @click="openDeal(lead)">{{ lead.name }} <span v-if="lead.source === 'email'" title="Из письма">✉</span></td>
              <td class="crm__phone"><a :href="'tel:' + lead.phone">{{ lead.phone }}</a></td>
              <td class="crm__msg crm__link" @click="openDeal(lead)">
                <div v-if="lead.item_title" class="crm__item-title">{{ lead.item_title }}</div>
                <div class="crm__comment">{{ lead.message }}</div>
              </td>
              <td class="crm__status-cell">
                <select class="crm__status" :value="stageOf(lead)" :style="{ borderColor: stageMeta(stageOf(lead)).color, color: stageMeta(stageOf(lead)).color }"
                  @change="setStage(lead, $event.target.value)">
                  <option v-for="st in STAGES" :key="st.key" :value="st.key">{{ st.label }}</option>
                </select>
              </td>
              <td class="crm__del-cell">
                <button v-if="isAdmin" class="crm__del" title="Удалить сделку" @click="deleteLead(lead)">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- КАРТОЧКА СДЕЛКИ (drawer) -->
    <transition name="deal">
      <div v-if="openLead" class="deal-overlay" @click.self="closeDeal">
        <div class="deal">
          <div class="deal__head">
            <div>
              <div class="deal__name">{{ openLead.name || 'Без имени' }}</div>
              <div class="deal__sub">
                <span v-if="openLead.source === 'email'">✉ из письма</span>
                <span v-else>🌐 с сайта</span>
                · {{ fmtDate(openLead.created_at) }}
              </div>
            </div>
            <button class="deal__close" @click="closeDeal">✕</button>
          </div>

          <!-- Этапы -->
          <div class="deal__stages">
            <button v-for="st in STAGES" :key="st.key" class="deal__stage"
              :class="{ on: stageOf(openLead) === st.key }"
              :style="stageOf(openLead) === st.key ? { background: st.color, borderColor: st.color, color: '#0a0a0a' } : {}"
              @click="setStage(openLead, st.key)">{{ st.label }}</button>
          </div>

          <div class="deal__body">
            <!-- Контакты -->
            <div class="deal__info">
              <div v-if="openLead.phone && openLead.phone !== '—'" class="deal__row"><span>Телефон</span><a :href="'tel:' + openLead.phone">{{ openLead.phone }}</a></div>
              <div v-if="openLead.email" class="deal__row"><span>Email</span><a :href="mailLink(openLead.email)" target="_blank">{{ openLead.email }}</a></div>
              <div v-if="openLead.item_title" class="deal__row"><span>Товар</span><b>{{ openLead.item_title }}</b></div>
              <div v-if="openLead.item_price" class="deal__row"><span>Цена</span><b>{{ openLead.item_price }}</b></div>
            </div>

            <!-- Обращение -->
            <div v-if="openLead.message" class="deal__request">
              <div class="deal__label">Обращение клиента</div>
              <p>{{ openLead.message }}</p>
            </div>

            <!-- Быстрая заметка (поле) -->
            <div class="deal__quicknote">
              <div class="deal__label">Пометка (закреплена)</div>
              <input :value="openLead.notes || ''" placeholder="Короткая пометка к сделке…"
                @blur="updateNotes(openLead, $event.target.value)" @keydown.enter="$event.target.blur()" />
            </div>

            <!-- История -->
            <div class="deal__label">История</div>
            <div class="deal__timeline">
              <div class="deal__ev deal__ev--created">
                <span class="deal__ev-dot"></span>
                <div class="deal__ev-body">
                  <div class="deal__ev-text">Сделка создана ({{ openLead.source === 'email' ? 'письмо' : 'сайт' }})</div>
                  <div class="deal__ev-meta">{{ fmtDateFull(openLead.created_at) }}</div>
                </div>
              </div>
              <div v-for="ev in events" :key="ev.id" class="deal__ev" :class="'deal__ev--' + ev.kind">
                <span class="deal__ev-dot"></span>
                <div class="deal__ev-body">
                  <div class="deal__ev-text">{{ evIcon(ev.kind) }} {{ ev.text }}</div>
                  <div class="deal__ev-meta">{{ ev.author ? ev.author + ' · ' : '' }}{{ fmtDateFull(ev.created_at) }}</div>
                </div>
              </div>
              <div v-if="eventsLoading" class="deal__ev-loading">Загрузка истории…</div>
            </div>

            <!-- Добавить заметку -->
            <div class="deal__addnote">
              <textarea v-model="noteText" rows="2" placeholder="Написать заметку в историю (звонок, договорённость…)" @keydown.ctrl.enter="addNote"></textarea>
              <button class="deal__addnote-btn" :disabled="!noteText.trim() || noteSaving" @click="addNote">
                {{ noteSaving ? 'Сохраняю…' : 'Добавить в историю' }}
              </button>
            </div>
          </div>

          <div v-if="isAdmin" class="deal__foot">
            <button class="deal__del" @click="deleteLead(openLead); closeDeal()">Удалить сделку</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const STAGES = [
  { key: 'new',       label: 'Новая',     color: '#e6b800' },
  { key: 'contacted', label: 'Связались', color: '#4da6ff' },
  { key: 'invoice',   label: 'Счёт / КП', color: '#a855f7' },
  { key: 'payment',   label: 'Оплата',    color: '#f5a623' },
  { key: 'won',       label: 'Успешно',   color: '#4caf50' },
  { key: 'lost',      label: 'Отказ',     color: '#777' },
]
const stageOf = (l) => l.stage || 'new'
const stageMeta = (k) => STAGES.find((s) => s.key === k) || STAGES[0]

const loading = ref(true)
const leads = ref([])
const view = ref('board')
const isAdmin = ref(false)

const activeFilter = ref('all')
const listFilters = [{ key: 'all', label: 'Все' }, ...STAGES.map((s) => ({ key: s.key, label: s.label }))]

const countStage = (k) => leads.value.filter((l) => stageOf(l) === k).length
const byStage = (k) => leads.value.filter((l) => stageOf(l) === k)
const filtered = computed(() => activeFilter.value === 'all' ? leads.value : leads.value.filter((l) => stageOf(l) === activeFilter.value))

async function loadLeads() {
  loading.value = true
  try { leads.value = await $fetch('/api/admin/leads') } catch {}
  loading.value = false
}

// ── drag & drop канбана ──
const dragId = ref(null)
const dragOver = ref(null)
function onDrop(stageKey) {
  dragOver.value = null
  const lead = leads.value.find((l) => l.id === dragId.value)
  dragId.value = null
  if (lead && stageOf(lead) !== stageKey) setStage(lead, stageKey)
}

async function setStage(lead, stage) {
  const prev = lead.stage
  lead.stage = stage
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { stage } })
    if (openLead.value && openLead.value.id === lead.id) loadEvents(lead.id)
  } catch { lead.stage = prev }
}

async function updateNotes(lead, notes) {
  if (notes === (lead.notes || '')) return
  lead.notes = notes
  try { await $fetch(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { notes } }) } catch {}
}

async function deleteLead(lead) {
  if (!confirm(`Удалить сделку «${lead.name || 'без имени'}»? Отменить нельзя.`)) return
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, { method: 'DELETE' })
    leads.value = leads.value.filter((l) => l.id !== lead.id)
  } catch (e) { alert(e?.data?.message || 'Ошибка удаления') }
}

// ── карточка сделки ──
const openLead = ref(null)
const events = ref([])
const eventsLoading = ref(false)
const noteText = ref('')
const noteSaving = ref(false)

async function openDeal(lead) {
  openLead.value = lead
  events.value = []
  noteText.value = ''
  await loadEvents(lead.id)
}
function closeDeal() { openLead.value = null }
async function loadEvents(id) {
  eventsLoading.value = true
  try { events.value = await $fetch(`/api/admin/leads/${id}/events`) } catch { events.value = [] }
  eventsLoading.value = false
}
async function addNote() {
  const text = noteText.value.trim()
  if (!text) return
  noteSaving.value = true
  try {
    await $fetch(`/api/admin/leads/${openLead.value.id}/events`, { method: 'POST', body: { text } })
    noteText.value = ''
    await loadEvents(openLead.value.id)
  } catch {}
  noteSaving.value = false
}
function evIcon(kind) {
  return { note: '📝', stage: '↗', assignee: '👤', email: '✉', call: '📞' }[kind] || '•'
}

const mailLink = (e) => `https://e.mail.ru/compose/?to=${e}`

function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + ' ' + dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
function fmtDateFull(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' ' + dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

// ── почта → заявки ──
const checkingMail = ref(false)
const mailMsg = ref('')
async function checkMail() {
  checkingMail.value = true
  mailMsg.value = ''
  try {
    const r = await $fetch('/api/admin/mail/sync', { method: 'POST' })
    if (r.reason === 'not_configured') mailMsg.value = 'Почта не подключена (нет IMAP-настроек)'
    else if (!r.ok) {
      const raw = String(r.reason || '')
      let hint = raw
      if (/auth|credential|login|password|invalid|LOGIN|failure|command failed|authenticationfailed|\bNO\b|\bBAD\b/i.test(raw)) hint = 'неверный логин/пароль-приложение или IMAP выключен (проверь MAIL_IMAP_USER = полный адрес ящика)'
      else if (/timeout|ETIMEDOUT|ENOTFOUND|ECONNREFUSED|ECONNRESET|network|getaddrinfo/i.test(raw)) hint = 'нет связи с сервером почты (сеть/порт 993)'
      mailMsg.value = 'Не удалось подключиться: ' + hint + (raw && hint !== raw ? ` [${raw.slice(0, 120)}]` : '')
    }
    else if (r.imported > 0) { mailMsg.value = `Заведено сделок из писем: ${r.imported}`; await loadLeads() }
    else mailMsg.value = 'Новых писем нет'
  } catch { mailMsg.value = 'Ошибка проверки почты' }
  checkingMail.value = false
  setTimeout(() => { mailMsg.value = '' }, 15000)
}

onMounted(async () => {
  try { const me = await $fetch('/api/admin/me'); isAdmin.value = me.role === 'admin' } catch {}
  await loadLeads()
})
</script>

<style scoped>
.crm__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.crm__title { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.crm__view-switch { display: flex; gap: 0; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden; }
.crm__view-switch button { background: #161616; border: none; color: #888; padding: 0.4rem 0.85rem; cursor: pointer; font-family: inherit; font-size: 0.82rem; }
.crm__view-switch button.on { background: #e6b800; color: #000; font-weight: 600; }
.crm__refresh { background: #1e1e1e; border: 1px solid #333; color: #aaa; padding: 0.4rem 0.9rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-family: inherit; transition: all 0.15s; }
.crm__refresh:hover { color: #fff; border-color: #555; }
.crm__refresh:disabled { opacity: 0.4; cursor: not-allowed; }
.crm__header-actions { display: flex; align-items: center; gap: 0.6rem; margin-left: auto; flex-wrap: wrap; }
.crm__refresh--mail { border-color: #3a6ea5; color: #7fb3e6; }
.crm__refresh--mail:hover:not(:disabled) { color: #fff; border-color: #4a86c5; background: rgba(58,110,165,0.15); }
.crm__mail-msg { font-size: 0.78rem; color: #7fb3e6; max-width: 340px; }

.crm__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.crm__stat { background: #161616; border: 1px solid #222; border-radius: 12px; padding: 1rem 1.25rem; cursor: pointer; transition: border-color 0.15s; }
.crm__stat:hover { border-color: #444; }
.crm__stat-num { font-size: 1.75rem; font-weight: 700; color: #fff; }
.crm__stat-lbl { font-size: 0.78rem; color: #666; margin-top: 0.2rem; }

/* ── Канбан ── */
.crm__cols { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(220px, 1fr); gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; align-items: start; }
.crm__col { background: #121212; border: 1px solid #202020; border-radius: 12px; min-height: 120px; transition: border-color 0.15s, background 0.15s; }
.crm__col--over { border-color: #e6b800; background: #17150c; }
.crm__col-head { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 0.85rem; border-bottom: 1px solid #1e1e1e; position: sticky; top: 0; }
.crm__col-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex-shrink: 0; }
.crm__col-name { font-size: 0.82rem; font-weight: 600; color: #ccc; }
.crm__col-count { margin-left: auto; font-size: 0.72rem; color: #666; background: #1c1c1c; border-radius: 10px; padding: 0.05rem 0.5rem; }
.crm__col-body { padding: 0.6rem; display: flex; flex-direction: column; gap: 0.5rem; min-height: 60px; }
.crm__col-empty { text-align: center; color: #333; padding: 0.5rem; font-size: 0.85rem; }

.crm__card { background: #1a1a1a; border: 1px solid #262626; border-radius: 10px; padding: 0.65rem 0.7rem; cursor: pointer; transition: border-color 0.12s, transform 0.12s; }
.crm__card:hover { border-color: #3a3a3a; transform: translateY(-1px); }
.crm__card:active { cursor: grabbing; }
.crm__card-top { display: flex; align-items: center; gap: 0.4rem; }
.crm__card-name { font-weight: 600; color: #eee; font-size: 0.85rem; }
.crm__card-src { color: #7fb3e6; font-size: 0.8rem; margin-left: auto; }
.crm__card-item { color: #b99; font-size: 0.75rem; margin-top: 0.25rem; color: #caa04a; }
.crm__card-msg { color: #777; font-size: 0.75rem; margin-top: 0.2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.crm__card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 0.45rem; }
.crm__card-phone { color: #e6b800; text-decoration: none; font-size: 0.75rem; }
.crm__card-date { color: #555; font-size: 0.68rem; }

/* ── Список ── */
.crm__filters { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.crm__filter { background: #161616; border: 1px solid #2a2a2a; color: #888; padding: 0.4rem 0.9rem; border-radius: 20px; cursor: pointer; font-size: 0.82rem; font-family: inherit; transition: all 0.15s; }
.crm__filter:hover { color: #fff; border-color: #444; }
.crm__filter--active { background: #e6b800; border-color: #e6b800; color: #000; font-weight: 600; }
.crm__wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #222; }
.crm__loading, .crm__empty { padding: 3rem; text-align: center; color: #555; }
.crm__table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.crm__table thead tr { border-bottom: 1px solid #222; }
.crm__table th { padding: 0.75rem 1rem; text-align: left; color: #555; font-weight: 600; white-space: nowrap; background: #161616; }
.crm__table tbody tr { border-bottom: 1px solid #1a1a1a; transition: background 0.1s; }
.crm__table tbody tr:hover { background: #1a1a1a; }
.crm__table td { padding: 0.7rem 1rem; vertical-align: top; }
.crm__row--muted { opacity: 0.5; }
.crm__link { cursor: pointer; }
.crm__link:hover { color: #fff; }
.crm__date { color: #555; white-space: nowrap; font-size: 0.75rem; }
.crm__name { color: #ddd; font-weight: 600; white-space: nowrap; }
.crm__phone a { color: #e6b800; text-decoration: none; white-space: nowrap; }
.crm__phone a:hover { text-decoration: underline; }
.crm__item-title { color: #aaa; font-size: 0.78rem; margin-bottom: 0.25rem; }
.crm__comment { color: #666; font-size: 0.78rem; max-width: 260px; }
.crm__status { background: #1a1a1a; border: 1px solid #333; color: #ddd; padding: 0.35rem 0.5rem; border-radius: 6px; font-size: 0.78rem; font-family: inherit; cursor: pointer; outline: none; }
.crm__del-cell { text-align: center; }
.crm__del { background: transparent; border: 1px solid #2a2a2a; color: #666; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-family: inherit; line-height: 1; transition: all 0.15s; }
.crm__del:hover { color: #ff6b6b; border-color: #5a2f2f; background: #1a1212; }

/* ── Карточка сделки ── */
.deal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 300; display: flex; justify-content: flex-end; }
.deal { width: 100%; max-width: 460px; height: 100%; background: #0e0e0e; border-left: 1px solid #222; display: flex; flex-direction: column; }
.deal__head { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.1rem 1.25rem; border-bottom: 1px solid #1c1c1c; }
.deal__name { font-size: 1.05rem; font-weight: 700; color: #fff; }
.deal__sub { font-size: 0.75rem; color: #666; margin-top: 0.25rem; }
.deal__close { background: #1a1a1a; border: 1px solid #2a2a2a; color: #888; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; }
.deal__close:hover { color: #fff; }
.deal__stages { display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0.85rem 1.25rem; border-bottom: 1px solid #1c1c1c; }
.deal__stage { background: #161616; border: 1px solid #2a2a2a; color: #999; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-family: inherit; cursor: pointer; transition: all 0.12s; }
.deal__stage:hover { border-color: #555; color: #ddd; }
.deal__body { flex: 1; overflow-y: auto; padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.deal__info { display: flex; flex-direction: column; gap: 0.4rem; }
.deal__row { display: flex; gap: 0.75rem; font-size: 0.82rem; }
.deal__row span { color: #555; min-width: 64px; }
.deal__row a { color: #e6b800; text-decoration: none; }
.deal__row b { color: #ddd; font-weight: 600; }
.deal__label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #555; font-weight: 600; }
.deal__request { background: #141414; border: 1px solid #202020; border-radius: 10px; padding: 0.75rem; }
.deal__request p { margin: 0.4rem 0 0; color: #bbb; font-size: 0.85rem; line-height: 1.5; white-space: pre-wrap; }
.deal__quicknote input { width: 100%; margin-top: 0.4rem; background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 0.55rem 0.7rem; color: #ddd; font-family: inherit; font-size: 0.82rem; outline: none; box-sizing: border-box; }
.deal__quicknote input:focus { border-color: #e6b800; }

.deal__timeline { display: flex; flex-direction: column; gap: 0; position: relative; }
.deal__ev { display: flex; gap: 0.65rem; padding: 0.5rem 0; position: relative; }
.deal__ev-dot { width: 9px; height: 9px; border-radius: 50%; background: #333; margin-top: 4px; flex-shrink: 0; position: relative; z-index: 1; }
.deal__ev--stage .deal__ev-dot { background: #4da6ff; }
.deal__ev--note .deal__ev-dot { background: #e6b800; }
.deal__ev--created .deal__ev-dot { background: #4caf50; }
.deal__ev:not(:last-child)::before { content: ''; position: absolute; left: 4px; top: 14px; bottom: -4px; width: 1px; background: #222; }
.deal__ev-text { color: #ccc; font-size: 0.82rem; }
.deal__ev-meta { color: #555; font-size: 0.7rem; margin-top: 0.1rem; }
.deal__ev-loading { color: #555; font-size: 0.8rem; padding: 0.5rem 0; }

.deal__addnote { display: flex; flex-direction: column; gap: 0.5rem; }
.deal__addnote textarea { background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 0.6rem 0.7rem; color: #ddd; font-family: inherit; font-size: 0.82rem; resize: vertical; outline: none; }
.deal__addnote textarea:focus { border-color: #e6b800; }
.deal__addnote-btn { align-self: flex-start; background: #e6b800; color: #0a0a0a; border: none; border-radius: 8px; padding: 0.5rem 1rem; font-weight: 700; font-family: inherit; font-size: 0.82rem; cursor: pointer; }
.deal__addnote-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.deal__foot { padding: 0.85rem 1.25rem; border-top: 1px solid #1c1c1c; }
.deal__del { background: transparent; border: 1px solid #3a2020; color: #c05555; border-radius: 8px; padding: 0.5rem 1rem; font-family: inherit; font-size: 0.8rem; cursor: pointer; }
.deal__del:hover { background: #1a1010; color: #ff6b6b; }

.deal-enter-active, .deal-leave-active { transition: opacity 0.25s; }
.deal-enter-active .deal, .deal-leave-active .deal { transition: transform 0.3s cubic-bezier(0.32,0.72,0,1); }
.deal-enter-from, .deal-leave-to { opacity: 0; }
.deal-enter-from .deal, .deal-leave-to .deal { transform: translateX(100%); }

@media (max-width: 640px) {
  .crm__stats { grid-template-columns: repeat(2, 1fr); }
  .crm__cols { grid-auto-columns: 80%; }
  .deal { max-width: 100%; }
}
</style>
