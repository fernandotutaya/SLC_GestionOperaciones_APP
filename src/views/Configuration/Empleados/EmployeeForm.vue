<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEditing ? 'Editar Empleado' : 'Nuevo Empleado' }}
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información Personal -->
      <Panel header="Información Personal" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres</label>
            <InputText
              id="nombres"
              v-model="form.nombres"
              :class="{'p-invalid': v$.nombres.$invalid && submitted}"
              class="w-full"
            />
            <small class="p-error" v-if="v$.nombres.$invalid && submitted">
              {{ v$.nombres.$errors[0].$message }}
            </small>
          </div>

          <div class="p-field">
            <label for="apellidos" class="block text-sm font-medium text-gray-700">Apellidos</label>
            <InputText
              id="apellidos"
              v-model="form.apellidos"
              :class="{'p-invalid': v$.apellidos.$invalid && submitted}"
              class="w-full"
            />
            <small class="p-error" v-if="v$.apellidos.$invalid && submitted">
              {{ v$.apellidos.$errors[0].$message }}
            </small>
          </div>

          <div class="p-field">
            <label for="dni" class="block text-sm font-medium text-gray-700">DNI</label>
            <InputText
              id="dni"
              v-model="form.dni"
              :class="{'p-invalid': v$.dni.$invalid && submitted}"
              class="w-full"
            />
            <small class="p-error" v-if="v$.dni.$invalid && submitted">
              {{ v$.dni.$errors[0].$message }}
            </small>
          </div>

          <div class="p-field">
            <label for="fechaNacimiento" class="block text-sm font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <Calendar
              id="fechaNacimiento"
              v-model="form.fechaNacimiento"
              dateFormat="yy-mm-dd"
              :showIcon="true"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="genero" class="block text-sm font-medium text-gray-700">Género</label>
            <Dropdown
              id="genero"
              v-model="form.genero"
              :options="generoOptions"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="estadoCivil" class="block text-sm font-medium text-gray-700">
              Estado Civil
            </label>
            <Dropdown
              id="estadoCivil"
              v-model="form.estadoCivil"
              :options="estadoCivilOptions"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Información de Contacto -->
      <Panel header="Información de Contacto" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              :class="{'p-invalid': v$.email.$invalid && submitted}"
              class="w-full"
            />
            <small class="p-error" v-if="v$.email.$invalid && submitted">
              {{ v$.email.$errors[0].$message }}
            </small>
          </div>

          <div class="p-field">
            <label for="telefonoPrincipal" class="block text-sm font-medium text-gray-700">
              Teléfono Principal
            </label>
            <InputText
              id="telefonoPrincipal"
              v-model="form.telefonoPrincipal"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="telefonoSecundario" class="block text-sm font-medium text-gray-700">
              Teléfono Secundario
            </label>
            <InputText
              id="telefonoSecundario"
              v-model="form.telefonoSecundario"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Información Laboral -->
      <Panel header="Información Laboral" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="puesto" class="block text-sm font-medium text-gray-700">Puesto</label>
            <InputText
              id="puesto"
              v-model="form.puesto"
              :class="{'p-invalid': v$.puesto.$invalid && submitted}"
              class="w-full"
            />
            <small class="p-error" v-if="v$.puesto.$invalid && submitted">
              {{ v$.puesto.$errors[0].$message }}
            </small>
          </div>

          <div class="p-field">
            <label for="areaTrabajo" class="block text-sm font-medium text-gray-700">
              Área de Trabajo
            </label>
            <Dropdown
              id="areaTrabajo"
              v-model="form.areaTrabajo"
              :options="areaTrabajoOptions"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="tipoContrato" class="block text-sm font-medium text-gray-700">
              Tipo de Contrato
            </label>
            <Dropdown
              id="tipoContrato"
              v-model="form.tipoContrato"
              :options="tipoContratoOptions"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="fechaIngreso" class="block text-sm font-medium text-gray-700">
              Fecha de Ingreso
            </label>
            <Calendar
              id="fechaIngreso"
              v-model="form.fechaIngreso"
              dateFormat="yy-mm-dd"
              :showIcon="true"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="salario" class="block text-sm font-medium text-gray-700">Salario</label>
            <InputNumber
              id="salario"
              v-model="form.salario"
              mode="currency"
              currency="PEN"
              locale="es-PE"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Dirección -->
      <Panel header="Dirección" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="calle" class="block text-sm font-medium text-gray-700">Calle</label>
            <InputText
              id="calle"
              v-model="form.direccion.calle"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="ciudad" class="block text-sm font-medium text-gray-700">Ciudad</label>
            <InputText
              id="ciudad"
              v-model="form.direccion.ciudad"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="provincia" class="block text-sm font-medium text-gray-700">Provincia</label>
            <InputText
              id="provincia"
              v-model="form.direccion.provincia"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="codigoPostal" class="block text-sm font-medium text-gray-700">
              Código Postal
            </label>
            <InputText
              id="codigoPostal"
              v-model="form.direccion.codigoPostal"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <div class="flex justify-end gap-4">
        <Button
          type="button"
          label="Cancelar"
          class="p-button-secondary"
          @click="router.push('/empleados')"
        />
        <Button
          type="submit"
          label="Guardar"
          :loading="loading"
        />
      </div>
    </form>

    <Toast ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useEmployeeStore } from '@/stores/EmployeeStore';
