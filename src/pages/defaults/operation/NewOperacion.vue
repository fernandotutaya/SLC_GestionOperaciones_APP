<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    <!-- Card 1: Proceso Lavado -->
    <router-link :to="{ name: 'lavado' }" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <span class="mdi mdi-washing-machine text-blue-500 text-8xl mb-4"></span>
      <h2 class="text-lg font-bold mb-2">Proceso Lavado</h2>
      <p class="text-gray-600 text-sm text-center">Crea un nuevo proceso de lavado.</p>
    </router-link>

    <!-- Card 2: Proceso Secado -->
    <router-link to="/procesos/secado" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <span class="mdi mdi-tumble-dryer text-green-500 text-8xl mb-4"></span>
      <h2 class="text-lg font-bold mb-2">Proceso Secado</h2>
      <p class="text-gray-600 text-sm text-center">Crea un nuevo proceso de secado.</p>
    </router-link>

    <!-- Card 3: Proceso Planchado -->
    <router-link to="/procesos/planchado" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <span class="mdi mdi-iron text-purple-500 text-8xl mb-4"></span>
      <h2 class="text-lg font-bold mb-2">Proceso Planchado</h2>
      <p class="text-gray-600 text-sm text-center">Crea un nuevo proceso de planchado.</p>
    </router-link>

    <!-- Card 4: Proceso Doblado -->
    <router-link to="/procesos/doblado" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <span class="mdi mdi-format-columns  text-yellow-500 text-8xl mb-4"></span>
      <h2 class="text-lg font-bold mb-2">Proceso Doblado</h2>
      <p class="text-gray-600 text-sm text-center">Crea un nuevo proceso de doblado.</p>
    </router-link>

    <!-- Card 5: Proceso Teñido -->
    <router-link to="/procesos/tenido" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <span class="mdi mdi-palette text-red-500 text-8xl mb-4"></span>
      <h2 class="text-lg font-bold mb-2">Proceso Teñido</h2>
      <p class="text-gray-600 text-sm text-center">Crea un nuevo proceso de teñido.</p>
    </router-link>

    <!-- Card 6: Control de Calidad -->
    <router-link to="/procesos/control-calidad" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
      <span class="mdi mdi-checkbox-marked-circle-outline text-teal-500 text-8xl mb-4"></span>
      <h2 class="text-lg font-bold mb-2">Control de Calidad</h2>
      <p class="text-gray-600 text-sm text-center">Realiza el control de calidad de los procesos.</p>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}
</style>