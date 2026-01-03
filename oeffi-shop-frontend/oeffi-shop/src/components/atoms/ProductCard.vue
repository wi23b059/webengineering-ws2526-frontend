<script setup lang="ts">
import { RouterLink } from "vue-router";

const props = defineProps({
  image: String,
  category: String,
  title: String,
  price: Number,
  description: String,
  link: { type: String, default: "#" },
});

// Bildloader für /src/docs/
const getImage = (filename?: string) => {
  if (!filename) return '/docs/fallback.png'

  const cleanName = filename.split('/').pop()
  return `/docs/${cleanName}`
};
</script>

<template>
  <div class="w-full max-w-sm bg-gray-50 p-6 border border-gray-200 rounded-xl shadow-sm">

    <!-- Bild -->
    <RouterLink :to="link">
      <img
        class="rounded-xl mb-6 w-full h-48 object-cover"
        :src="getImage(image)"
        :alt="title"
      />
    </RouterLink>

    <div>
      <!-- Kategorie + Sterne -->
      <div class="flex items-center space-x-3 mb-6">

        <!-- Kategorie Badge -->
        <span
          class="bg-slate-200 border border-slate-300 text-slate-800 text-xs font-medium px-1.5 py-0.5 rounded-sm"
        >
          {{ category }}
        </span>

        <!-- Sterne (Dummy 5/5) -->
        <div class="flex items-center space-x-1">
          <svg v-for="n in 5" :key="n" class="w-5 h-5 text-yellow-400" fill="currentColor"
               viewBox="0 0 24 24">
            <path
              d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
            />
          </svg>
        </div>
      </div>

      <!-- Titel -->
      <RouterLink :to="link">
        <h5 class="text-xl text-gray-900 font-semibold tracking-tight mb-2">
          {{ title }}
        </h5>
      </RouterLink>

      <!-- Beschreibung -->
      <p class="text-gray-600 text-sm mb-4">
        {{ description }}
      </p>

      <!-- Preis + Kaufen Button -->
      <div class="flex items-center justify-between mt-6">
        <span class="text-2xl font-bold text-gray-900">
          {{ price.toFixed(2) }} €
        </span>

        <RouterLink
          :to="link"
          class="inline-flex items-center text-white bg-slate-700 hover:bg-slate-800
                 border border-transparent focus:ring-4 focus:ring-slate-300
                 shadow-sm font-medium rounded-lg text-sm px-3 py-2"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
          </svg>
          Kaufen
        </RouterLink>
      </div>
    </div>

  </div>
</template>
