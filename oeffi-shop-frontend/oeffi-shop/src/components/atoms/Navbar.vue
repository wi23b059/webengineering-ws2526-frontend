<script setup lang="ts">
defineOptions({ name: 'SiteNavbar' });
import { RouterLink } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showDropdown = ref(false);
const avatarWrapper = ref<HTMLElement | null>(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function onDocClick(e: MouseEvent) {
  const target = e.target as Node;
  if (avatarWrapper.value && !avatarWrapper.value.contains(target)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
});
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="w-full max-w-screen-xl mx-auto p-4 flex items-center">
      <!-- LEFT: Logo -->
      <div class="flex-shrink-0">
        <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/src/docs/wiener-oeffis-logo.png" class="h-8" alt="Flowbite Logo" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Wiener Öffis</span>
        </RouterLink>
      </div>

      <!-- CENTER: Nav links (zentrales Flex-Item) -->
      <div class="hidden md:flex flex-1 justify-center md:order-1" id="navbar-user">
        <ul class="flex flex-row font-medium space-x-6">
          <li><RouterLink to="/" class="py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</RouterLink></li>
          <li><RouterLink to="/about" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Über uns</RouterLink></li>
          <li><RouterLink to="/products" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Produkte</RouterLink></li>
          <li><RouterLink to="/cart" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Warenkorb</RouterLink></li>
          <li><RouterLink to="/login" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Login</RouterLink></li>
          <li><RouterLink to="/registration" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Registrieren</RouterLink></li>
        </ul>
      </div>

      <!-- RIGHT: User menu / Avatar -->
      <div class="flex-shrink-0 flex items-center md:order-2 space-x-3">
        <div class="relative" ref="avatarWrapper">
          <button
            type="button"
            class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 z-50 relative cursor-pointer"
            id="user-menu-button"
            :aria-expanded="showDropdown.toString()"
            @click.stop="toggleDropdown"
          >
            <span class="sr-only">Mein Konto</span>
            <img class="w-8 h-8 rounded-full" src="/src/docs/I70A2681_resized.jpg" alt="user photo">
          </button>

          <!-- Dropdown: v-show steuert Sichtbarkeit; bleibt im DOM für bessere Positionierung -->
          <div
            v-show="showDropdown"
            class="z-50 absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
            id="user-dropdown"
          >
            <div class="px-4 py-3">
              <span class="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
              <span class="block text-sm text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
            </div>
            <ul class="py-2" aria-labelledby="user-menu-button">
              <li><RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Mein Profil</RouterLink></li>
              <li><RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Bestellungen</RouterLink></li>
              <li><RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Ausloggen</RouterLink></li>
            </ul>
          </div>
        </div>

        <!-- Mobile menu toggle -->
        <button data-collapse-toggle="navbar-user" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
          <span class="sr-only">Navigation ein-/ausklappen</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Optional: kleine Animation/Transition für Dropdown */
[v-cloak] { display: none; }
</style>
