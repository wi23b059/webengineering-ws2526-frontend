<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useProductStore } from '@/stores/productStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const products = useProductStore()
const router = useRouter()

// Stelle sicher, dass Produkte geladen sind
if (!products.products.length) {
  products.fetchProducts()
}

// Cart Items mit Produktinfos anreichern
const enrichedItems = computed(() => {
  return cart.items.map(cartItem => {
    const product = products.products.find(p => p.id === cartItem.productId)
    return {
      ...cartItem,
      name: product?.name ?? 'Unbekanntes Produkt',
      price: product?.price ?? 0,
      imagePath: product?.imagePath ?? '/fallback.png',
    }
  })
})

const hasItems = computed(() => cart.items.length > 0)

const increase = (id: number) => {
  const item = cart.items.find(i => i.productId === id)
  if (item) cart.updateQuantity(id, item.quantity + 1)
}

const decrease = (id: number) => {
  const item = cart.items.find(i => i.productId === id)
  if (item && item.quantity > 1) {
    cart.updateQuantity(id, item.quantity - 1)
  }
}

const checkout = () => {
  router.push('/checkout') // kommt im nächsten Schritt
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">

    <h1 class="text-3xl font-bold mb-8">Warenkorb</h1>

    <!-- Leer -->
    <div v-if="!hasItems" class="text-gray-500">
      Dein Warenkorb ist leer.
    </div>

    <!-- Items -->
    <div v-else class="space-y-6">

      <div
        v-for="item in enrichedItems"
        :key="item.productId"
        class="flex items-center justify-between bg-gray-50 p-4 rounded-xl border"
      >
        <!-- Info -->
        <div class="flex items-center space-x-4">
          <img
            v-if="item.imagePath"
            :src="item.imagePath"
            class="w-20 h-20 object-cover rounded-lg"
          />

          <div>
            <h3 class="font-semibold text-lg">{{ item.name }}</h3>
            <p class="text-gray-500">{{ item.price.toFixed(2) }} €</p>
          </div>
        </div>

        <!-- Menge -->
        <div class="flex items-center space-x-3">
          <button
            @click="decrease(item.productId)"
            class="w-8 h-8 rounded-full border hover:bg-gray-200"
          >−</button>

          <span class="w-6 text-center">{{ item.quantity }}</span>

          <button
            @click="increase(item.productId)"
            class="w-8 h-8 rounded-full border hover:bg-gray-200"
          >+</button>
        </div>

        <!-- Summe + Löschen -->
        <div class="flex items-center space-x-6">
          <span class="font-semibold">
            {{ (item.price * item.quantity).toFixed(2) }} €
          </span>

          <button
            @click="cart.removeItem(item.productId)"
            class="text-red-600 hover:underline"
          >
            Entfernen
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center border-t pt-6 mt-8">
        <div class="text-xl font-bold">
          Gesamt: {{ cart.totalPrice.toFixed(2) }} €
        </div>

        <button
          @click="checkout"
          class="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium"
        >
          Zur Kasse
        </button>
      </div>

    </div>
  </div>
</template>
