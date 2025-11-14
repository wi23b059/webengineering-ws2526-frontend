<script setup lang="ts">
import Navbar from './components/atoms/Navbar.vue';
import Footer from './components/atoms/Footer.vue';
import ErrorModal from './components/atoms/ErrorModal.vue';
import { ref, provide } from 'vue'

const showError = ref(false)
const errorMessage = ref('')

// Globale Bereitstellung via provide/inject
provide('showError', showError)
provide('errorMessage', errorMessage)

function closeModal() {
  showError.value = false
}
</script>

<template>
  <div>
    <Navbar />

    <main>
      <RouterView />
    </main>

    <ErrorModal :show="showError" :message="errorMessage" @close="closeModal" />

    <Footer/>
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}
</style>
