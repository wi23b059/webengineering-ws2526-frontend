<script setup lang="ts">
defineOptions({ name: 'SiteNavbar' });
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'

const showDropdown = ref(false);
const showProductsDropdown = ref(false)
const showUsersDropdown = ref(false)
const avatarWrapper = ref<HTMLElement | null>(null);
const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.user?.role === 'ADMIN')
const router = useRouter()
const displayName = computed(() => auth.fullName)
const email = computed(() => auth.user?.email)

const avatarUrl = computed(() => {
  return auth.user?.profilePicturePath
    ? `/public/docs/${auth.user.profilePicturePath}`
    : '/public/docs/test_1.png'
})

function onLogout() {
  const confirmed = window.confirm('Möchtest du dich wirklich ausloggen?')

  if (confirmed) {
    auth.logout()
    showDropdown.value = false
    router.push('/login')
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function toggleProductsDropdown() {
  showProductsDropdown.value = !showProductsDropdown.value
  showUsersDropdown.value = false
}

function toggleUsersDropdown() {
  showUsersDropdown.value = !showUsersDropdown.value
  showProductsDropdown.value = false
}

function closeAdminDropdowns() {
  showProductsDropdown.value = false
  showUsersDropdown.value = false
}

function onDocClick(e: MouseEvent) {
  const target = e.target as Node;
  if (avatarWrapper.value && !avatarWrapper.value.contains(target)) {
    return
  }
  closeDropdown()
  closeAdminDropdowns()
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
          <img src="/src/docs/wiener-oeffis-logo.png" class="h-8" alt="Wiener Öffis Logo" />
        </RouterLink>
      </div>

      <!-- CENTER: Nav links (zentrales Flex-Item) -->
      <div class="hidden md:flex flex-1 justify-center md:order-1" id="navbar-user">
        <ul class="flex flex-row font-medium space-x-6">
          <li><RouterLink to="/" class="py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</RouterLink></li>
          <li><RouterLink to="/about" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Über uns</RouterLink></li>
          <li><RouterLink to="/products" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Produkte</RouterLink></li>
          <li><RouterLink to="/cart" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Warenkorb</RouterLink></li>
          <li v-if="!isLoggedIn"><RouterLink to="/login" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Login</RouterLink></li>
          <li v-if="!isLoggedIn"><RouterLink to="/registration" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Registrieren</RouterLink></li>
          <li
            v-if="isLoggedIn && isAdmin"
            class="relative"
          >
            <button
              @click.stop="toggleProductsDropdown"
              class="flex items-center py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white"
            >
              Produkte
              <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
              </svg>
            </button>

            <div
              v-show="showProductsDropdown"
              class="absolute z-40 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-md"
            >
              <RouterLink
                to="/admin/products"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                @click="closeAdminDropdowns"
              >
                Produktübersicht
              </RouterLink>

              <RouterLink
                to="/admin/products/create"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                @click="closeAdminDropdowns"
              >
                Produkt erstellen
              </RouterLink>
            </div>
          </li>
          <li v-if="isLoggedIn && isAdmin"><RouterLink to="/admin/users" class="py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white">Benutzerübersicht</RouterLink></li>
        </ul>
      </div>

      <!-- RIGHT: User menu / Avatar -->
      <div
        v-if="isLoggedIn"
        class="flex-shrink-0 flex items-center md:order-2 space-x-3">
        <div class="relative" ref="avatarWrapper">
          <button
            type="button"
            class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 z-50 relative cursor-pointer"
            id="user-menu-button"
            :aria-expanded="showDropdown.toString()"
            @click.stop="toggleDropdown"
          >
            <span class="sr-only">Mein Konto</span>
            <img
              class="w-8 h-8 rounded-full object-cover"
              :src="avatarUrl"
              alt="User Avatar"
            >
          </button>

          <!-- Dropdown: v-show steuert Sichtbarkeit; bleibt im DOM für bessere Positionierung -->
          <div
            v-show="showDropdown"
            class="z-50 absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
            id="user-dropdown"
          >
            <div class="px-4 py-3">
              <span class="block text-sm text-gray-900 dark:text-white">
                {{ displayName }}
              </span>
              <span class="block text-sm text-gray-500 truncate dark:text-gray-400">
                {{ email }}
              </span>
            </div>
            <ul class="py-2" aria-labelledby="user-menu-button">
              <li><RouterLink to="/user-account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Mein Profil</RouterLink></li>
              <li><RouterLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200">Bestellungen</RouterLink></li>
              <li>
                <button
                  @click="onLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  Ausloggen
                </button>
              </li>
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
