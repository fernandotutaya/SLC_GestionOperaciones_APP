<template>
  <div class="card p-4 bg-white shadow rounded-lg">
    <div class="flex items-center mb-4">
      <span class="mdi mdi-alert-circle text-yellow-500 text-2xl mr-2"></span>
      <h2 class="text-xl font-bold">Operaciones Pendientes</h2>

      <div class="ml-auto">
        <router-link to="/app/proceso">
          <Button label="Ver más" class="p-button-sm p-button-text text-blue-600 hover:text-blue-800" icon="pi pi-arrow-right" iconPos="right" />
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner style="width:50px;height:50px" strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
    </div>
    
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>
    
    <div v-else-if="pendingOperations.length === 0" class="p-4 text-center text-gray-500">
      No hay operaciones pendientes
    </div>
    
    <DataTable v-else :value="pendingOperations" class="w-full" responsiveLayout="scroll">
      <Column field="_id" header="ID" class="text-sm"></Column>
      
      <Column field="fecInicio" header="Fecha Inicio" class="text-sm">
        <template #body="slotProps">
          {{ new Date(slotProps.data.fecInicio).toLocaleString() }}
        </template>
      </Column>
      <Column field="currentStage" header="Etapa Actual" class="text-sm"></Column>
      <Column field="nextStage" header="Próxima Etapa" class="text-sm"></Column>
      <Column header="Tickets" class="text-sm">
        <template #body="slotProps">
          <div class="flex flex-wrap gap-1">
            <Badge 
              v-for="ticket in getUniqueTickets(slotProps.data.procesos)" 
              :key="ticket"
              class="bg-blue-100 text-blue-800 text-xs font-medium mr-1"
            >
              {{ ticket }}
            </Badge>
          </div>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { useOperationStore } from "@/stores/OperationStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Badge from "primevue/badge";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { Proceso, ProcesoDetail} from "@/types/OperationTypes";

const operationStore = useOperationStore();
const loading = computed(() => operationStore.loading);
const error = computed(() => operationStore.error);

// Computed property to get only pending operations
const pendingOperations = computed(() => {
  return operationStore.operaciones.filter(op => !op.estadoOperacion);
});

// Function to extract unique ticket numbers from process details
const getUniqueTickets = (procesos: Proceso) => {
  if (!procesos || !Array.isArray(procesos)) return [];
  
  // Extract all ticket numbers from all process details
  const allTickets = procesos.flatMap(proceso => {
    if (!proceso.detalles || !Array.isArray(proceso.detalles)) return [];
    return proceso.detalles.map((detalle : ProcesoDetail) => detalle.numOrden);
  });
  
  // Filter out duplicates and undefined/null values
  return [...new Set(allTickets)].filter(ticket => ticket);
};


onMounted(async () => {
  try {
    // Fetch operations with estadoOperacion=false to get pending operations
    await operationStore.fetchOperaciones({ estadoOperacion: false, limit: 5 });
  } catch (error) {
    console.error("Error fetching pending operations:", error);
  }
});
</script>

<style scoped>
/* Add any additional styling if needed */
</style>