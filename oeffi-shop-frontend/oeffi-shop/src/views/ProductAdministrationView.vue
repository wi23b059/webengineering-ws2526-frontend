<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const router = useRouter()

onMounted(() => {
  productStore.fetchProducts()
})

function editProduct(id: number) {
  router.push(`/admin/products/${id}`)
}
</script>

<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4">Produktübersicht</h1>

    <div v-if="productStore.loading">Lade Produkte...</div>
    <div v-if="productStore.errorMessage" class="text-red-500">{{ productStore.errorMessage }}</div>

    <table class="min-w-full bg-white border">
      <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2 border">Name</th>
        <th class="px-4 py-2 border">Preis</th>
        <th class="px-4 py-2 border">Kategorie</th>
        <th class="px-4 py-2 border">Aktion</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="p in productStore.products" :key="p.id" class="hover:bg-gray-50">
        <td class="px-4 py-2 border">{{ p.name }}</td>
        <td class="px-4 py-2 border">{{ p.price }} €</td>
        <td class="px-4 py-2 border">{{ p.categoryName }}</td>
        <td class="px-4 py-2 border">
          <button class="text-blue-600 hover:underline" @click="editProduct(p.id)">Bearbeiten</button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>
