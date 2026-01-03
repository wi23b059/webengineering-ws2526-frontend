<script setup lang="ts">
import { onMounted, ref , computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore.ts'
import type { Product } from '@/stores/productStore.ts'
import { API_BASE_URL } from '@/services/api'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const productForm = ref<Product & { imageFile?: File }>({
  id: 0,
  name: '',
  description: '',
  price: 0,
  rating: '',
  imagePath: '',
  categoryId: undefined,
  categoryName: '',
  imageFile: undefined,
})

const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  const id = Number(route.params.id)
  await productStore.fetchProduct(id)
  if (productStore.selectedProduct) {
    productForm.value = { ...productStore.selectedProduct }
  }
})

async function saveProduct() {
  const ok = await productStore.saveProduct(productForm.value)
  if (ok) {
    successMessage.value = 'Produkt erfolgreich gespeichert.'
    errorMessage.value = ''
    router.push('/admin/products')
  } else {
    errorMessage.value = productStore.errorMessage
    successMessage.value = ''
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    productForm.value.imageFile = target.files[0]
  }
}

const productImageUrl = computed(() => {
  // Wenn eine neue Datei ausgewählt wurde, zeige die lokale Vorschau
  if (productForm.value.imageFile) {
    return URL.createObjectURL(productForm.value.imageFile)
  }
  // Wenn ein Bildpfad vorhanden ist, zeige das Bild vom Server
  if (productForm.value.imagePath) {
    return `${API_BASE_URL}/api/files/${productForm.value.imagePath}`
  }
  // Keine Datei -> keine Vorschau
  return ''
})
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Produkt bearbeiten
          </h1>

          <!-- Erfolg- und Fehlermeldungen -->
          <div v-if="successMessage" class="mb-4 rounded-lg bg-green-100 border border-green-400 p-4 text-green-700 text-sm">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-100 border border-red-400 p-4 text-red-700 text-sm">
            {{ errorMessage }}
          </div>

          <form class="space-y-4 md:space-y-6" @submit.prevent="saveProduct">
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

            <!-- Rating -->
            <div>
              <label for="rating" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
              <textarea v-model="productForm.rating" id="rating" name="rating" placeholder="Rating"
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

            <!-- Kategorie ID -->
            <div>
              <label for="categoryId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategorie-ID</label>
              <input v-model.number="productForm.categoryId" type="number" id="categoryId" name="categoryId" placeholder="0"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>

            <!-- Produktbild -->
            <div>
              <label for="image" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Produktbild</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                @change="onFileChange"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              <!-- Vorschau -->
              <div v-if="productForm.imageFile || productForm.imagePath" class="mt-2">
                <img
                  v-if="productImageUrl"
                  :src="productImageUrl"
                  alt="Produktbild Vorschau"
                  class="h-32 w-auto rounded"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit"
                    class="w-full text-white bg-slate-600 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800">
              Speichern
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
