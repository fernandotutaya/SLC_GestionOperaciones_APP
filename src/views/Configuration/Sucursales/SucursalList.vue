<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Sucursales</h1>
      <router-link
        to="/app/sucursales/nuevo"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Nueva Sucursal
      </router-link>
    </div>

    <div class="mb-6 flex gap-4">
      <span class="p-input-icon-left w-64">
        <i class="pi pi-search" />
        <InputText
          v-model="filters.search"
          placeholder="Buscar sucursales..."
          class="w-full"
        />
      </span>
    </div>

    <DataTable
      :value="sucursales"
      :loading="loading"
      :paginator="true"
      :rows="10"
      responsive-layout="scroll"
      class="p-datatable-sm"
    >
      <Column field="nombreSucursal" header="Nombre" sortable />
      <Column field="direccion" header="Dirección" sortable />
      <Column field="telefono" header="Teléfono" />
      <Column field="email" header="Email" />
      <Column
        header="Acciones"
        :exportable="false"
        style="min-width: 8rem"
      >
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-warning"
              @click="editSucursal(data._id)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-rounded p-button-danger"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="deleteDialogVisible"
      header="Confirmar Eliminación"
      :modal="true"
      class="p-fluid"
    >
      <p class="m-0">
        ¿Está seguro que desea eliminar la sucursal {{ selectedSucursal?.nombreSucursal }}?
      </p>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteDialogVisible = false"
        />
        <Button
          label="Sí"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedSucursal"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSucursalStore } from '@/stores/SubsidiaryStore';
import type { Sucursal } from '@/types/SubsidiaryTypes';

const router = useRouter();
const sucursalStore = useSucursalStore();

const filters = ref({
  search: '',
});

const deleteDialogVisible = ref(false);
const selectedSucursal = ref<Sucursal | null>(null);

const sucursales = ref<Sucursal[]>([]);
const loading = ref(true);

const fetchSucursales = async () => {
  try {
    await sucursalStore.fetchSucursales();
    sucursales.value = sucursalStore.sucursales;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching sucursales:', error);
  }
};

onMounted(async () => {
  await fetchSucursales();
});

watch(() => filters.value.search, async (newValue) => {
  if (newValue !== null) {
    await fetchSucursales();
  }
});

const editSucursal = (id: string) => {
  router.push(`/app/sucursales/editar/${id}`);
};

const confirmDelete = (sucursal: Sucursal) => {
  selectedSucursal.value = sucursal;
  deleteDialogVisible.value = true;
};

const deleteSelectedSucursal = async () => {
  if (selectedSucursal.value?._id) {
    try {
      await sucursalStore.deleteSucursal(selectedSucursal.value._id);
      deleteDialogVisible.value = false;
      selectedSucursal.value = null;
      await fetchSucursales();
    } catch (error) {
      console.error('Error deleting sucursal:', error);
    }
  }
};
</script>
