<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import { useRouter } from 'vue-router'
import DeleteProductModal from '@/components/atoms/DeleteProductModal.vue'

const productStore = useProductStore()
const router = useRouter()
const showDeleteModal = ref(false)
const productToDeleteId = ref<number | null>(null)
const searchQuery = ref('')
const sortKey = ref<keyof any | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

onMounted(() => {
  productStore.fetchProducts()
})

function editProduct(id: number) {
  router.push(`/admin/products/${id}`)
}

function viewProductDetails(id: number) {
  router.push(`/admin/products/${id}/details`)
}

function openDeleteModal(id: number) {
  productToDeleteId.value = id
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!productToDeleteId.value) return

  await productStore.deleteProduct(productToDeleteId.value)
  showDeleteModal.value = false
  productToDeleteId.value = null
}

function sortBy(key: keyof any) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const filteredAndSortedProducts = computed(() => {
  let list = [...productStore.products]

  // 🔍 Suche über alle Felder
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      Object.values(p).some(val =>
        String(val).toLowerCase().includes(q)
      )
    )
  }

  // ↕️ Sortierung
  if (sortKey.value) {
    list.sort((a: any, b: any) => {
      const valA = a[sortKey.value!]
      const valB = b[sortKey.value!]

      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === 'number') {
        return sortDirection.value === 'asc' ? valA - valB : valB - valA
      }

      return sortDirection.value === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })
  }

  return list
})
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center px-6 py-8">
    <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-4xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Produktübersicht
        </h1>

        <!-- Lade- und Fehlermeldungen -->
        <div v-if="productStore.loading" class="text-gray-700 dark:text-gray-300">Lade Produkte...</div>
        <div v-if="productStore.errorMessage" class="rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm">
          {{ productStore.errorMessage }}
        </div>


        <input
          v-model="searchQuery"
          type="text"
          placeholder="Produkte durchsuchen…"
          class="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />

        <!-- Tabelle -->
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-200 dark:border-gray-600 text-sm text-left text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
            <tr>
              <th class="px-4 py-2 border cursor-pointer" @click="sortBy('name')">Name</th>
              <th class="px-4 py-2 border cursor-pointer" @click="sortBy('price')">Preis</th>
              <th class="px-4 py-2 border cursor-pointer" @click="sortBy('categoryName')">Kategorie</th>
              <th class="px-4 py-2 border">Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="p in filteredAndSortedProducts" :key="p.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-2 border">{{ p.name }}</td>
              <td class="px-4 py-2 border">{{ p.price }} €</td>
              <td class="px-4 py-2 border">{{ p.categoryName }}</td>
              <td class="px-4 py-2 border">
                <button
                  class="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium mr-2"

                  @click="viewProductDetails(p.id)"
                >
                  Details
                </button>

                <button
                  class="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium mr-2"
                  @click="editProduct(p.id)"
                >
                  Bearbeiten
                </button>

                <button
                  class="text-red-600 hover:text-red-800 font-medium"
                  @click="openDeleteModal(p.id)"
                >
                  Löschen
                </button>
              </td>
            </tr>
            </tbody>
          </table>

          <DeleteProductModal
            :open="showDeleteModal"
            @confirm="confirmDelete"
            @cancel="showDeleteModal = false"
          />

        </div>
      </div>
    </div>
  </section>
</template>
