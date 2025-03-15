<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEditing ? 'Editar Sucursal' : 'Nueva Sucursal' }}
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información de la Sucursal -->
      <Panel header="Información de la Sucursal" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="nombreSucursal" class="block text-sm font-medium text-gray-700">Nombre</label>
            <InputText
              id="nombreSucursal"
              v-model="form.nombreSucursal"
              :class="{'p-invalid': v$.nombreSucursal.$invalid && submitted}"
              class="w-full"
            />
            <small class="p-error" v-if="v$.nombreSucursal.$invalid && submitted">
              {{ v$.nombreSucursal.$errors[0].$message }}
            </small>
          </div>

          <div class="p-field">
            <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección</label>
            <InputText
              id="direccion"
              v-model="form.direccion"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
            <div class="flex">
              <Dropdown
                v-model="form.telefonoCodigoPais"
                :options="codigoPaisOptions"
                class="w-24"
                placeholder="+51"
              />
              <InputText
                id="telefono"
                v-model="form.telefono"
                class="w-full ml-2"
              />
            </div>
          </div>

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
        </div>
      </Panel>

      <!-- Horario de Atención -->
      <Panel header="Horario de Atención" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="apertura" class="block text-sm font-medium text-gray-700">Apertura</label>
            <InputText
              id="apertura"
              v-model="form.horarioAtencion.apertura"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="cierre" class="block text-sm font-medium text-gray-700">Cierre</label>
            <InputText
              id="cierre"
              v-model="form.horarioAtencion.cierre"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Ubicación GPS -->
      <Panel header="Ubicación GPS" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="latitude" class="block text-sm font-medium text-gray-700">Latitud</label>
            <InputNumber
              id="latitude"
              v-model="form.ubicacionGPS.latitude"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="longitude" class="block text-sm font-medium text-gray-700">Longitud</label>
            <InputNumber
              id="longitude"
              v-model="form.ubicacionGPS.longitude"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Capacidad Máxima -->
      <Panel header="Capacidad Máxima" class="mb-6">
        <div class="p-field">
          <label for="capacidadMaxima" class="block text-sm font-medium text-gray-700">Capacidad Máxima</label>
          <InputNumber
            id="capacidadMaxima"
            v-model="form.capacidadMaxima"
            class="w-full"
          />
        </div>
      </Panel>

      <!-- Encargado -->
      <Panel header="Encargado" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="nombreEncargado" class="block text-sm font-medium text-gray-700">Nombre</label>
            <InputText
              id="nombreEncargado"
              v-model="form.encargado.nombre"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="telefonoEncargado" class="block text-sm font-medium text-gray-700">Teléfono</label>
            <div class="flex">
              <Dropdown
                v-model="form.encargado.telefonoCodigoPais"
                :options="codigoPaisOptions"
                class="w-24"
                placeholder="+51"
              />
              <InputText
                id="telefonoEncargado"
                v-model="form.encargado.telefono"
                class="w-full ml-2"
              />
            </div>
          </div>

          <div class="p-field">
            <label for="emailEncargado" class="block text-sm font-medium text-gray-700">Email</label>
            <InputText
              id="emailEncargado"
              v-model="form.encargado.email"
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
          @click="router.push('/sucursales')"
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
import { useSucursalStore } from '@/stores/SubsidiaryStore';
import type { Sucursal } from '@/types/SubsidiaryTypes';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Panel from 'primevue/panel';

const router = useRouter();
const route = useRoute();
const sucursalStore = useSucursalStore();
const toast = useToast();

const isEditing = computed(() => route.params.id !== undefined);
const submitted = ref(false);
const loading = ref(false);

const form = ref<Sucursal>({
  nombreSucursal: '',
  direccion: '',
  telefono: '',
  telefonoCodigoPais: '+51',
  email: '',
  estado: true,
  horarioAtencion: {
    apertura: '',
    cierre: '',
  },
  ubicacionGPS: {
    latitude: 0,
    longitude: 0,
  },
  capacidadMaxima: 0,
  maquinas: [],
  encargado: {
    nombre: '',
    telefono: '',
    telefonoCodigoPais: '+51',
    email: '',
  },
});

const codigoPaisOptions = [
  { label: '+51', value: '+51' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  // Agrega más códigos de país según sea necesario
];

const rules = {
  nombreSucursal: { required },
  email: { required, email },
};

const v$ = useVuelidate(rules, form);

onMounted(async () => {
  if (isEditing.value && route.params.id) {
    try {
      await sucursalStore.getSucursalById(route.params.id as string);
      if (sucursalStore.currentSucursal) {
        form.value = { ...sucursalStore.currentSucursal };
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos de la sucursal', life: 3000 });
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
      await sucursalStore.updateSucursal(route.params.id as string, form.value);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Sucursal actualizada exitosamente', life: 3000 });
    } else {
      await sucursalStore.createSucursal(form.value);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Sucursal registrada exitosamente', life: 3000 });
    }
    router.push('/app/sucursales');
  } catch (error) {
    const responseErrors = (error as any).response?.data?.errors;
    if (responseErrors && Array.isArray(responseErrors)) {
      responseErrors.forEach((err: string) => {
        toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: (error as any).response?.data?.message || 'Error al guardar los datos de la sucursal', life: 3000 });
    }
  } finally {
    loading.value = false;
  }
};
</script>
