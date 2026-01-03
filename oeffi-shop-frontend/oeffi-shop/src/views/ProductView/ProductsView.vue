<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import ProductCard from '@/components/atoms/ProductCard.vue'

const store = useProductStore()

onMounted(() => {
  store.fetchCategories()
  store.fetchProductsByCategory(null)
})

function changeCategory(id: number | null) {
  store.selectedCategory = id
  store.fetchProductsByCategory(id)
}
</script>

<template>
  <section class="py-12 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8 text-gray-900 text-center lg:text-left">
        Tickets der Wiener Öffis
      </h2>

      <!-- Kategorien Filter -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          @click="changeCategory(null)"
          :class="[
            'px-4 py-2 rounded-full border shadow-sm transition text-sm',
            store.selectedCategory === null
              ? 'bg-slate-700 text-white'
              : 'bg-white text-gray-700'
          ]"
        >
          Alle
        </button>

        <button
          v-for="cat in store.categories"
          :key="cat.id"
          @click="changeCategory(cat.id)"
          :class="[
            'px-4 py-2 rounded-full border shadow-sm transition text-sm',
            store.selectedCategory === cat.id
              ? 'bg-slate-700 text-white'
              : 'bg-white text-gray-700'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Produkte -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          v-for="p in store.products"
          :key="p.id"
          :image="p.imagePath"
        :category="p.categoryName"
        :title="p.name"
        :description="p.description"
        :price="p.price"
        :link="'/products/' + p.id"
        />
      </div>
    </div>
  </section>
</template>
