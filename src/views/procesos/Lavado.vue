<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Procesos de Lavado</h1>
      <Button 
        label="Agregar Proceso" 
        icon="pi pi-plus" 
        @click="handleAddProcess"
        severity="success"
      />
    </div>

    <ProcessFilters @filter="handleFilter" />
    
    <ProcessDataTable
      :processes="filteredProcesses"
      :totalRecords="totalRecords"
      :loading="operationStore.loading"
      @page-change="handlePageChange"
      @view="handleViewProcess"
      @edit="handleEditProcess"
      @delete="handleDeleteProcess"
    />
    
    <ProcessFromDrawer
      v-model:visible="showDrawer"
      :process="selectedProcess"
      :operation="selectedOperation"
      :mode="editMode"
      :machines="machines" 
      
      @saved="handleSaveSuccess"
    />

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import ProcessDataTable from '@/components/procesos/ProcessDataTable.vue';
import ProcessFromDrawer from '@/components/procesos/ProcessFromDrawer.vue';
import ProcessFilters from '@/components/procesos/ProcessFilters.vue';
import { ref, onMounted } from 'vue';
import { useOperationStore } from '@/stores/OperationStore';
import { useMachineStore } from '@/stores/MachineStore';
import { useAuthStore } from '@/stores/AuthStore';
import type { Proceso, ProcesoFilters, Operacion } from '@/types/OperationTypes';
import type { Machine } from '@/types/MachineTypes';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const operationStore = useOperationStore();
const authStore = useAuthStore();
const toast = useToast();
const confirm = useConfirm();

const filteredProcesses = ref<Proceso[]>([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const showDrawer = ref(false);
const selectedProcess = ref<Proceso | null>(null);
const selectedOperation = ref<Operacion | null>(null);
const editMode = ref<'view' | 'edit' | 'add'>('view');
const machines = ref<Machine[]>([]);

// Buscar la operación a la que pertenece un proceso
const findParentOperation = (procesoId: string): Operacion | null => {
  // Verificar que el procesoId sea válido
  if (!procesoId) {
    console.error('procesoId no válido:', procesoId);
    return null;
  }

  // Verificar que operationStore.operaciones tenga datos
  if (!operationStore.operaciones || operationStore.operaciones.length === 0) {
    console.warn('No hay operaciones cargadas en el store');
    return null;
  }

  // Agregar logs para depuración
  console.log('Buscando operación padre para proceso:', procesoId);
  console.log('Total operaciones disponibles:', operationStore.operaciones.length);

  // Buscar en todas las operaciones sin filtrar por tipo
  const parentOperation = operationStore.operaciones.find(op => {
    // Verificar que la operación tenga procesos
    if (!op.procesos || op.procesos.length === 0) {
      return false;
    }

    // Buscar el proceso por ID sin filtrar por tipo inicialmente
    const found = op.procesos.some(p => p._id === procesoId);
    
    if (found) {
      console.log('Operación encontrada:', op._id);
    }
    
    return found;
  });

  if (!parentOperation) {
    console.warn('No se encontró operación padre para el proceso:', procesoId);
    
    // Inspeccionar los IDs de procesos disponibles para depuración
    const availableProcessIds = operationStore.operaciones
      .flatMap(op => op.procesos.map(p => p._id));
    console.log('IDs de procesos disponibles:', availableProcessIds);
  }

  return parentOperation || null;
};

const fetchProcesses = async (filters: ProcesoFilters = { tipo: 'lavado' }) => {
  try {
    // Primero obtenemos operaciones actualizadas para asegurar que tenemos los datos más recientes
    //await operationStore.fetchOperaciones();
    
    const procesos = await operationStore.filterProcesos({
      ...filters,
      page: currentPage.value,
      limit: rowsPerPage.value,
      sucursalId: authStore.sucursal?._id
    });
    
    filteredProcesses.value = procesos;
    totalRecords.value = operationStore.totalProcesosLavado;
  } catch (error) {
    showNotification('error', 'Error al cargar procesos');
    console.error('Error al cargar procesos:', error);
  }
};

const handleFilter = (filters: ProcesoFilters) => {
  currentPage.value = 1;
  fetchProcesses(filters);
};

// Abrir el drawer en modo vista
const handleViewProcess = (process: Proceso) => {
  selectedProcess.value = process;
  selectedOperation.value = findParentOperation(process._id ?? '');
  editMode.value = 'view';
  showDrawer.value = true;
};

// Abrir el drawer en modo edición
const handleEditProcess = (process: Proceso) => {
  selectedProcess.value = process;
  selectedOperation.value = findParentOperation(process._id ?? '');
  editMode.value = 'edit';
  showDrawer.value = true;
  
  console.log('Proceso seleccionado:', process._id);
  console.log('Editando proceso:', selectedOperation.value);
};

// Eliminar un proceso
const handleDeleteProcess = (process: Proceso) => {
  if (!process._id || !process.operacionId) {
    showNotification('error', 'No se puede eliminar este proceso');
    return;
  }
  
  confirm.require({
    message: '¿Está seguro de eliminar este proceso de lavado?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        // Aquí agregar lógica para eliminar proceso cuando esté implementada
        // await operationStore.deleteProceso(process.operacionId, process._id);
        showNotification('success', 'Proceso eliminado correctamente');
        await fetchProcesses();
      } catch (error) {
        showNotification('error', 'Error al eliminar el proceso');
        console.error('Error al eliminar proceso:', error);
      }
    }
  });
};

// Manejador después de guardar un proceso
const handleSaveSuccess = () => {
  // Mostrar mensaje de éxito y recargar datos
  toast.add({ severity: 'success', summary: 'Éxito', detail: 'Proceso guardado correctamente', life: 3000 });
  
  // Espera un momento y luego recarga los datos para mostrar cambios actualizados
  setTimeout(async () => {
    await fetchProcesses();
  }, 500);
};

const showNotification = (type: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast', message: string) => {
  toast.add({ severity: type, summary: type === 'success' ? 'Éxito' : 'Error', detail: message, life: 3000 });
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchProcesses();
};

onMounted(async () => {
  // Cargar máquinas de tipo lavadora primero para tenerlas disponibles para la selección
  const machineStore = useMachineStore();
  await machineStore.fetchMachines({tipo: 'Lavadora'});
  machines.value = machineStore.maquinas;
  
  // Luego cargar operaciones y procesos
  await operationStore.fetchOperaciones();
  await fetchProcesses();
});

// Plantilla para nuevo proceso
const newProcessTemplate: Proceso = {
  _id: '',
  tipo: 'Lavado',
  fecha: new Date().toISOString(),
  hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  responsable: { _id: '' }, // Asegurarse de asignar un _id válido antes de enviar
  detalles: [],
  estado: false,
  operacionId: '',
  createdAt: new Date().toISOString(),
  nextStage: 'Secado'
};

// Abrir el drawer en modo creación
const handleAddProcess = () => {
  selectedProcess.value = { ...newProcessTemplate };
  selectedOperation.value = null;
  editMode.value = 'add';
  showDrawer.value = true;
};
</script>