<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useRouter } from 'vue-router'

const orderStore = useOrderStore()
const router = useRouter()
const searchQuery = ref('')
const sortKey = ref<keyof any | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

onMounted(async () => {
  await orderStore.fetchUserOrders()
})

function viewDetails(orderId: number) {
  router.push(`/orders/${orderId}`)
}

function sortBy(key: keyof any) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const filteredAndSortedOrders = computed(() => {
  let list = [...orderStore.orders]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(o => String(o.id).includes(q))
  }

  if (sortKey.value) {
    list.sort((a: any, b: any) => {
      const valA = a[sortKey.value!]
      const valB = b[sortKey.value!]
      if (valA == null) return 1
      if (valB == null) return -1
      if (typeof valA === 'number') return sortDirection.value === 'asc' ? valA - valB : valB - valA
      return sortDirection.value === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })
  }

  return list
})
</script>

<template>
  <section class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Meine Bestellungen</h1>

    <input
      v-model="searchQuery"
      placeholder="Bestellungen durchsuchen (nach ID)…"
      class="w-full mb-4 px-3 py-2 border rounded"
    />

    <div v-if="orderStore.loading">Lade Bestellungen…</div>
    <div v-if="orderStore.errorMessage" class="p-3 bg-red-100 text-red-700 rounded mb-4">
      {{ orderStore.errorMessage }}
    </div>

    <table class="w-full border border-gray-200 text-left text-sm">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 border cursor-pointer" @click="sortBy('id')">ID</th>
        <th class="px-4 py-2 border cursor-pointer" @click="sortBy('status')">Status</th>
        <th class="px-4 py-2 border cursor-pointer" @click="sortBy('totalPrice')">Gesamt</th>
        <th class="px-4 py-2 border cursor-pointer" @click="sortBy('createdAt')">Datum</th>
        <th class="px-4 py-2 border">Aktionen</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="o in filteredAndSortedOrders" :key="o.id" class="hover:bg-gray-50">
        <td class="px-4 py-2 border">{{ o.id }}</td>
        <td class="px-4 py-2 border">{{ o.status }}</td>
        <td class="px-4 py-2 border">{{ o.totalPrice.toFixed(2) }} €</td>
        <td class="px-4 py-2 border">{{ new Date(o.createdAt).toLocaleString() }}</td>
        <td class="px-4 py-2 border">
          <button class="text-blue-600 hover:underline" @click="viewDetails(o.id)">
            Details
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>
