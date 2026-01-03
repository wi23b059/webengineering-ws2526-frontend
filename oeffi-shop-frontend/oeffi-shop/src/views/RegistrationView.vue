<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import * as yup from 'yup'
import type { ValidationError } from 'yup'
import { registrationSchema } from '@/validation/registrationSchema'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const successMessage = ref<string | null>(null)
const userStore = useUserStore()

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string>
}

// ---------------------------------------------
// Salutation mappen
// ---------------------------------------------
function getSalutationValue(): 'MR' | 'MS' | 'MRS' | 'MX' {
  if (form.salutation === 'MX') return 'MX'
  if (form.salutation === 'MRS') return 'MRS'
  if (form.salutation === 'MS') return 'MS'
  return 'MR'
}

// ---------------------------------------------
// Länderliste (DACH zuerst, dann alphabetisch)
// ---------------------------------------------
const allCountries = ['Austria', 'Germany', 'Switzerland', 'France', 'Spain', 'Italy']
const countryMap: Record<string, string> = {
  Austria: 'AT',
  Germany: 'DE',
  Switzerland: 'CH',
  France: 'FR',
  Spain: 'ES',
  Italy: 'IT'
}

const sortedCountries = computed(() => {
  const dach = ['Austria', 'Germany', 'Switzerland']
  const rest = allCountries.filter((c) => !dach.includes(c)).sort()
  return [...dach, ...rest]
})

// ---------------------------------------------
// Form Reactive State
// ---------------------------------------------
const form = reactive({
  salutation: '',
  otherSalutation: '',
  email: '',
  username: '',
  password: '',
  repeatPassword: '',
  country: ''
})

// ---------------------------------------------
// Fehlerobjekt - typsicher
// ---------------------------------------------
type FormKeys = keyof typeof form
const errors = reactive<Partial<Record<FormKeys, string>>>({})

// ---------------------------------------------
// Terms checkbox
// ---------------------------------------------
const agreeTerms = ref(false)

// ---------------------------------------------
// Registrierung starten
// ---------------------------------------------
async function registerUser() {
  // reset errors
  (Object.keys(errors) as FormKeys[]).forEach((k) => {
    delete errors[k]
  })
  // Frontend-Validierung via Yup
  const validData = await registrationSchema.validate(form, {
    abortEarly: false
  })

  console.log('VALID:', validData)

  // Formularwerte in den Store kopieren
  Object.assign(userStore.user, {
    salutation: getSalutationValue(),
    firstName: 'Vorname',
    lastName: 'Nachname',
    countryCode: countryMap[form.country],
    address: 'Adresse',
    city: 'Stadt',
    zip: '0000',
    email: form.email,
    username: form.username,
  })

  if (form.salutation === 'MX') {
    userStore.otherSalutation = form.otherSalutation
  }

  // User über den Store erstellen
  if (!agreeTerms.value) {
    errors.otherSalutation = 'Bitte akzeptieren Sie die AGBs'
    return
  }

  const success = await userStore.createUser(form.password)
  if (success) {
    successMessage.value = 'Benutzer erfolgreich erstellt!'
    console.log('User erfolgreich angelegt:', userStore.user)
    setTimeout(() => router.push('/login'), 1200)
  } else {
    errors.otherSalutation = userStore.errorMessage || 'Fehler bei der Registrierung'
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Benutzerkonto erstellen
          </h1>

          <div
            v-if="successMessage"
            class="mb-4 rounded-lg bg-green-100 border border-green-400 p-4 text-green-700 text-sm"
          >
            {{ successMessage }}
          </div>

          <form class="space-y-4 md:space-y-6" @submit.prevent="registerUser">
            <div>
              <label for="salutation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Anrede</label>
              <select v-model="form.salutation" id="salutation" name="salutation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Bitte auswählen</option>
                <option value="MR">Herr</option>
                <option value="MS">Frau</option>
                <option value="MRS">Fräulein</option>
                <option value="MX">Divers</option>
              </select>
              <p v-if="errors.salutation" class="text-red-500">{{ errors.salutation }}</p>
            </div>

            <div v-if="form.salutation === 'MX'">
              <label for="salutation_other" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Andere Anrede</label>
              <input v-model="form.otherSalutation" type="text" id="salutation_other" name="salutation_other" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Andere Anrede" maxlength="30" required />
              <p v-if="errors.otherSalutation" class="text-red-500">{{ errors.otherSalutation }}</p>
            </div>

            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-Mail-Adresse</label>
              <input v-model="form.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Deine E-Mail-Adresse" required />
              <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input v-model="form.username" type="text" name="username" id="username" placeholder="Username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              <p v-if="errors.username" class="text-red-500">{{ errors.username }}</p>
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort</label>
              <input v-model="form.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
            </div>

            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort bestätigen</label>
              <input v-model="form.repeatPassword" type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              <p v-if="errors.repeatPassword" class="text-red-500">{{ errors.repeatPassword }}</p>
            </div>

            <div>
              <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Land</label>
              <select v-model="form.country" id="country" name="country" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Bitte auswählen</option>
                <option v-for="c in sortedCountries" :key="c" :value="c">{{ c }}</option>
              </select>
              <p v-if="errors.country" class="text-red-500">{{ errors.country }}</p>
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input v-model="agreeTerms" id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-slate-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-slate-600 dark:ring-offset-gray-800" />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">Ich akzeptiere die <a class="font-medium text-slate-600 hover:underline dark:text-slate-500" href="#">AGBs</a></label>
              </div>
            </div>

            <button type="submit" class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800">Konto erstellen</button>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Du hast schon ein Benutzerkonto? <router-link to="/login" class="font-medium text-slate-600 hover:underline dark:text-slate-500">Einloggen</router-link>
            </p>

            <!-- globale Fehlermeldung -->
            <p v-if="errors.otherSalutation" class="text-red-500 mt-2">{{ errors.otherSalutation }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
