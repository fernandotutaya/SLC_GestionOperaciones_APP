<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Empleados</h1>
      <router-link
        to="/app/empleados/nuevo"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Nuevo Empleado
      </router-link>
    </div>

    <div class="mb-6 flex gap-4">
      <span class="p-input-icon-left w-64">
        <i class="pi pi-search" />
        <InputText
          v-model="filters.search"
          placeholder="Buscar empleados..."
          class="w-full"
        />
      </span>
      <Dropdown
        v-model="filters.areaTrabajo"
        :options="areaTrabajoOptions"
        placeholder="Área de trabajo"
        class="w-48"
      />
    </div>

    <DataTable
      :value="employees"
      :loading="loading"
      :paginator="true"
      :rows="10"
      responsive-layout="scroll"
      class="p-datatable-sm"
    >
      <Column field="nombres" header="Nombres" sortable />
      <Column field="apellidos" header="Apellidos" sortable />
      <Column field="dni" header="DNI" />
      <Column field="areaTrabajo" header="Área" sortable />
      <Column field="puesto" header="Puesto" />
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
              @click="editEmployee(data._id)"
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
        ¿Está seguro que desea eliminar a {{ selectedEmployee?.nombres }} {{ selectedEmployee?.apellidos }}?
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
          @click="deleteSelectedEmployee"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEmployeeStore } from '@/stores/EmployeeStore';
import type { Employee } from '@/types/EmployeeTypes';

const router = useRouter();
const employeeStore = useEmployeeStore();

const filters = ref({
  search: '',
  areaTrabajo: null as string | null,
});

const deleteDialogVisible = ref(false);
const selectedEmployee = ref<Employee | null>(null);
const areaTrabajoOptions = [
  'Tecnología',
  'Recursos Humanos',
  'Finanzas',
  'Operaciones',
  'Marketing',
];

const employees = ref<Employee[]>([]);
const loading = ref(true);

const fetchEmployees = async () => {
  try {
    await employeeStore.fetchEmployees({
      areaTrabajo: filters.value.areaTrabajo || undefined,
    });
    employees.value = employeeStore.employees;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

onMounted(async () => {
  await fetchEmployees();
});

watch(() => filters.value.areaTrabajo, async (newValue) => {
  if (newValue !== null) {
    await fetchEmployees();
  }
});

const editEmployee = (id: string) => {
  router.push(`/app/empleados/editar/${id}`);
};

const confirmDelete = (employee: Employee) => {
  selectedEmployee.value = employee;
  deleteDialogVisible.value = true;
};

const deleteSelectedEmployee = async () => {
  if (selectedEmployee.value?._id) {
    try {
      await employeeStore.deleteEmployee(selectedEmployee.value._id);
      deleteDialogVisible.value = false;
      selectedEmployee.value = null;
      await fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }
};
</script>