<template>
  <a
    href="https://t.me/dsr2025"
    target="_blank"
    rel="noopener"
    class="tg-btn"
    aria-label="Написать в Telegram"
  >
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
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #229ed9;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(34, 158, 217, 0.4);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tg-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 8px 28px rgba(34, 158, 217, 0.55);
}

.tg-btn:hover .tg-btn__tooltip {
  opacity: 1;
  transform: translateX(0);
}

.tg-btn__tooltip {
  position: absolute;
  right: calc(100% + 10px);
  background: rgba(16,16,16,0.95);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  white-space: nowrap;
  border: 1px solid rgba(255,255,255,0.08);
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
}

@media (max-width: 480px) {
  .tg-btn {
    bottom: 1.25rem;
    right: 1.25rem;
    width: 50px;
    height: 50px;
  }
  .tg-btn__tooltip { display: none; }
}
</style>
