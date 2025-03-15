<template>
    <div class="card flex justify-center">
        <Select v-model="selectedEmployee" :options="employees" :optionLabel="getFullName" placeholder="Seleccione responsable" class="w-full" :loading="loading">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                    <i class="pi pi-user mr-2" />
                    <div>{{ getFullName(slotProps.value) }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex items-center">
                    <i class="pi pi-user mr-2" />
                    <div>{{ getFullName(slotProps.option) }}</div>
                </div>
            </template>
        </Select>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEmployeeStore } from "@/stores/EmployeeStore";
import type { Employee } from "@/types/EmployeeTypes";

const employeeStore = useEmployeeStore();
const selectedEmployee = ref<Employee | null>(null);
const employees = ref<Employee[]>([]);
const loading = ref(false);

const getFullName = (employee: Employee): string => {
    return `${employee.nombres} ${employee.apellidos}`;
};

const loadEmployees = async () => {
    try {
        loading.value = true;
        await employeeStore.fetchEmployees({});
        employees.value = employeeStore.employees;
    } catch (error) {
        console.error('Error loading employees:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadEmployees();
});

defineExpose({
    selectedEmployee
});
</script>
