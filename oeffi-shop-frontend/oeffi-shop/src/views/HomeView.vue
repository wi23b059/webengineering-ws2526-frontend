<script setup lang="ts">
import Heading from '@/components/atoms/Heading.vue';
import NewsCard from '@/components/atoms/NewsCard.vue';
import { news } from '@/docs/news';
</script>

<template>
  <Heading />

  <section class="py-12 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8 text-gray-900 text-center lg:text-left">
        Neuigkeiten der Wiener Öffis
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewsCard
          v-for="(n, i) in news"
          :key="i"
          :image="n.image"
          :category="n.category"
          :title="n.title"
          :link="n.link"
        />
      </div>
    </div>
  </section>

</template>

<style scoped>

</style>
