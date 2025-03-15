<template>
    <div class="dashboard-container p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Card 1: Agregar Nuevo Proceso -->
          <div @click="addOperation" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <span class="mdi mdi-plus-circle text-blue-500 text-8xl mb-4"></span>
            <h2 class="text-lg font-bold mb-2">Agregar Nuevo Proceso</h2>
            <p class="text-gray-600 text-sm text-center">Crea un nuevo proceso de lavado, secado, doblado, etc.</p>
          </div>

          <!-- Card 2: Configurar Aplicación -->
          <div @click="configureApp" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <span class="mdi mdi-cog text-green-500 text-8xl mb-4"></span>
            <h2 class="text-lg font-bold mb-2">Configurar Aplicación</h2>
            <p class="text-gray-600 text-sm text-center">Ajusta la configuración de la aplicación según tus necesidades.</p>
          </div>
        
          <!-- Card 3: Ver Procesos Finalizados -->
          <div @click="viewCompletedOperations" class="card bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-gray-100 cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <span class="mdi mdi-check-circle text-purple-500 text-8xl mb-4"></span>
            <h2 class="text-lg font-bold mb-2">Ver Operaciones Finalizadas</h2>
            <p class="text-gray-600 text-sm text-center">Revisa los procesos que han sido completados exitosamente.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div class="w-full">
            <ProgressSpinner v-if="isLoading" style="width: 200px; height: 200px" strokeWidth="2" fill="transparent"
              animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            <PendingOperationsCard v-else :operations="pendingOperations" class="w-full" />
          </div>
          <div class="w-full">
            <ProgressSpinner v-if="isLoading" style="width: 200px; height: 200px" strokeWidth="2" fill="transparent"
              animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            <LatestOperationsCard v-else :operations="latestOperations" class="w-full" />
          </div>
        </div>
       
    </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ref, onMounted } from "vue";
import axios from "axios";
import PendingOperationsCard from "../../components/dashboard/PendingOperations.vue";
import LatestOperationsCard from "../../components/dashboard/LatestOperations.vue";
import { useAuthStore } from "@/stores/AuthStore";

interface Operation {
  _id: string;
  titulo: string;
  fecha: string;
}

// Estado reactivo
const pendingOperations = ref<Operation[]>([]);
const latestOperations = ref<Operation[]>([]);
const isLoading = ref<boolean>(true);
const authStore = useAuthStore();

// Fetch de datos
const fetchPendingOperations = async () => {
  try {
    // Verificar que existan los IDs antes de hacer la petición
    if (!authStore.company?._id || !authStore.sucursal?._id) {
      console.warn("ID de compañía o sucursal no disponibles");
      isLoading.value = false;
      return;
    }
    
    const response = await axios.get(`http://localhost:8080/api/${authStore.company._id}/operaciones/${authStore.sucursal._id}/`);
    pendingOperations.value = response.data;
  } catch (error) {
    console.error("Error fetching pending operations:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchLatestOperations = async () => {
  try {
    // Verificar que exista el ID de compañía antes de hacer la petición
    if (!authStore.company?._id) {
      console.warn("ID de compañía no disponible");
      isLoading.value = false;
      return;
    }
    
    const response = await axios.get(`http://localhost:8080/api/${authStore.company._id}/operaciones/`);
    latestOperations.value = response.data;
  } catch (error) {
    console.error("Error fetching latest operations:", error);
  } finally {
    isLoading.value = false;
  }
};

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

// Cargar datos al montar el componente
onMounted(() => {
  fetchPendingOperations();
  fetchLatestOperations();
});
</script>
