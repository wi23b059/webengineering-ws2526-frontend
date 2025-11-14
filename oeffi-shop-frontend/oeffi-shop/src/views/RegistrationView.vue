<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { registrationSchema } from "@/validation/registrationSchema";

// ---------------------------------------------
// Länderliste (DACH zuerst, dann alphabetisch)
// ---------------------------------------------
const allCountries = ["Austria", "Germany", "Switzerland", "France", "Spain", "Italy"];

const sortedCountries = computed(() => {
  const dach = ["Austria", "Germany", "Switzerland"];
  const rest = allCountries.filter((c) => !dach.includes(c)).sort();
  return [...dach, ...rest];
});

// ---------------------------------------------
// Form Reactive State
// ---------------------------------------------
const form = reactive({
  salutation: "",
  otherSalutation: "",
  email: "",
  username: "",
  password: "",
  repeatPassword: "",
  country: "",
});

// ---------------------------------------------
// Fehlerobjekt
// ---------------------------------------------
const errors = ref<Record<string, string>>({});

// ---------------------------------------------
// Registrierung starten
// ---------------------------------------------
async function registerUser() {
  errors.value = {};

  try {
    // 1. Frontend-Validierung via Yup
    const validData = await registrationSchema.validate(form, {
      abortEarly: false,
    });

    console.log("VALID:", validData);

    // 2. Beispiel: statische Mock-Prüfung (z. B. ob Username schon existiert)
    const existingUsernames = ["admin", "max", "test123"];
    if (existingUsernames.includes(form.username)) {
      errors.value.username = "Benutzername existiert bereits";
      return;
    }

    // 3. POST-Request an dein Backend
    const payload = {
      salutation: form.salutation,
      firstName: "Vorname fehlt noch",
      lastName: "Nachname fehlt noch",
      address: "Adresse fehlt noch",
      city: "Stadt fehlt noch",
      zip: "00000",
      email: form.email,
      username: form.username,
      password: form.password,
    };

    const response = await axios.post("http://localhost:8081/api/users", payload);

    console.log("User erfolgreich angelegt:", response.data);

    alert("Benutzer erfolgreich erstellt!");

  } catch (err: any) {
    if (err.inner) {
      // mehrere Yup-Fehler
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
            Benutzerkonto erstellen
          </h1>
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="salutation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Anrede</label>
              <select v-model="form.salutation" id="salutation" name="salutation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Anrede" required="">
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
              <input v-if="form.salutation === 'MX'" type="text" id="salutation_other" name="salutation_other" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Andere Anrede" required="">
              <p v-if="errors.otherSalutation" class="text-red-500">{{ errors.otherSalutation }}</p>
            </div>

            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-Mail-Adresse</label>
              <input v-model="form.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Deine E-Mail-Adresse" required="">
              <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input input v-model="form.username" type="text" name="username" id="username" placeholder="Username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
              <p v-if="errors.username" class="text-red-500">{{ errors.username }}</p>
            </div>

            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort</label>
              <input input v-model="form.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
              <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
            </div>

            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort bestätigen</label>
              <input v-model="form.repeatPassword" type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
              <p v-if="errors.repeatPassword" class="text-red-500">{{ errors.repeatPassword }}</p>
            </div>

            <div>
              <label for="country" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Land</label>
              <select v-model="form.country" id="country" name="country" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Land" required="">
                <option value="">Bitte auswählen</option>
                <option v-for="c in sortedCountries" :key="c" :value="c">{{ c }}</option>
              </select>
              <p v-if="errors.country" class="text-red-500">{{ errors.country }}</p>
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-slate-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-slate-600 dark:ring-offset-gray-800" required="">
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">Ich akzeptiere die <a class="font-medium text-slate-600 hover:underline dark:text-slate-500" href="#">AGBs</a></label>
              </div>
            </div>
            <button type="button" @click="registerUser" class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800">Konto erstellen</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Du hast schon ein Benutzerkonto? <router-link to="/login" class="font-medium text-slate-600 hover:underline dark:text-slate-500">Einloggen</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

