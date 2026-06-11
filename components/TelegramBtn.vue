<template>
  <a
    href="https://t.me/dsr2025"
    target="_blank"
    rel="noopener"
    class="tg-btn"
    aria-label="Написать в Telegram"
  >
    <div class="tg-btn__ring"></div>
    <div class="tg-btn__ring tg-btn__ring--delay"></div>
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
    <span class="tg-btn__tooltip">Написать в Telegram</span>
  </a>
</template>

<style scoped>
.tg-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 90;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(145deg, #2bb5f0, #1a8fbd);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(34, 158, 217, 0.45), 0 2px 8px rgba(0,0,0,0.3);
  text-decoration: none;
  animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
}

.tg-btn:hover {
  transform: scale(1.15) translateY(-3px);
  box-shadow: 0 10px 32px rgba(34, 158, 217, 0.65), 0 4px 12px rgba(0,0,0,0.3);
}

.tg-btn:active {
  transform: scale(0.95);
}

/* Пульсирующие кольца */
.tg-btn__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(34, 158, 217, 0.55);
  animation: pulseRingTg 2.8s ease-out infinite;
  pointer-events: none;
}
.tg-btn__ring--delay {
  animation-delay: 1.4s;
}

@keyframes pulseRingTg {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(1.7); opacity: 0; }
}

/* Тултип */
.tg-btn:hover .tg-btn__tooltip {
  opacity: 1;
  transform: translateX(0);
}
.tg-btn__tooltip {
  position: absolute;
  right: calc(100% + 12px);
  background: rgba(12, 12, 12, 0.95);
  backdrop-filter: blur(12px);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  white-space: nowrap;
  border: 1px solid rgba(34, 158, 217, 0.25);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  opacity: 0;
  transform: translateX(8px);
  transition: opacity 0.22s, transform 0.22s;
  pointer-events: none;
}

@keyframes slideInRight {
  from { transform: translateX(80px) scale(0.8); opacity: 0; }
  to   { transform: translateX(0)    scale(1);   opacity: 1; }
}

@media (max-width: 480px) {
  .tg-btn { bottom: 1.25rem; right: 1.25rem; width: 52px; height: 52px; }
  .tg-btn__tooltip { display: none; }
}
</style>
