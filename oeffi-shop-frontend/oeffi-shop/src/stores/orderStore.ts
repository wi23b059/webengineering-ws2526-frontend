import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './authStore'
import { AxiosError } from 'axios'

export interface OrderItem {
  productId: number
  name?: string
  price?: number
  quantity: number
  imagePath?: string
}

export interface Order {
  id: number
  userId: string
  totalPrice: number
  paymentMethod: string
  status: 'pending' | 'completed' | 'canceled'
  createdAt: string
  invoiceNumber?: string
  items: OrderItem[]
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')

  const auth = useAuthStore()

  // 🔹 Alle Bestellungen laden (Admin)
  async function fetchAllOrders() {
    if (!auth.isAdmin) return
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get<Order[]>('/api/orders')
      orders.value = resp.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error(error)
      errorMessage.value = 'Bestellungen konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Eigene Bestellungen laden (User)
  async function fetchUserOrders() {
    if (!auth.user) return
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get<Order[]>(`/api/orders/user/${auth.user.id}`)
      orders.value = resp.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error(error)
      errorMessage.value = 'Bestellungen konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Detail einer Bestellung laden
  async function fetchOrderDetails(orderId: number) {
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get<Order>(`/api/orders/${orderId}`)
      selectedOrder.value = resp.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error(error)
      errorMessage.value = 'Bestelldetails konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  // 🔹 Admin: Bestellung stornieren/freigeben
  async function updateOrderStatus(orderId: number, status: 'PENDING' | 'COMPLETED' | 'CANCELED') {
    if (!auth.isAdmin) return
    loading.value = true
    try {
      const resp = await api.put(`/api/orders/${orderId}/status`, null, {
        params: { status }
      })
      // lokal aktualisieren
      const idx = orders.value.findIndex(o => o.id === orderId)
      if (idx !== -1) orders.value[idx].status = resp.data.status
      if (selectedOrder.value?.id === orderId) selectedOrder.value.status = resp.data.status
      return resp.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error(error)
      errorMessage.value = 'Status konnte nicht aktualisiert werden.'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    selectedOrder,
    loading,
    errorMessage,
    fetchAllOrders,
    fetchUserOrders,
    fetchOrderDetails,
    updateOrderStatus,
  }
})
