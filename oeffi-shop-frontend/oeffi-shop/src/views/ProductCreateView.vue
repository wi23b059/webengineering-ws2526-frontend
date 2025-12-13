<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore, Product } from '@/stores/productStore'

const router = useRouter()
const productStore = useProductStore()

// Formular für neues Produkt
const productForm = ref<Product>({
  id: 0,
  name: '',
  description: '',
  price: 0,
  rating: '',
  imagePath: '',
  categoryId: undefined,
  categoryName: '',
})

const successMessage = ref('')
const errorMessage = ref('')

async function createProduct() {
  try {
    const resp = await productStore.saveProduct(productForm.value, true)
    if (resp) {
      successMessage.value = 'Produkt erfolgreich erstellt.'
      errorMessage.value = ''
      router.push('/admin/products')
    } else {
      errorMessage.value = productStore.errorMessage
      successMessage.value = ''
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Fehler beim Erstellen des Produkts.'
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="w-full bg-white rounded-lg shadow sm:max-w-lg p-6 dark:bg-gray-800 dark:border-gray-700">
      <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Neues Produkt erstellen</h1>

      <div v-if="successMessage" class="mb-4 p-3 rounded bg-green-100 text-green-700">{{ successMessage }}</div>
      <div v-if="errorMessage" class="mb-4 p-3 rounded bg-red-100 text-red-700">{{ errorMessage }}</div>

      <form @submit.prevent="createProduct" class="space-y-4">
        <div>
          <label class="block mb-1 text-gray-900 dark:text-white">Name</label>
          <input v-model="productForm.name" type="text" class="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        </div>

        <div>
          <label class="block mb-1 text-gray-900 dark:text-white">Beschreibung</label>
          <textarea v-model="productForm.description" class="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></textarea>
        </div>

        <div>
          <label class="block mb-1 text-gray-900 dark:text-white">Preis (€)</label>
          <input v-model.number="productForm.price" type="number" step="0.01" class="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
        </div>

        <div>
          <label class="block mb-1 text-gray-900 dark:text-white">Rating</label>
          <input v-model="productForm.rating" type="text" class="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>

        <div>
          <label class="block mb-1 text-gray-900 dark:text-white">Image Path</label>
          <input v-model="productForm.imagePath" type="text" class="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>

        <div>
          <label class="block mb-1 text-gray-900 dark:text-white">Kategorie ID</label>
          <input v-model.number="productForm.categoryId" type="number" class="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Produkt erstellen</button>
      </form>
    </div>
  </section>
</template>
