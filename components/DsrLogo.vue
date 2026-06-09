<template>
  <div class="dsr-logo" :class="`dsr-logo--${size}`">
    <span class="dsr-logo__abbr">ДСР</span>
    <span class="dsr-logo__divider"></span>
    <span class="dsr-logo__text">
      <span class="dsr-logo__line1">ДАЛЬНЕВОСТОЧНЫЕ</span>
      <span class="dsr-logo__line2">СИСТЕМЫ РАЗВИТИЯ</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<style scoped>
.dsr-logo {
  display: inline-flex;
  align-items: center;
  gap: 0;
  user-select: none;
}

.dsr-logo__abbr {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1;
}

.dsr-logo__divider {
  width: 3px;
  background: #cc2222;
  border-radius: 1px;
  flex-shrink: 0;
  align-self: stretch;
}

.dsr-logo__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dsr-logo__line1,
.dsr-logo__line2 {
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.08em;
  line-height: 1.25;
  white-space: nowrap;
}

/* Размеры */
.dsr-logo--sm .dsr-logo__abbr   { font-size: 1.4rem; margin-right: 0.5rem; }
.dsr-logo--sm .dsr-logo__divider { margin: 0 0.5rem; }
.dsr-logo--sm .dsr-logo__line1,
.dsr-logo--sm .dsr-logo__line2  { font-size: 0.45rem; }

.dsr-logo--md .dsr-logo__abbr   { font-size: 2.2rem; margin-right: 0.7rem; }
.dsr-logo--md .dsr-logo__divider { margin: 0 0.7rem; }
.dsr-logo--md .dsr-logo__line1,
.dsr-logo--md .dsr-logo__line2  { font-size: 0.65rem; }

.dsr-logo--lg .dsr-logo__abbr   { font-size: 3.5rem; margin-right: 1rem; }
.dsr-logo--lg .dsr-logo__divider { margin: 0 1rem; }
.dsr-logo--lg .dsr-logo__line1,
.dsr-logo--lg .dsr-logo__line2  { font-size: 0.9rem; }
</style>
