<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Máquinas</h1>
      <router-link
        to="/app/maquinas/nuevo"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Nueva Máquina
      </router-link>
    </div>

    <div class="mb-6 flex gap-4">
      <span class="p-input-icon-left w-64">
        <i class="pi pi-search" />
        <InputText
          v-model="filters.search"
          placeholder="Buscar máquinas..."
          class="w-full"
        />
      </span>
      <Dropdown
        v-model="filters.tipo"
        :options="tipoOptions"
        placeholder="Tipo de máquina"
        class="w-48"
      />
      <Dropdown
        v-model="filters.sucursal"
        :options="sucursalOptions"
        placeholder="Sucursal"
        optionLabel="label"
        optionValue="value"
        class="w-48"
      />
    </div>

    <DataTable
      :value="maquinas"
      :loading="loading"
      :paginator="true"
      :rows="10"
      responsive-layout="scroll"
      class="p-datatable-sm"
    >
      <Column field="nombreMaquina" header="Nombre" sortable />
      <Column field="tipo" header="Tipo" sortable />
      <Column field="modelo" header="Modelo" sortable />
      <Column field="marca" header="Marca" sortable />
      <Column field="codigoFabrica" header="Código de Fábrica" sortable />
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
              @click="editMaquina(data._id)"
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
        ¿Está seguro que desea eliminar la máquina
        {{ selectedMaquina?.nombreMaquina }}?
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
          @click="deleteSelectedMaquina"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMachineStore } from '@/stores/MachineStore';
import type { Machine } from '@/types/MachineTypes';
import { useAuthStore } from '@/stores/AuthStore';

const router = useRouter();
const maquinaStore = useMachineStore();
const authStore = useAuthStore();

const filters = ref({
  search: '',
  tipo: null as string | null,
  sucursal: authStore.sucursal?._id || null as string | null,
});

const deleteDialogVisible = ref(false);
const selectedMaquina = ref<Machine | null>(null);
const tipoOptions = ['Lavadora', 'Secadora', 'Plancha'];
const sucursalOptions = ref([
  { label: 'Sucursal A', value: 'sucursalA' },
  { label: 'Sucursal B', value: 'sucursalB' },
]);

const maquinas = ref<Machine[]>([]);
const loading = ref(true);

const fetchMaquinas = async () => {
  try {
    await maquinaStore.fetchMachines({
      search: filters.value.search || undefined,
      tipo: filters.value.tipo || undefined,
      sucursal: filters.value.sucursal || undefined,
    });
    maquinas.value = maquinaStore.maquinas;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching maquinas:', error);
  }
};

onMounted(async () => {
  await fetchMaquinas();
});

watch(() => filters.value.tipo, async (newValue) => {
  if (newValue !== null) {
    await fetchMaquinas();
  }
});

const editMaquina = (id: string) => {
  router.push(`/app/maquinas/editar/${id}`);
};

const confirmDelete = (maquina: Machine) => {
  selectedMaquina.value = maquina;
  deleteDialogVisible.value = true;
};

const deleteSelectedMaquina = async () => {
  if (selectedMaquina.value?._id) {
    try {
      await maquinaStore.deleteMaquina(selectedMaquina.value._id);
      deleteDialogVisible.value = false;
      selectedMaquina.value = null;
      await fetchMaquinas();
    } catch (error) {
      console.error('Error deleting maquina:', error);
    }
  }
};

defineExpose({
  editMaquina,
  confirmDelete,
  deleteSelectedMaquina,
});
</script>