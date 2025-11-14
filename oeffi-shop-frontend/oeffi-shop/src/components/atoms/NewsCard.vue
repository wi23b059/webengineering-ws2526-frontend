<script setup>
import {RouterLink} from "vue-router";

defineProps({
  image:    { type: String, required: true },
  category: { type: String, required: true },
  title:    { type: String, required: true },
  link:     { type: String, default: '#' }
});
</script>

<template>
  <div class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm max-w-sm mx-auto overflow-hidden">
    <!-- Bild -->
    <RouterLink :to="link">
      <img class="w-full h-48 object-cover rounded-t-xl" :src="image" :alt="title" />
    </RouterLink>

    <div class="p-6 text-center">
      <!-- Badge -->
      <span class="inline-flex items-center bg-slate-200 text-slate-800 text-xs font-semibold px-2 py-1 rounded-sm mb-3">
        <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.122 17.645a7.185 7.185 0 0 1-2.656 2.495 7.06 7.06 0 0 1-3.52.853 6.617 6.617 0 0 1-3.306-.718 6.73 6.73 0 0 1-2.54-2.266c-2.672-4.57.287-8.846.887-9.668A4.448 4.448 0 0 0 8.07 6.31 4.49 4.49 0 0 0 7.997 4c1.284.965 6.43 3.258 5.525 10.631 1.496-1.136 2.7-3.046 2.846-6.216 1.43 1.061 3.985 5.462 1.754 9.23Z"/>
        </svg>
        {{ category }}
      </span>

      <!-- Titel -->
      <RouterLink :to="link">
        <h5 class="text-2xl font-semibold mb-4 text-gray-900">{{ title }}</h5>
      </RouterLink>

      <!-- Button -->
        <RouterLink :to="link"
        class="inline-flex items-center justify-center text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-sm px-4 py-2.5 shadow"
        >
        Weiterlesen
        <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
        </svg>
        </RouterLink>
    </div>
  </div>
</template>

<style scoped>
</style>
