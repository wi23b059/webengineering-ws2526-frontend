<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <RouterLink to="/" class="hover:underline">Wiener Öffis GmbH</RouterLink>. Alle Rechte vorbehalten.
    </span>
      <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <RouterLink to="/help" class="hover:underline me-4 md:me-6">Hilfe</RouterLink>
        </li>
        <li>
          <RouterLink to="/" class="hover:underline me-4 md:me-6">AGBs</RouterLink>
        </li>
        <li>
          <RouterLink to="/imprint" class="hover:underline me-4 md:me-6">Impressum</RouterLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>

</style>
