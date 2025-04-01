<template>
    <div class="card p-4 bg-white shadow rounded-lg">
      <div class="flex items-center mb-4">
        <span class="mdi mdi-alert-circle text-yellow-500 text-2xl mr-2"></span>
        <h2 class="text-xl font-bold">Operaciones Pendientes</h2>
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
        <Column field="fecInicio" header="Fecha Inicio" class="text-sm">
          <template #body="slotProps">
            {{ new Date(slotProps.data.fecInicio).toLocaleString() }}
          </template>
        </Column>
        <Column field="currentStage" header="Etapa Actual" class="text-sm"></Column>
        <Column field="nextStage" header="Próxima Etapa" class="text-sm"></Column>
  
        <Column header="Acciones" class="text-sm">
          <template #body="slotProps">
            <Button 
              icon="mdi mdi-eye" 
              class="p-button-rounded p-button-text p-button-sm" 
              @click="openOperationDetailsDialog(slotProps.data._id)"
              tooltip="Ver detalles"
            />
          </template>
        </Column>
      </DataTable>
      
      <!-- Modal de detalles de operación -->
      <Dialog 
        v-model:visible="showDetailsDialog" 
        :style="{width: '90vw', maxWidth: '800px'}" 
        :modal="true"
        :closable="true"
        :dismissableMask="true"
        header="Detalles de la Operación"
      >
        <div v-if="dialogLoading" class="flex justify-center p-4">
          <ProgressSpinner style="width:50px;height:50px" strokeWidth="3" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
        
        <div v-else-if="dialogError" class="p-4 bg-red-100 text-red-700 rounded">
          {{ dialogError }}
        </div>
        
        <div v-else-if="selectedOperation" class="p-4">
          <!-- Información general -->
          <div class="mb-6 border-b pb-4">
            <h3 class="text-lg font-bold mb-2">Información General</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Fecha Inicio:</p>
                <p class="font-medium">{{ new Date(selectedOperation.fecInicio).toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Etapa Actual:</p>
                <p class="font-medium">{{ selectedOperation.currentStage }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Próxima Etapa:</p>
                <p class="font-medium">{{ selectedOperation.nextStage }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Estado:</p>
                <Tag :severity="selectedOperation.estadoOperacion ? 'success' : 'warning'">
                  {{ selectedOperation.estadoOperacion ? 'Completada' : 'Pendiente' }}
                </Tag>
              </div>
            </div>
          </div>
          
          <!-- Procesos -->
          <div v-if="selectedOperation.procesos && selectedOperation.procesos.length > 0">
            <h3 class="text-lg font-bold mb-2">Procesos</h3>
            <Accordion :multiple="true" class="mb-4">
              <AccordionTab v-for="(proceso, index) in selectedOperation.procesos" :key="index" :header="proceso.tipo">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600">Fecha:</p>
                    <p class="font-medium">{{ proceso.fecha }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Hora:</p>
                    <p class="font-medium">{{ proceso.hora }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Responsable:</p>
                    <p class="font-medium">{{ proceso.responsable?.nombreCompleto || 'No asignado' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Estado:</p>
                    <Tag :severity="proceso.estado ? 'success' : 'warning'">
                      {{ proceso.estado ? 'Completado' : 'Pendiente' }}
                    </Tag>
                  </div>
                </div>
                
                <!-- Detalles del proceso -->
                <div v-if="proceso.detalles && proceso.detalles.length > 0">
                  <h4 class="text-md font-semibold mb-2">Detalles</h4>
                  <DataTable :value="proceso.detalles" class="w-full" responsiveLayout="scroll">
                    <Column field="numOrden" header="Ticket" class="text-sm"></Column>
                    <Column header="Máquina" class="text-sm">
                      <template #body="slotProps">
                        {{ slotProps.data.maquina?.nombreMaquina || 'No asignada' }}
                      </template>
                    </Column>
                    <Column field="cantPrendas" header="Cantidad" class="text-sm"></Column>
                    <Column field="etiqueta" header="Etiqueta" class="text-sm"></Column>
                    <Column field="observaciones" header="Observaciones" class="text-sm"></Column>
                  </DataTable>
                </div>
                <div v-else class="text-center text-gray-500 py-2">
                  No hay detalles disponibles
                </div>
              </AccordionTab>
            </Accordion>
          </div>
          <div v-else class="text-center text-gray-500 py-2">
            No hay procesos disponibles
          </div>
        </div>
        
        <template #footer>
          <Button label="Cerrar" icon="mdi mdi-close" class="p-button-text" @click="showDetailsDialog = false" />
        </template>
  
      </Dialog>
  
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, computed, ref } from "vue";
  import { useOperationStore } from "@/stores/OperationStore";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import Badge from "primevue/badge";
  import Button from "primevue/button";
  import ProgressSpinner from "primevue/progressspinner";
  import Dialog from "primevue/dialog";
  import Accordion from "primevue/accordion";
  import AccordionTab from "primevue/accordiontab";
  import Tag from "primevue/tag";
  import { Proceso, Operacion } from "@/types/OperationTypes";
  
  const operationStore = useOperationStore();
  const loading = computed(() => operationStore.loading);
  const error = computed(() => operationStore.error);
  
  // Dialog state
  const showDetailsDialog = ref(false);
  const selectedOperation = ref<Operacion | null>(null);
  const dialogLoading = ref(false);
  const dialogError = ref<string | null>(null);
  
  // Computed property to get only pending operations
  const pendingOperations = computed(() => {
    return operationStore.operaciones.filter(op => !op.estadoOperacion);
  });
  
  // Function to extract unique ticket numbers from process details
  const getUniqueTickets = (procesos: Proceso[]) => {
    if (!procesos || !Array.isArray(procesos)) return [];
    
    // Extract all ticket numbers from all process details
    const tickets = procesos.flatMap(proceso => {
      if (!proceso.detalles || !Array.isArray(proceso.detalles)) return [];
      return proceso.detalles.map(detalle => detalle.numOrden).filter(Boolean);
    });
    
    // Return unique tickets
    return [...new Set(tickets)];
  };
  
  // Function to open operation details dialog
  const openOperationDetailsDialog = async (operationId: string) => {
    dialogLoading.value = true;
    dialogError.value = null;
    showDetailsDialog.value = true;
    
    try {
      // Fetch operation details if needed
      const operation = operationStore.operaciones.find(op => op._id === operationId);
      if (operation) {
        selectedOperation.value = operation;
      } else {
        dialogError.value = "No se pudo encontrar la operación";
      }
    } catch (err) {
      dialogError.value = "Error al cargar los detalles de la operación";
      console.error(err);
    } finally {
      dialogLoading.value = false;
    }
  };
  
  // Load operations on component mount
  onMounted(() => {
    operationStore.fetchOperaciones();
  })
  
  </script>