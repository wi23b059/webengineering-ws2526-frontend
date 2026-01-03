<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Produkt löschen
      </h2>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Möchtest du dieses Produkt wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.
      </p>

      <div class="flex justify-end space-x-3">
        <button
          class="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
          @click="emit('cancel')"
        >
          Abbrechen
        </button>

        <button
          class="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
          @click="emit('confirm')"
        >
          Löschen
        </button>
      </div>
    </div>
  </div>
</template>
