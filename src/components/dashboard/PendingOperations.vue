<template>
    <div class="card p-4 bg-white shadow rounded-lg">
      <div class="flex items-center mb-4">
          <span class="mdi mdi-alert-circle text-yellow-500 text-2xl mr-2"></span>
          <h2 class="text-xl font-bold">Operaciones Pendientes</h2>
        </div>
     
      <ul>
        
        <li class="mb-2 p-2 bg-gray-100 rounded">
          Ejemplo Operación 1 - 2023-10-01
        </li>
        <!-- Operaciones traídas de la API -->
        <li v-for="op in operations" :key="op._id" class="mb-2 p-2 bg-gray-100 rounded ">
          {{ op.titulo }} - {{ op.fecha }}
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from "vue";
  
  interface Operation {
    _id: string;
    titulo: string;
    fecha: string;
  }
  
  const props = defineProps<{
    operations: Operation[];
  }>();
  </script>