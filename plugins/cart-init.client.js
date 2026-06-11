export default defineNuxtPlugin(() => {
  const { cartItems } = useCart()
  try {
    const saved = localStorage.getItem('dsr-cart')
    if (saved) cartItems.value = JSON.parse(saved)
  } catch {}
})
