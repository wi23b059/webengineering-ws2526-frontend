<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore, Product } from '@/stores/productStore'

const router = useRouter()
const productStore = useProductStore()

// Formular für neues Produkt
const productForm = ref<Product>({
  id: 0,
  name: '',
  description: '',
  price: 0,
  rating: '',
  imagePath: '',
  categoryId: undefined,
  categoryName: '',
})

const successMessage = ref('')
const errorMessage = ref('')

async function createProduct() {
  try {
    const resp = await productStore.saveProduct(productForm.value, true)
    if (resp) {
      successMessage.value = 'Produkt erfolgreich erstellt.'
      errorMessage.value = ''
      router.push('/admin/products')
    } else {
      errorMessage.value = productStore.errorMessage
      successMessage.value = ''
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Fehler beim Erstellen des Produkts.'
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Neues Produkt erstellen
          </h1>

          <!-- Erfolg- und Fehlermeldungen -->
          <div v-if="successMessage" class="mb-4 rounded-lg bg-green-100 border border-green-400 p-4 text-green-700 text-sm">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm">
            {{ errorMessage }}
          </div>

          <form class="space-y-4 md:space-y-6" @submit.prevent="createProduct">
            <!-- Name -->
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
              <input v-model="productForm.name" type="text" id="name" name="name" placeholder="Produktname"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>

            <!-- Beschreibung -->
            <div>
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Beschreibung</label>
              <textarea v-model="productForm.description" id="description" name="description" placeholder="Produktbeschreibung"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required></textarea>
            </div>

            <!-- Preis -->
            <div>
              <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Preis (€)</label>
              <input v-model.number="productForm.price" type="number" step="0.01" id="price" name="price" placeholder="0.00"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>

            <!-- Rating -->
            <div>
              <label for="rating" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
              <input v-model="productForm.rating" type="text" id="rating" name="rating" placeholder="z.B. 4.5"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <!-- Image Path -->
            <div>
              <label for="imagePath" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profilbild-Pfad</label>
              <input v-model="productForm.imagePath" type="text" id="imagePath" name="imagePath" placeholder="Pfad zum Bild"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <!-- Kategorie ID -->
            <div>
              <label for="categoryId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategorie-ID</label>
              <input v-model.number="productForm.categoryId" type="number" id="categoryId" name="categoryId" placeholder="0"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <!-- Submit Button -->
            <button type="submit"
                    class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800">
              Produkt erstellen
            </button>

            <!-- Link zurück -->
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
              Zurück zur <router-link to="/admin/products" class="font-medium text-slate-600 hover:underline dark:text-slate-500">Produktübersicht</router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
