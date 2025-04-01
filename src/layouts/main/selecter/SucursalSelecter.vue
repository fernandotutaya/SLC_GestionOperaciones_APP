<template>
  <div class="sucursal-selector">
    <Dropdown 
      v-model="selectedSucursal" 
      :options="sucursales" 
      optionLabel="nombreSucursal" 
      placeholder="Seleccionar Sucursal" 
      :loading="loading"
      class="w-full"
    >
      <template #value="slotProps">
        <div class="flex items-center" v-if="slotProps.value">
          <i class="pi pi-map-marker mr-2"></i>
          <span>{{ slotProps.value.nombreSucursal }}</span>
        </div>
        <span v-else>Seleccionar Sucursal</span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center">
          <i class="pi pi-map-marker mr-2"></i>
          <span>{{ slotProps.option.nombreSucursal }}</span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSucursalStore } from '@/stores/SubsidiaryStore';
import type { Sucursal } from '@/types/SubsidiaryTypes';

// Store de sucursales
const sucursalStore = useSucursalStore();

// Estado local
const selectedSucursal = ref<Sucursal | null>(null);

// Propiedades calculadas
const sucursales = computed(() => sucursalStore.sucursales);
const loading = computed(() => sucursalStore.loading);

// Al cambiar la selección, actualizar el store
watch(selectedSucursal, (newValue) => {
  if (newValue) {
    sucursalStore.currentSucursal = newValue;
  }
});

// Cargar sucursales y seleccionar la primera por defecto
onMounted(async () => {
  try {
    await sucursalStore.fetchSucursales();
    
    // Si hay sucursales disponibles y no hay una sucursal seleccionada, seleccionar la primera
    if (sucursales.value.length > 0 && !selectedSucursal.value) {
      selectedSucursal.value = sucursales.value[0];
    }
  } catch (error) {
    console.error('Error al cargar sucursales:', error);
  }
});

// Sincronizar con el store si ya hay una sucursal seleccionada
watch(() => sucursalStore.currentSucursal, (newValue) => {
  if (newValue) {
    selectedSucursal.value = newValue;
  }
}, { immediate: true });
</script>

<style scoped>
.sucursal-selector {
  min-width: 250px;
}
</style>