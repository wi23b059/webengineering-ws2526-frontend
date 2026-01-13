<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const token =
  localStorage.getItem('auth_token') ??
  sessionStorage.getItem('auth_token')

onMounted(async () => {
  const id = route.params.id as string
  if (id && token) {
    await userStore.fetchUserById(id, token)
  }
})

function goToEdit() {
  router.push(`/admin/users/${route.params.id}`)
}

const profileImageUrl = computed(() => {
  return userStore.getUserImageUrl(userStore.user)
})
</script>

<template>
  <section
    class="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8"
  >
    <div class="w-full bg-white rounded-lg shadow sm:max-w-xl dark:bg-gray-800">
      <div class="p-6 space-y-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Benutzerdetails
        </h1>

        <!-- Lade- / Fehlerzustände -->
        <div v-if="userStore.loading">Lade Benutzer…</div>

        <div
          v-if="userStore.errorMessage"
          class="bg-red-100 border border-red-400 p-3 text-red-700 rounded"
        >
          {{ userStore.errorMessage }}
        </div>

        <div v-if="userStore.user.id" class="space-y-3">
          <div><span class="font-semibold">ID:</span> {{ userStore.user.id }}</div>
          <div><span class="font-semibold">Anrede:</span> {{ userStore.user.salutation }}</div>
          <div><span class="font-semibold">Vorname:</span> {{ userStore.user.firstName }}</div>
          <div><span class="font-semibold">Nachname:</span> {{ userStore.user.lastName }}</div>
          <div><span class="font-semibold">E-Mail:</span> {{ userStore.user.email }}</div>
          <div><span class="font-semibold">Username:</span> {{ userStore.user.username }}</div>
          <div><span class="font-semibold">Adresse:</span> {{ userStore.user.address }}</div>
          <div><span class="font-semibold">PLZ:</span> {{ userStore.user.zip }}</div>
          <div><span class="font-semibold">Stadt:</span> {{ userStore.user.city }}</div>
          <div><span class="font-semibold">Land:</span> {{ userStore.user.countryCode }}</div>
          <div><span class="font-semibold">Rolle:</span> {{ userStore.user.role }}</div>
          <div>
            <span class="font-semibold">Status:</span>
            <span
              :class="{
                'text-green-600': userStore.user.status === 'ACTIVE',
                'text-yellow-600': userStore.user.status === 'INACTIVE',
                'text-red-600': userStore.user.status === 'BANNED',
                'text-gray-400': userStore.user.status === 'DELETED'
              }"
            >
              {{ userStore.user.status }}
            </span>
          </div>

          <div v-if="profileImageUrl && profileImageUrl !== ''">
            <span class="font-semibold">Profilbild:</span>
            <img :src="profileImageUrl" class="mt-2 rounded max-h-48 border" alt="Profilbild" />
          </div>

          <!-- Aktionen -->
          <div class="flex gap-3 pt-4">
            <button
              @click="goToEdit"
              class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Bearbeiten
            </button>
          </div>

          <p class="text-sm text-gray-500 mt-2">
            Zurück zur
            <router-link
              to="/admin/users"
              class="font-medium text-slate-600 hover:underline"
            >
              Benutzerübersicht
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
