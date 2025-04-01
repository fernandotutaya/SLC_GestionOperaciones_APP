<template>
    <div class="dashboard-container p-4">
        <div class="flex space-x-4 bg-white shadow-sm rounded-lg p-2">
          <!-- Quick Action Buttons -->
          <Button 
            @click="addOperation"
            class="p-button-rounded p-button-text flex items-center"
            v-tooltip.top="'Agregar Nuevo Proceso'"
          >
            <i class="mdi mdi-plus-circle text-blue-500 text-2xl"></i>
          </Button>

          <Button
            @click="configureApp"
            class="p-button-rounded p-button-text flex items-center"
            v-tooltip.top="'Configurar Aplicación'"
          >
            <i class="mdi mdi-cog text-green-500 text-2xl"></i>
          </Button>

          <Button
            @click="viewCompletedOperations"
            class="p-button-rounded p-button-text flex items-center"
            v-tooltip.top="'Ver Operaciones Finalizadas'"
          >
            <i class="mdi mdi-check-circle text-purple-500 text-2xl"></i>
          </Button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div class="w-full lg:col-span-1">
            <PendingOperationsCard class="w-full" />
          </div>
          <div class="w-full lg:col-span-2">
            
              <!-- Sección de Estadísticas -->
              <Charts  class="w-full"/>
                
              
          </div>
        </div>
      
    </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import PendingOperationsCard from "../../components/dashboard/PendingOperations.vue";
import Charts from "../../components/dashboard/Charts.vue";


// Lógica para agregar operación
const addOperation = () => {
  router.push({ name: 'new' });
};

// Lógica para configurar la aplicación
const configureApp = () => {
  router.push({ name: 'config' });
};

// Lógica para ver operaciones finalizadas
const viewCompletedOperations = () => {
  router.push({ name: 'completed' });
};

</script>
