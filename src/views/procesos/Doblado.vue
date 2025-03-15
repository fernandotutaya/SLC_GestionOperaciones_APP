<template>
    <div>
      <h1 class="text-3xl font-bold text-left m-4 text-gray-700">Nuevo Proceso Lavado</h1>
      
      <Button label="Agregar Operación" icon="pi pi-plus" @click="openDrawer(null)" class="mb-4" />
      <div class="process-manager m-4">
        <ProcessFilters @filter="handleFilter" />
  
        <ProcessDataTable
          :processes="processes"
          :totalRecords="totalRecords"
          :loading="loading"
          @page-change="handlePageChange"
          @edit="openDrawer"
          @delete="handleDelete"
        />
        
        <ProcessFormDrawer
          v-model:visible="showDrawer"
          :process="selectedProcess"
          @saved="fetchProcesses"
        />
  
        <NotificationComponent
          :type="notification.type"
          :message="notification.message"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import ProcessDataTable from '@/components/procesos/ProcessDataTable.vue';
  import ProcessFormDrawer from '@/components/procesos/ProcessFromDrawer.vue';
  import NotificationComponent from '@/components/procesos/NotificationComponent.vue';
  import ProcessFilters from '@/components/procesos/ProcessFilters.vue';
  import { ProcessService } from '@/service/ProcessService';
  import type { ProcessFilters as Filters } from '@/types/ProcessTypes';
  import type { Process } from '@/types/ProcessTypes';
  
  type NotificationType = 'success' | 'error' | 'info' | 'warning';
  
  const processes = ref<Process[]>([]);
  const totalRecords = ref(0);
  const currentFilters = ref<Filters>({});
  const currentPage = ref(1);
  const rowsPerPage = ref(10);
  const showDrawer = ref(false);
  const selectedProcess = ref<Process | null>(null);
  const notification = ref<{ type: NotificationType; message: string }>({ type: 'info', message: '' });
  const loading = ref(false);
  
  const fetchProcesses = async () => {
    try {
      loading.value = true;
      const response = await ProcessService.getProcesses(
        currentFilters.value,
        currentPage.value,
        rowsPerPage.value
      );
      processes.value = response.data.procesos;
      totalRecords.value = response.data.total;
    } catch (error) {
      showNotification('error', 'Error al cargar procesos');
    } finally {
      loading.value = false;
    }
  };
  
  const handleFilter = (filters: Filters) => {
    currentFilters.value = filters;
    currentPage.value = 1;
    fetchProcesses();
  };
  
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    fetchProcesses();
  };
  
  const openDrawer = (process: Process | null) => {
    selectedProcess.value = process;
    showDrawer.value = true;
  };
  
  const handleDelete = async (processId: string) => {
    try {
      await ProcessService.deleteProcess(processId);
      showNotification('success', 'Proceso eliminado exitosamente');
      fetchProcesses();
    } catch (error) {
      showNotification('error', 'Error al eliminar proceso');
    }
  };
  
  const showNotification = (type: NotificationType, message: string) => {
    notification.value = { type, message };
    setTimeout(() => notification.value = { type: 'info', message: '' }, 3000);
  };
  
  onMounted(fetchProcesses);
  </script>
  