import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { API_BASE_URL } from '../services/api'

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
  const categories = ref<any[]>([])
  const selectedCategory = ref<number | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')

  // Alle Produkte laden
  async function fetchProducts() {
    loading.value = true
    errorMessage.value = ''
    try {
      const resp = await api.get<Product[]>('/api/products')
      products.value = resp.data

      // Vollständige Bild-URLs setzen
      products.value.forEach(p => {
        p.imagePath = `${API_BASE_URL}/api/files/${p.imagePath}`
      })

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
  async function saveProduct(product: Product & { imageFile?: File }, isNew = false) {
    loading.value = true
    errorMessage.value = ''

    try {
      // 1. Image upload, falls vorhanden
      if (product.imageFile) {
        const formData = new FormData()
        formData.append('file', product.imageFile)

        const uploadResp = await api.post('/api/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        product.imagePath = uploadResp.data // objectKey vom Backend
      }

      // 2. Produkt speichern (PUT oder POST)
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

  async function fetchCategories() {
    try {
      const resp = await api.get('/api/categories')
      categories.value = resp.data
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchProductsByCategory(categoryId: number | null) {
    loading.value = true
    try {
      const url = categoryId
        ? `/api/products?category=${categoryId}`
        : `/api/products`
      const resp = await api.get<Product[]>(url)
      products.value = resp.data

      // Vollständige Bild-URLs setzen
      products.value.forEach(p => {
        p.imagePath = `${API_BASE_URL}/api/files/${p.imagePath}`
      })

    } finally {
      loading.value = false
    }
  }

  function getProductImageUrl(product?: Product | null) {
    if (!product?.imagePath) return ''
    return `${API_BASE_URL}/api/files/${product.imagePath}`
  }

  async function deleteProduct(id: number) {
    loading.value = true
    errorMessage.value = ''
    try {
      await api.delete(`/api/products/${id}`)
      // lokal aus der Liste entfernen
      products.value = products.value.filter(p => p.id !== id)
      return true
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Produkt konnte nicht gelöscht werden.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    categories,
    selectedCategory,
    selectedProduct,
    loading,
    errorMessage,
    fetchProducts,
    fetchProduct,
    saveProduct,
    fetchProductsByCategory,
    fetchCategories,
    getProductImageUrl,
    deleteProduct,
  }
})