import type { Employee } from '@/types/EmployeeTypes';
import { useAuthStore } from '@/stores/AuthStore';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const route = useRoute();
const employeeStore = useEmployeeStore();
const toast = useToast();

const isEditing = computed(() => route.params.id !== undefined);
const submitted = ref(false);
const loading = ref(false);

const authStore = useAuthStore();

const form = ref<Employee>({
  nombres: '',
  apellidos: '',
  dni: '',
  fechaNacimiento: new Date(),
  genero: '',
  email: '',
  telefonoPrincipal: '',
  telefonoSecundario: '',
  puesto: '',
  areaTrabajo: '',
  tipoContrato: '',
  fechaIngreso: new Date(),
  salario: 0,
  direccion: {
    calle: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
  },
  activo: true,
  estadoCivil: '',
});

const rules = {
  nombres: { required },
  apellidos: { required },
  dni: { required },
  email: { required, email },
  puesto: { required },
};

const v$ = useVuelidate(rules, form);

// Options for dropdowns
const generoOptions = ['Masculino', 'Femenino', 'Otro'];
const estadoCivilOptions = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];
const areaTrabajoOptions = ['Tecnología', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Marketing'];
const tipoContratoOptions = ['Tiempo Completo', 'Tiempo Parcial', 'Por Proyecto', 'Temporal'];

const toastRef = ref<InstanceType<typeof Toast> | null>(null);

onMounted(async () => {
  if (isEditing.value && route.params.id) {
    try {
      await employeeStore.getEmployeeById(route.params.id as string);
      if (employeeStore.currentEmployee) {
        form.value = { 
          ...employeeStore.currentEmployee,
          fechaNacimiento: employeeStore.currentEmployee.fechaNacimiento ? new Date(employeeStore.currentEmployee.fechaNacimiento) : new Date(),
          fechaIngreso: employeeStore.currentEmployee.fechaIngreso ? new Date(employeeStore.currentEmployee.fechaIngreso) : new Date()
        };
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos del empleado', life: 3000 });
    }
  }
});

const handleSubmit = async () => {
  submitted.value = true;
  const isValid = await v$.value.$validate();
  
  if (!isValid) return;

  loading.value = true;
  try {
    if (isEditing.value && route.params.id) {
      await employeeStore.updateEmployee(
        route.params.id as string,
        form.value
      );
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado actualizado exitosamente', life: 3000 });
    } else {
      await employeeStore.createEmployee(form.value);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado registrado exitosamente', life: 3000 });
    }
    router.push('/app/empleados');
  } catch (error) {
    const responseErrors = (error as any).response?.data?.errors;
    if (responseErrors && Array.isArray(responseErrors)) {
      responseErrors.forEach((err: string) => {
        toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: (error as any).response?.data?.message || 'Error al guardar los datos del empleado', life: 3000 });
    }
  } finally {
    loading.value = false;
  }
};
</script>