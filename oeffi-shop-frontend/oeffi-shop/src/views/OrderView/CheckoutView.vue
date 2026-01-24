<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios' // falls du eine axios-instanz hast

const cart = useCartStore()
const router = useRouter()

const paymentMethod = ref('INVOICE')
const loading = ref(false)
const error = ref<string | null>(null)

// ⚠️ später aus Auth
const userId = 'demo-user'

const submitOrder = async () => {
  if (cart.items.length === 0) return

  loading.value = true
  error.value = null

  try {
    const payload = {
      order: {
        userId,
        totalPrice: cart.totalPrice,
        paymentMethod: paymentMethod.value
      },
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    }

    await axios.post('/orders/checkout', payload)

    cart.clearCart()
    router.push('/orders') // Bestellübersicht später
  } catch (e) {
    error.value = 'Bestellung fehlgeschlagen'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <!-- Fehler -->
    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-6">
      {{ error }}
    </div>

    <!-- Zusammenfassung -->
    <div class="bg-gray-50 p-6 rounded-xl border mb-8">
      <h2 class="text-xl font-semibold mb-4">Bestellübersicht</h2>

      <div
        v-for="item in cart.items"
        :key="item.productId"
        class="flex justify-between mb-2"
      >
        <span>{{ item.name }} × {{ item.quantity }}</span>
        <span>{{ (item.price * item.quantity).toFixed(2) }} €</span>
      </div>

      <div class="border-t mt-4 pt-4 font-bold text-lg">
        Gesamt: {{ cart.totalPrice.toFixed(2) }} €
      </div>
    </div>

    <!-- Zahlung -->
    <div class="bg-gray-50 p-6 rounded-xl border mb-8">
      <h2 class="text-xl font-semibold mb-4">Zahlungsmethode</h2>

      <select
        v-model="paymentMethod"
        class="border rounded-lg px-3 py-2"
      >
        <option value="INVOICE">Rechnung</option>
        <option value="CREDIT_CARD">Kreditkarte</option>
        <option value="PAYPAL">PayPal</option>
      </select>
    </div>

    <!-- Submit -->
    <div class="flex justify-end">
      <button
        @click="submitOrder"
        :disabled="loading"
        class="bg-slate-700 hover:bg-slate-800 disabled:opacity-50
               text-white px-6 py-3 rounded-lg font-medium"
      >
        {{ loading ? 'Bestelle…' : 'Jetzt bestellen' }}
      </button>
    </div>
  </div>
</template>
