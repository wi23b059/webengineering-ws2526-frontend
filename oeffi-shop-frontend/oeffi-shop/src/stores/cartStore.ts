import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import api from '../services/api'
import { useAuthStore } from './authStore'
import { useProductStore } from './productStore'

export interface CartItem {
  id?: number        // DB-ID
  productId: number
  name?: string
  price?: number
  quantity: number
  imagePath?: string
}

const STORAGE_KEY = 'cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const auth = useAuthStore()
  const products = useProductStore()

  // LocalStorage laden
  function loadCart() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) items.value = JSON.parse(raw)
  }

  // LocalStorage speichern
  watch(
    items,
() => {
      if (!auth.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
      }
    },
    { deep: true }
  )

  // DB-Warenkorb laden
  async function fetchCartFromBackend() {
    if (!auth.user?.id) return
    try {
      const resp = await api.get<CartItem[]>(`/api/cart/${auth.user.id}`)
      items.value = resp.data.map(i => ({
        ...i,
        name: products.products.find(p => p.id === i.productId)?.name,
        price: products.products.find(p => p.id === i.productId)?.price,
        imagePath: products.getProductImageUrl(
          products.products.find(p => p.id === i.productId)
        ),
      }))
    } catch (err) {
      console.error('Fehler beim Laden des DB-Warenkorbs', err)
    }
  }

  // Item hinzufügen
  async function addItem(product: { id: number; name: string; price: number; imagePath?: string }) {
    const existing = items.value.find(i => i.productId === product.id)
    if (existing) {
      await updateQuantity(product.id, existing.quantity + 1)
    } else {
      const newItem: CartItem = {
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        imagePath: product.imagePath,
      }
      items.value.push(newItem)

      // Wenn eingeloggt, an DB senden
      if (auth.user?.id) {
        try {
          const resp = await api.post(`/api/cart/${auth.user.id}/items`, {
            productId: newItem.productId,
            quantity: newItem.quantity,
          })
          newItem.id = resp.data.id
        } catch (err) {
          console.error('Fehler beim Hinzufügen in DB', err)
        }
      }
    }
  }

  // Menge aktualisieren
  async function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(i => i.productId === productId)
    if (!item) return
    item.quantity = quantity

    if (auth.user?.id && item.id) {
      try {
        await api.put(`/api/cart/${auth.user.id}/items/${productId}`, {
          productId,
          quantity,
        })
      } catch (err) {
        console.error('Fehler beim Update in DB', err)
      }
    }
  }

  // Item entfernen
  async function removeItem(productId: number) {
    const item = items.value.find(i => i.productId === productId)
    items.value = items.value.filter(i => i.productId !== productId)

    if (auth.user?.id && item?.id) {
      try {
        await api.delete(`/api/cart/${auth.user.id}/items/${productId}`)
      } catch (err) {
        console.error('Fehler beim Entfernen in DB', err)
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => (i.price ?? 0) * i.quantity, 0)
  )

  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  async function initCart() {
    if (auth.user?.id) {
      // Eingeloggt → DB ist Source of Truth
      await fetchCartFromBackend()
      localStorage.removeItem(STORAGE_KEY)
    } else {
      // Gast → LocalStorage
      loadCart()
    }
  }

  return {
    items,
    loadCart,
    fetchCartFromBackend,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
    initCart,
  }
})
