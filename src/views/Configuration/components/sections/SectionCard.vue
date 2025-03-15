<!-- components/configuration/sections/SectionCard.vue -->
<template>
  <div class="section-card bg-surface-50 dark:bg-surface-800 p-6 rounded-xl shadow-lg mb-6">
    <div class="flex items-center gap-3 mb-4">
      <i :class="icon" class="text-primary-500 text-xl" />
      <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-100">
        {{ title }}
      </h3>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<style scoped>
.section-card {
  transition: all 0.3s ease;
}
</style>