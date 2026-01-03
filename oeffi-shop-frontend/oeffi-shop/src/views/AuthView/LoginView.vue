<script setup lang="ts">
import { ref, reactive } from 'vue'
import * as yup from 'yup'
import type { ValidationError } from 'yup'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.ts'

// Felder
const emailOrUsername = ref('')
const password = ref('')
const remember = ref(false)
const successMessage = ref<string | null>(null)

// Typ für mögliche Fehler-Felder
type LoginField = 'emailOrUsername' | 'password'
type Errors = Partial<Record<LoginField, string>>

// Errors als reactive Objekt mit korrekter Typisierung
const errors = reactive<Errors>({})

// yup schema
const loginSchema = yup.object({
  emailOrUsername: yup.string().required('Bitte E-Mail oder Username eingeben'),
  password: yup.string().required('Passwort wird benötigt').min(3, 'Mindestens 3 Zeichen')
})

const router = useRouter()
const auth = useAuthStore()

async function onSubmit() {
  // reset errors
  errors.emailOrUsername = undefined
  errors.password = undefined

  try {
    // validate
    await loginSchema.validate(
      {
        emailOrUsername: emailOrUsername.value,
        password: password.value
      },
      { abortEarly: false }
    )

    // call store login
    const res = await auth.login({
      emailOrUsername: emailOrUsername.value,
      password: password.value,
      remember: remember.value
    })

    if (res.ok) {
      successMessage.value = 'Erfolgreich eingeloggt 🎉'
      setTimeout(() => {
        router.push({ name: 'HomeView' }).catch(() => {})
      }, 1200)
    } else {
      // serverseitige Fehlermeldung wird bereits in auth.error angezeigt
      // optional: feld-spezifisch parsen, falls das Backend field errors zurückliefert
    }
  } catch (err: unknown) {
    // Yup validation errors — typsicher behandeln
    if (err instanceof yup.ValidationError) {
      const ve = err as ValidationError
      // ve.inner ist ein Array von ValidationError, jedes mit path & message
      ve.inner.forEach((e) => {
        const path = e.path as LoginField | undefined
        if (path) {
          errors[path] = e.message
        }
      })
    } else if (err instanceof Error) {
      // Sonstige Fehler (z.B. unerwartet)
      console.error('Unbekannter Fehler beim Validieren:', err.message)
    } else {
      console.error('Unbekannter Fehler beim Validieren (non-Error):', err)
    }
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Einloggen
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-Mail-Adresse oder Username</label>
              <input
                v-model="emailOrUsername"
                type="text"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Deine E-Mail-Adresse oder Username"
              />
              <p v-if="errors.emailOrUsername" class="text-red-500 text-sm">
                {{ errors.emailOrUsername }}
              </p>
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort</label>
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <p v-if="errors.password" class="text-red-500 text-sm">
                {{ errors.password }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    v-model="remember"
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-slate-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-slate-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300">Eingeloggt bleiben</label>
                </div>
              </div>
              <a href="#" class="text-sm font-medium text-slate-600 hover:underline dark:text-slate-500">Passwort vergessen?</a>
            </div>

            <button
              type="submit"
              class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
              :disabled="auth.loading"
            >
              <span v-if="!auth.loading">Einloggen</span>
              <span v-else>... lade</span>
            </button>

            <p
              v-if="successMessage"
              class="text-green-600 text-sm mt-2 text-center"
            >
              {{ successMessage }}
            </p>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Noch kein Konto? <router-link to="/registration" class="font-medium text-slate-600 hover:underline dark:text-slate-500">Registrieren</router-link>
            </p>

            <p v-if="auth.error" class="text-red-500 text-sm mt-2">{{ auth.error }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style>

</style>
