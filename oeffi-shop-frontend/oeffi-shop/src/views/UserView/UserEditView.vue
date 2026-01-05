<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const token = authStore.token

onMounted(async () => {
  // Schritt 2a: AuthUser laden
  if (!authStore.user && token) {
    await authStore.fetchMe()   // <-- hier await hinzufügen
  }

  // Schritt 2b: Userdaten laden
  const id = route.params.id as string
  if (id && token) {
    await userStore.fetchUserById(id, token)
  }
})

async function save() {
  if (!token) return
  await userStore.saveUser(token)
}

function goBack() {
  router.push('/admin/users')
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Benutzer bearbeiten</h1>

      <!-- Success / Error -->
      <div v-if="userStore.successMessage" class="mb-4 bg-green-100 border border-green-400 p-4 text-green-700 rounded">{{ userStore.successMessage }}</div>
      <div v-if="userStore.errorMessage" class="mb-4 bg-red-100 border border-red-400 p-4 text-red-700 rounded">{{ userStore.errorMessage }}</div>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="save">

        <!-- ID readonly -->
        <div>
          <label>ID</label>
          <input type="text" v-model="userStore.user.id" readonly class="w-full p-2 border rounded bg-gray-100"/>
        </div>

        <!-- Vorname / Nachname / Adresse / etc. -->
        <div>
          <label>Vorname</label>
          <input type="text" v-model="userStore.user.firstName" class="w-full p-2 border rounded"/>
        </div>
        <div>
          <label>Nachname</label>
          <input type="text" v-model="userStore.user.lastName" class="w-full p-2 border rounded"/>
        </div>

        <!-- Land / PLZ / Stadt / Adresse -->
        <div>
          <label>Land</label>
          <input type="text" v-model="userStore.user.countryCode" class="w-full p-2 border rounded"/>
        </div>
        <div>
          <label>Adresse</label>
          <input type="text" v-model="userStore.user.address" class="w-full p-2 border rounded"/>
        </div>
        <div>
          <label>PLZ</label>
          <input type="text" v-model="userStore.user.zip" class="w-full p-2 border rounded"/>
        </div>
        <div>
          <label>Stadt</label>
          <input type="text" v-model="userStore.user.city" class="w-full p-2 border rounded"/>
        </div>

        <!-- Admin-only Felder -->
        <div v-if="authStore.isAdmin">
          <label>Email</label>
          <input type="email" v-model="userStore.user.email" class="w-full p-2 border rounded"/>
        </div>

        <div v-if="authStore.isAdmin">
          <label>Username</label>
          <input type="text" v-model="userStore.user.username" class="w-full p-2 border rounded"/>
        </div>

        <div v-if="authStore.isAdmin">
          <label>Rolle</label>
          <select v-model="userStore.user.role" class="w-full p-2 border rounded">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div v-if="authStore.isAdmin">
          <label>Status</label>
          <select v-model="userStore.user.status" class="w-full p-2 border rounded">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BANNED">Banned</option>
            <option value="DELETED">Deleted</option>
          </select>
        </div>

        <div v-if="authStore.isAdmin">
          <label>Passwort (optional)</label>
          <input
            type="password"
            v-model="userStore.password"
            placeholder="Neues Passwort eingeben"
            class="w-full p-2 border rounded"
          />
          <p class="text-sm text-gray-500">Lassen Sie das Feld leer, wenn Sie das Passwort nicht ändern möchten.</p>
        </div>

      </form>

      <div class="mt-6 flex gap-4">
        <button @click="save" class="px-6 py-2 bg-slate-600 text-white rounded">Speichern</button>
        <button @click="goBack" class="px-6 py-2 bg-gray-400 text-white rounded">Zurück</button>
      </div>
    </div>
  </section>
</template>
