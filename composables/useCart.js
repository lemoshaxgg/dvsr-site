export const useCart = () => {
  const cartItems = useState('cart-items', () => [])
  const drawerOpen = useState('cart-drawer-open', () => false)

  function addItem(item) {
    if (!cartItems.value.find(i => i.id === item.id)) {
      cartItems.value = [...cartItems.value, {
        id: item.id,
        title: item.title,
        icon: item.icon || '📦',
        category: item.category,
        quantity: 1,
        sku: item.sku || null,
      }]
      syncStorage()
    }
  }

  function removeItem(id) {
    cartItems.value = cartItems.value.filter(i => i.id !== id)
    syncStorage()
  }

  function setQuantity(id, qty) {
    const idx = cartItems.value.findIndex(i => i.id === id)
    if (idx !== -1) {
      cartItems.value[idx] = { ...cartItems.value[idx], quantity: Math.max(1, Number(qty) || 1) }
      syncStorage()
    }
  }

  function clearCart() {
    cartItems.value = []
    if (process.client) localStorage.removeItem('dsr-cart')
  }

  function hasItem(id) {
    return cartItems.value.some(i => i.id === id)
  }

  function syncStorage() {
    if (process.client) localStorage.setItem('dsr-cart', JSON.stringify(cartItems.value))
  }

  const count = computed(() => cartItems.value.length)

  return { cartItems, drawerOpen, addItem, removeItem, setQuantity, clearCart, hasItem, count }
}
