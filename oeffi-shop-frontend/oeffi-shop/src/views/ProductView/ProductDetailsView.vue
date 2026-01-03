<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

onMounted(async () => {
  const id = Number(route.params.id)
  await productStore.fetchProduct(id)
})

function goToEdit() {
  router.push(`/admin/products/${route.params.id}`)
}

const imageUrl = computed(() => {
  const url = productStore.getProductImageUrl(productStore.selectedProduct)
  return url
})
</script>

<template>
  <section
    class="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8"
  >
    <div class="w-full bg-white rounded-lg shadow sm:max-w-xl dark:bg-gray-800">
      <div class="p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Produktdetails</h1>

        <!-- Lade- / Fehlerzustände -->
        <div v-if="productStore.loading">Lade Produkt…</div>
        <div
          v-if="productStore.errorMessage"
          class="bg-red-100 border border-red-400 p-3 text-red-700 rounded"
        >
          {{ productStore.errorMessage }}
        </div>

        <div v-if="productStore.selectedProduct" class="space-y-3">
          <div>
            <span class="font-semibold">Produkt-ID:</span>
            <p>{{ productStore.selectedProduct.id }}</p>
          </div>

          <div>
            <span class="font-semibold">Name:</span>
            <p>{{ productStore.selectedProduct.name }}</p>
          </div>

          <div>
            <span class="font-semibold">Beschreibung:</span>
            <p>{{ productStore.selectedProduct.description }}</p>
          </div>

          <div>
            <span class="font-semibold">Rating:</span>
            <p>{{ productStore.selectedProduct.rating }}</p>
          </div>

          <div>
            <span class="font-semibold">Preis:</span>
            <p>{{ productStore.selectedProduct.price }} €</p>
          </div>

          <div>
            <span class="font-semibold">Kategorie-ID:</span>
            <p>{{ productStore.selectedProduct.categoryId }}</p>
          </div>

          <div>
            <span class="font-semibold">Kategorie:</span>
            <p>{{ productStore.selectedProduct.categoryName }}</p>
          </div>

          <div v-if="imageUrl && imageUrl !== ''">
            <span class="font-semibold">Bild:</span>
            <img :src="imageUrl" class="mt-2 rounded max-h-48 border" alt="Produktbild"/>
          </div>

          <!-- Bearbeiten-Button -->
          <div class="flex gap-3 pt-4">
            <button
              @click="goToEdit"
              class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
            >
              Bearbeiten
            </button>
          </div>

          <div class="flex gap-3 pt-4">
            <!-- Zurück zur Produktübersicht -->
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
              Zurück zur
              <router-link
                to="/admin/products"
                class="font-medium text-slate-600 hover:underline dark:text-slate-500"
                >Produktübersicht</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
