<script setup lang="ts">
import { ref } from 'vue';
import type { ProcesoFilters } from '@/types/OperationTypes';

const emit = defineEmits<{
  (e: 'filter', filters: ProcesoFilters): void;
}>();

const filters = ref<ProcesoFilters>({ tipo: 'Lavado' });
const statusOptions = ref([
  { label: 'Todos', value: undefined },
  { label: 'Finalizados', value: true },
  { label: 'Pendientes', value: false }
]);

const handleSearch = () => {
  emit('filter', { ...filters.value, tipo: 'Lavado' });
};

const clearFilters = () => {
  filters.value = { tipo: 'Lavado' };
  emit('filter', { tipo: 'Lavado' });
};
</script>

<template>
  <div class="process-filters bg-white p-4 shadow-sm rounded-lg mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-600">Estado</label>
        <Dropdown
          v-model="filters.estado"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filtrar por estado"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-600">Búsqueda</label>
        <InputText
          v-model="filters.numOrden"
          placeholder="Número de orden..."
          class="w-full"
        />
      </div>

      <div class="flex gap-2 justify-end">
        <Button 
          label="Limpiar" 
          icon="pi pi-filter-slash"
          severity="secondary"
          @click="clearFilters"
        />
        <Button 
          label="Buscar" 
          icon="pi pi-search"
          @click="handleSearch"
        />
      </div>
    </div>
  </div>
</template>