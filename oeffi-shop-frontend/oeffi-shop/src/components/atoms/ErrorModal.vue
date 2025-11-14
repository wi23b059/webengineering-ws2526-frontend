<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
      <h2 class="text-xl font-bold mb-4 text-red-600">Fehler</h2>
      <p class="mb-4">{{ message }}</p>
      <button @click="$emit('close')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Schließen
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  message: { type: String, required: true }
})
</script>
