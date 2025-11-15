<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import ProductCard from "@/components/atoms/ProductCard.vue";

const products = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);

const API = "http://localhost:8081/api";

const loadCategories = async () => {
  const res = await axios.get(`${API}/categories`);
  categories.value = res.data;
};

const loadProducts = async () => {
  const url = selectedCategory.value
    ? `${API}/products?category=${selectedCategory.value}`
    : `${API}/products`;

  const res = await axios.get(url);
  products.value = res.data;
};

const changeCategory = (id) => {
  selectedCategory.value = id;
  loadProducts();
};

onMounted(() => {
  loadCategories();
  loadProducts();
});
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
            selectedCategory === null
              ? 'bg-slate-700 text-white'
              : 'bg-white text-gray-700'
          ]"
        >
          Alle
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="changeCategory(cat.id)"
          :class="[
            'px-4 py-2 rounded-full border shadow-sm transition text-sm',
            selectedCategory === cat.id
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
          v-for="p in products"
          :key="p.id"
          :image="p.imagePath"
        :category="categories.find(c => c.id === p.category_id)?.name"
        :title="p.name"
        :description="p.description"
        :price="p.price"
        :link="'/products/' + p.id"
        >
        </ProductCard>
      </div>
    </div>
  </section>
</template>
