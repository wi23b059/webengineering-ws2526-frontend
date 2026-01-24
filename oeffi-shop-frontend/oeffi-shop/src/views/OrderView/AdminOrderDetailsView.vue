<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const auth = useAuthStore()

const orderId = Number(route.params.id)

onMounted(async () => {
  await orderStore.fetchOrderDetails(orderId)
})

function goBack() {
  router.push('/admin/orders')
}

async function updateStatus(status: 'completed' | 'canceled') {
  await orderStore.updateOrderStatus(orderId, status)
}
</script>

<template>
  <section class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Bestelldetails</h1>

    <div v-if="orderStore.loading">Lade Bestellung…</div>
    <div v-if="orderStore.errorMessage" class="p-3 bg-red-100 text-red-700 rounded mb-4">
      {{ orderStore.errorMessage }}
    </div>

    <div v-if="orderStore.selectedOrder">
      <p><strong>Bestell-ID:</strong> {{ orderStore.selectedOrder.id }}</p>
      <p><strong>Erstellt am:</strong> {{ new Date(orderStore.selectedOrder.createdAt).toLocaleString() }}</p>
      <p><strong>Status:</strong> {{ orderStore.selectedOrder.status }}</p>
      <p><strong>Zahlungsmethode:</strong> {{ orderStore.selectedOrder.paymentMethod }}</p>
      <p><strong>Rechnungsnummer:</strong> {{ orderStore.selectedOrder.invoiceNumber ?? '–' }}</p>
      <p><strong>Gesamtpreis:</strong> {{ orderStore.selectedOrder.totalPrice.toFixed(2) }} €</p>

      <h2 class="text-xl font-semibold mt-4 mb-2">Artikel</h2>
      <table class="w-full border border-gray-200 text-left text-sm mb-4">
        <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border">Produkt</th>
          <th class="px-4 py-2 border">Menge</th>
          <th class="px-4 py-2 border">Preis</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in orderStore.selectedOrder.items" :key="item.productId">
          <td class="px-4 py-2 border">{{ item.name }}</td>
          <td class="px-4 py-2 border">{{ item.quantity }}</td>
          <td class="px-4 py-2 border">{{ (item.price * item.quantity).toFixed(2) }} €</td>
        </tr>
        </tbody>
      </table>

      <div v-if="auth.isAdmin" class="flex gap-3 mt-4">
        <button
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          @click="updateStatus('canceled')"
        >
          Stornieren
        </button>
        <button
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          @click="updateStatus('completed')"
        >
          Freigeben
        </button>
      </div>

      <button
        class="mt-4 text-blue-600 hover:underline"
        @click="goBack"
      >
        Zurück
      </button>
    </div>
  </section>
</template>
