<template>
  <div class="ai">
    <!-- Кнопка открытия -->
    <button
      class="ai__fab"
      :class="{ 'ai__fab--open': open }"
      :aria-label="open ? 'Закрыть чат' : 'Открыть чат-помощник'"
      @click="toggle"
    >
      <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5Z"/>
        <circle cx="8.5" cy="11.5" r="1" fill="currentColor"/>
        <circle cx="12" cy="11.5" r="1" fill="currentColor"/>
        <circle cx="15.5" cy="11.5" r="1" fill="currentColor"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/>
      </svg>
    </button>

    <!-- Окно чата -->
    <transition name="ai-win">
      <div v-if="open" class="ai__win">
        <div class="ai__head">
          <div class="ai__head-avatar">ИИ</div>
          <div class="ai__head-txt">
            <div class="ai__head-title">Помощник ДСР</div>
            <div class="ai__head-sub">Отвечаю по товарам и услугам</div>
          </div>
        </div>

        <div ref="scroller" class="ai__body">
          <div v-for="(m, i) in messages" :key="i" class="ai__msg" :class="'ai__msg--' + m.role">
            <div class="ai__bubble">{{ m.text }}</div>
          </div>
          <div v-if="loading" class="ai__msg ai__msg--assistant">
            <div class="ai__bubble ai__typing"><span></span><span></span><span></span></div>
          </div>
        </div>

        <form class="ai__input" @submit.prevent="send">
          <input
            v-model="draft"
            type="text"
            class="ai__field"
            placeholder="Спросите про товар или услугу…"
            :disabled="loading"
            maxlength="500"
          />
          <button class="ai__send" type="submit" :disabled="loading || !draft.trim()" aria-label="Отправить">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 12l16-8-6 16-3-7-7-1Z"/>
            </svg>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
const open = ref(false)
const draft = ref('')
const loading = ref(false)
const scroller = ref(null)
const messages = ref([
  { role: 'assistant', text: 'Здравствуйте! Я помощник ДСР. Спросите про товар, цену, доставку или услуги — подскажу.' },
])

function toggle() {
  open.value = !open.value
  if (open.value) scrollDown()
}

async function scrollDown() {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

async function send() {
  const text = draft.value.trim()
  if (!text || loading.value) return
  messages.value.push({ role: 'user', text })
  draft.value = ''
  loading.value = true
  scrollDown()
  try {
    const payload = messages.value.map((m) => ({ role: m.role, content: m.text }))
    const res = await $fetch('/api/assistant', { method: 'POST', body: { messages: payload } })
    messages.value.push({ role: 'assistant', text: res.reply })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      text: 'Извините, сейчас не могу ответить. Позвоните нам: +7 914 329-29-29.',
    })
  } finally {
    loading.value = false
    scrollDown()
  }
}
</script>

<style scoped>
.ai__fab {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 90;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  background: #e6b800;
  color: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(230, 184, 0, 0.35);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.ai__fab:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(230, 184, 0, 0.45); }
.ai__fab--open { background: #1a1a1a; color: #e6b800; }

.ai__win {
  position: fixed;
  bottom: calc(2rem + 58px + 14px);
  left: 2rem;
  z-index: 91;
  width: 360px;
  max-width: calc(100vw - 2.5rem);
  height: 520px;
  max-height: calc(100vh - 8rem);
  background: #101010;
  border: 1px solid #262626;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
  font-family: 'Montserrat', sans-serif;
}

.ai__head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #222;
  background: #161616;
}
.ai__head-avatar {
  width: 38px; height: 38px; flex-shrink: 0;
  border-radius: 50%;
  background: #e6b800; color: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.8rem;
}
.ai__head-title { color: #fff; font-weight: 700; font-size: 0.92rem; }
.ai__head-sub { color: #777; font-size: 0.72rem; margin-top: 1px; }

.ai__body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.ai__msg { display: flex; }
.ai__msg--user { justify-content: flex-end; }
.ai__bubble {
  max-width: 82%;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  font-size: 0.86rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
}
.ai__msg--assistant .ai__bubble { background: #1c1c1c; color: #ddd; border-top-left-radius: 4px; }
.ai__msg--user .ai__bubble { background: #e6b800; color: #0a0a0a; font-weight: 500; border-top-right-radius: 4px; }

.ai__typing { display: flex; gap: 4px; align-items: center; }
.ai__typing span {
  width: 6px; height: 6px; border-radius: 50%; background: #666;
  animation: ai-blink 1.2s infinite ease-in-out;
}
.ai__typing span:nth-child(2) { animation-delay: 0.2s; }
.ai__typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes ai-blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }

.ai__input {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid #222;
  background: #141414;
}
.ai__field {
  flex: 1;
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  color: #eee;
  font-size: 0.86rem;
  font-family: inherit;
  outline: none;
}
.ai__field:focus { border-color: #e6b800; }
.ai__send {
  width: 40px; flex-shrink: 0;
  border: none; border-radius: 10px;
  background: #e6b800; color: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: opacity 0.2s;
}
.ai__send:disabled { opacity: 0.4; cursor: not-allowed; }

.ai-win-enter-active, .ai-win-leave-active { transition: opacity 0.2s, transform 0.2s; }
.ai-win-enter-from, .ai-win-leave-to { opacity: 0; transform: translateY(12px) scale(0.98); }

@media (max-width: 480px) {
  .ai__fab { bottom: 1.25rem; left: 1.25rem; width: 50px; height: 50px; }
  .ai__win {
    bottom: calc(1.25rem + 50px + 12px);
    left: 1.25rem;
    width: calc(100vw - 2.5rem);
    height: 70vh;
  }
}
</style>