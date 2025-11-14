<script setup lang="ts">
import { ref } from "vue";
import * as yup from "yup";
import axios from "axios";

// ------------------------------------------------------
// 1. STATIC MOCK USERS
// ------------------------------------------------------
const mockUsers = [
  {
    id: 1,
    username: "testuser",
    email: "test@test.com",
    password: "1234"
  },
  {
    id: 2,
    username: "max",
    email: "max@example.com",
    password: "passwort"
  }
];

// ------------------------------------------------------
// 2. FORM DATA
// ------------------------------------------------------
const emailOrUsername = ref("");
const password = ref("");
const remember = ref(false);

const errors = ref<{ emailOrUsername?: string; password?: string }>({});

// ------------------------------------------------------
// 3. YUP VALIDATION SCHEMA
// ------------------------------------------------------
const loginSchema = yup.object({
  emailOrUsername: yup
    .string()
    .required("Bitte E-Mail oder Username eingeben"),
  password: yup.string().required("Passwort wird benötigt").min(3)
});

// ------------------------------------------------------
// 4. LOGIN FUNCTION
// ------------------------------------------------------
async function login() {
  errors.value = {}; // reset

  try {
    // Validate form via yup
    await loginSchema.validate(
      {
        emailOrUsername: emailOrUsername.value,
        password: password.value
      },
      { abortEarly: false }
    );

    // Find user by email OR username
    const user = mockUsers.find(
      (u) =>
        u.email === emailOrUsername.value ||
        u.username === emailOrUsername.value
    );

    if (!user) {
      errors.value.emailOrUsername = "Benutzer nicht gefunden.";
      return;
    }

    if (user.password !== password.value) {
      errors.value.password = "Passwort ist falsch.";
      return;
    }

    // ------------------------------------------------------
    // Simulierter API-Call (axios)
    // ------------------------------------------------------
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users/1"
    );

    console.log("Login erfolgreich");
    console.log("Eingeloggter User:", user);
    console.log("Axios-Test:", response.data);

    // Weiterleitung möglich …
    // router.push('/dashboard');

  } catch (err: any) {
    if (err.inner) {
      // yup validation errors
      err.inner.forEach((e: any) => {
        errors.value[e.path] = e.message;
      });
    } else {
      console.error(err);
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
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-Mail-Adresse</label>
              <input
                v-model="emailOrUsername"
                type="text"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Deine E-Mail-Adresse"
                required=""
              >
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
                required=""
              >
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
                    required=""
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300">Eingeloggt bleiben</label>
                </div>
              </div>
              <a href="#" class="text-sm font-medium text-slate-600 hover:underline dark:text-slate-500">Passwort vergessen?</a>
            </div>
            <button
                    type="button"
                    class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                    @click="login"
            >
              Einloggen
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Noch kein Konto? <router-link to="/registration" class="font-medium text-slate-600 hover:underline dark:text-slate-500">Registrieren</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style>

</style>
