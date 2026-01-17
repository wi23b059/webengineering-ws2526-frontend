<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '@/services/api.ts'
import * as yup from 'yup'
import { reactive } from 'vue'
import { accountSchema } from '@/validation/accountSchema'
import { passwordSchema } from '@/validation/passwordSchema'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  repeatNewPassword: ''
})

type PasswordKeys = keyof typeof passwordForm
const passwordErrors = reactive<Partial<Record<PasswordKeys, string>>>({})

// Lade Daten beim Mount
onMounted(async () => {
  const restored = authStore.restoreFromStorage()
  if (restored) {
    await authStore.fetchMe() // holt die Userdaten
    if (authStore.user && authStore.token) {
      await userStore.loadUser(authStore.user.id, authStore.token)
    }
  }
})

// Speichern
function saveUser() {
  if (!authStore.token) return
  userStore.saveUser(authStore.token)
}

async function confirmDeleteUser() {
  if (!authStore.token) return

  const confirmed = window.confirm(
    'Bist du sicher, dass du dein Benutzerkonto endgültig löschen möchtest?\n\nDiese Aktion kann nicht rückgängig gemacht werden!'
  )

  if (!confirmed) return

  await userStore.deleteUser(authStore.token)

  // Nach erfolgreichem Löschen: Logout + Redirect
  authStore.logout()
  await router.push('/login')
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    userStore.profileFile = target.files[0]
  }
}

const userImageUrl = computed(() => {
  if (userStore.profileFile) {
    return URL.createObjectURL(userStore.profileFile)
  }
  if (userStore.user.profilePicturePath) {
    return userStore.getUserImageUrl(userStore.user)
  }
  return `${API_BASE_URL}/api/files/fallback.png`
})

async function changePassword() {
  if (!authStore.token) return

  // Fehler zurücksetzen
  Object.keys(passwordErrors).forEach(
    key => delete passwordErrors[key as PasswordKeys]
  )

  try {
    await passwordSchema.validate(passwordForm, {
      abortEarly: false
    })

    await userStore.changePassword(
      authStore.token,
      passwordForm.currentPassword,
      passwordForm.newPassword
    )

    // Felder leeren
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.repeatNewPassword = ''
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach(e => {
        if (e.path) {
          passwordErrors[e.path as PasswordKeys] = e.message
        }
      })
    }
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:p-10">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Benutzerinformationen</h1>

      <!-- Success / Error -->
      <div v-if="userStore.successMessage" class="mb-4 rounded-lg bg-green-100 border border-green-400 p-4 text-green-700 text-sm">
        {{ userStore.successMessage }}
      </div>
      <div v-if="userStore.errorMessage" class="mb-4 rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm">
        {{ userStore.errorMessage }}
      </div>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-6" @submit.prevent="saveUser">
        <!-- Profilbild -->
        <div class="md:col-span-2">
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Profilbild
          </label>

          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            @change="onFileChange"
            class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />

          <div
            v-if="userStore.profileFile || userStore.user.profilePicturePath"
            class="mt-4"
          >
            <img
              :src="userImageUrl"
              alt="Profilbild Vorschau"
              class="h-32 w-auto rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <!-- ID readonly -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">ID</label>
          <input type="text" v-model="userStore.user.id" readonly class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Salutation -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Anrede</label>
          <select v-model="userStore.user.salutation" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Bitte auswählen</option>
            <option value="MR">Herr</option>
            <option value="MS">Frau</option>
            <option value="MRS">Fräulein</option>
            <option value="MX">Divers</option>
          </select>
        </div>

        <!-- Optionales anderes Salutation-Feld -->
        <div v-if="userStore.user.salutation === 'MX'">
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Andere Anrede</label>
          <input type="text" v-model="userStore.otherSalutation" placeholder="Andere Anrede" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Vorname -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Vorname</label>
          <input type="text" v-model="userStore.user.firstName" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Nachname -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Nachname</label>
          <input type="text" v-model="userStore.user.lastName" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Land -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Land (ISO 2)</label>
          <input type="text" v-model="userStore.user.countryCode" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Adresse -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Adresse</label>
          <input type="text" v-model="userStore.user.address" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- PLZ -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">PLZ</label>
          <input type="text" v-model="userStore.user.zip" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Stadt -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Stadt</label>
          <input type="text" v-model="userStore.user.city" class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Email readonly -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">E-Mail</label>
          <input type="email" v-model="userStore.user.email" readonly class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Username readonly -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Username</label>
          <input type="text" v-model="userStore.user.username" readonly class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Rolle readonly -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Rolle</label>
          <input type="text" v-model="userStore.user.role" readonly class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>

        <!-- Status readonly -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <input type="text" v-model="userStore.user.status" readonly class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"/>
        </div>
      </form>

      <div class="mt-6 flex gap-4">
        <button
          @click="saveUser"
          class="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
        >
          Änderungen speichern
        </button>

        <button
          @click="confirmDeleteUser"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Benutzerkonto löschen
        </button>
      </div>
      <hr class="my-10 border-gray-300 dark:border-gray-600" />

      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Passwort ändern
      </h2>

      <form
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
        @submit.prevent="changePassword"
      >
        <!-- Aktuelles Passwort -->
        <div class="md:col-span-2">
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Aktuelles Passwort
          </label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            autocomplete="current-password"
            class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <p v-if="passwordErrors.currentPassword" class="text-red-500 text-sm mt-1">
            {{ passwordErrors.currentPassword }}
          </p>
        </div>

        <!-- Neues Passwort -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Neues Passwort
          </label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            autocomplete="new-password"
            class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <p v-if="passwordErrors.newPassword" class="text-red-500 text-sm mt-1">
            {{ passwordErrors.newPassword }}
          </p>
        </div>

        <!-- Passwort bestätigen -->
        <div>
          <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Neues Passwort bestätigen
          </label>
          <input
            v-model="passwordForm.repeatNewPassword"
            type="password"
            autocomplete="new-password"
            class="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <p
            v-if="passwordErrors.repeatNewPassword"
            class="text-red-500 text-sm mt-1"
          >
            {{ passwordErrors.repeatNewPassword }}
          </p>
        </div>

        <!-- Submit -->
        <div class="md:col-span-2">
          <button
            type="submit"
            class="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
          >
            Passwort ändern
          </button>
        </div>
      </form>
    </div>
  </section>



</template>
