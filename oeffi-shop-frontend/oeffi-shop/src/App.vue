<script setup lang="ts">
import Navbar from './components/atoms/Navbar.vue';
import Imprint from './components/atoms/Imprint.vue';
</script>

<template>
  <div>
    <Navbar />

    <main>
      <RouterView />
    </main>

    <Imprint/>
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
