<template>
    <div class="card p-4 bg-white shadow rounded-lg">
      <h2 class="text-xl font-bold mb-4">Configuración</h2>
      <PrimeButton
        @click="emit('add-operation')"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2"
      >
        Agregar Operación
      </PrimeButton>
      <PrimeButton
        @click="emit('configure-app')"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Configurar Aplicación
      </PrimeButton>
    </div>
  </template>
  
  <script lang="ts" setup>
  
  const emit = defineEmits<{
    (e: "add-operation"): void;
    (e: "configure-app"): void;
  }>();
  </script>