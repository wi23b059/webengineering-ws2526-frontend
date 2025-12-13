import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  rating?: string
  imagePath?: string
  categoryId?: number
  categoryName?: string
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')

  // Alle Produkte laden
  async function fetchProducts() {
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get<Product[]>('/api/products')
      products.value = resp.data
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Produkte konnten nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  // Einzelnes Produkt laden
  async function fetchProduct(id: number) {
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get<Product>(`/api/products/${id}`)
      selectedProduct.value = resp.data
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Produkt konnte nicht geladen werden.'
    } finally {
      loading.value = false
    }
  }

  // Produkt speichern
  async function saveProduct(product: Product, isNew = false) {
    loading.value = true
    errorMessage.value = ''

    try {
      let resp
      if (isNew) {
        // ✅ POST für neue Produkte
        resp = await api.post('/api/products', product)
      } else {
        // ✅ PUT für bestehende Produkte
        resp = await api.put(`/api/products/${product.id}`, product)
      }
      selectedProduct.value = resp.data
      return resp.data
    } catch (err: any) {
      console.error(err)
      errorMessage.value = err.response?.data?.message ?? 'Fehler beim Speichern'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    selectedProduct,
    loading,
    errorMessage,
    fetchProducts,
    fetchProduct,
    saveProduct,
  }
})
