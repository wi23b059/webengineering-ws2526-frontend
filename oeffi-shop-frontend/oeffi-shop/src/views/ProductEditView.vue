<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore, Product } from '@/stores/productStore'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

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

onMounted(async () => {
  const id = Number(route.params.id)
  await productStore.fetchProduct(id)
  if (productStore.selectedProduct) {
    productForm.value = { ...productStore.selectedProduct }
  }
})

async function saveProduct() {
  const ok = await productStore.saveProduct(productForm.value)
  if (ok) {
    successMessage.value = 'Produkt erfolgreich gespeichert.'
    errorMessage.value = ''
    router.push('/admin/products')
  } else {
    errorMessage.value = productStore.errorMessage
    successMessage.value = ''
  }
}
</script>

<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Produkt bearbeiten</h1>

    <div v-if="successMessage" class="text-green-600 mb-4">{{ successMessage }}</div>
    <div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>

    <form @submit.prevent="saveProduct" class="space-y-4 max-w-md">
      <div>
        <label class="block mb-1">Name</label>
        <input v-model="productForm.name" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block mb-1">Beschreibung</label>
        <textarea v-model="productForm.description" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block mb-1">Preis (€)</label>
        <input v-model.number="productForm.price" type="number" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block mb-1">Kategorie ID</label>
        <input v-model.number="productForm.categoryId" type="number" class="w-full border p-2 rounded" />
      </div>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Speichern</button>
    </form>
  </section>
</template>
