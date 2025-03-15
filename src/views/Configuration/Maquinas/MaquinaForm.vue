<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEditing ? 'Editar Máquina' : 'Nueva Máquina' }}
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información General -->
      <Panel header="Información General" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo</label>
            <Dropdown
              id="tipo"
              v-model="form.tipo"
              :options="tipoOptions"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="modelo" class="block text-sm font-medium text-gray-700">Modelo</label>
            <InputText
              id="modelo"
              v-model="form.modelo"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="marca" class="block text-sm font-medium text-gray-700">Marca</label>
            <InputText
              id="marca"
              v-model="form.marca"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="codigoFabrica" class="block text-sm font-medium text-gray-700">
              Código de Fábrica
            </label>
            <InputText
              id="codigoFabrica"
              v-model="form.codigoFabrica"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="nombreMaquina" class="block text-sm font-medium text-gray-700">
              Nombre de la Máquina
            </label>
            <InputText
              id="nombreMaquina"
              v-model="form.nombreMaquina"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Características -->
      <Panel header="Características" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="capacidad" class="block text-sm font-medium text-gray-700">
              Capacidad
            </label>
            <InputNumber
              id="capacidad"
              v-model="form.caracteristicas.capacidad"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="unidadCapacidad" class="block text-sm font-medium text-gray-700">
              Unidad de Capacidad
            </label>
            <Dropdown
              id="unidadCapacidad"
              v-model="form.caracteristicas.unidadCapacidad"
              :options="unidadCapacidadOptions"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="consumoEnergetico" class="block text-sm font-medium text-gray-700">
              Consumo Energético
            </label>
            <InputNumber
              id="consumoEnergetico"
              v-model="form.caracteristicas.consumoEnergetico"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Dimensiones -->
      <Panel header="Dimensiones (cm)" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-field">
            <label for="alto" class="block text-sm font-medium text-gray-700">Alto</label>
            <InputNumber
              id="alto"
              v-model="form.caracteristicas.dimensiones.alto"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="ancho" class="block text-sm font-medium text-gray-700">Ancho</label>
            <InputNumber
              id="ancho"
              v-model="form.caracteristicas.dimensiones.ancho"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="profundidad" class="block text-sm font-medium text-gray-700">
              Profundidad
            </label>
            <InputNumber
              id="profundidad"
              v-model="form.caracteristicas.dimensiones.profundidad"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Mantenimiento -->
      <Panel header="Mantenimiento" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="fechaInstalacion" class="block text-sm font-medium text-gray-700">
              Fecha de Instalación
            </label>
            <Calendar
              id="fechaInstalacion"
              v-model="form.fechaInstalacion"
              dateFormat="yy-mm-dd"
              :showIcon="true"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="ultimoMantenimientoFecha" class="block text-sm font-medium text-gray-700">
              Último Mantenimiento - Fecha
            </label>
            <Calendar
              id="ultimoMantenimientoFecha"
              v-model="form.ultimoMantenimiento.fecha"
              dateFormat="yy-mm-dd"
              :showIcon="true"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="ultimoMantenimientoDescripcion" class="block text-sm font-medium text-gray-700">
              Último Mantenimiento - Descripción
            </label>
            <InputText
              id="ultimoMantenimientoDescripcion"
              v-model="form.ultimoMantenimiento.descripcion"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="ultimoMantenimientoTecnico" class="block text-sm font-medium text-gray-700">
              Último Mantenimiento - Técnico
            </label>
            <InputText
              id="ultimoMantenimientoTecnico"
              v-model="form.ultimoMantenimiento.tecnico"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="proximoMantenimiento" class="block text-sm font-medium text-gray-700">
              Próximo Mantenimiento
            </label>
            <Calendar
              id="proximoMantenimiento"
              v-model="form.proximoMantenimiento"
              dateFormat="yy-mm-dd"
              :showIcon="true"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="horasUso" class="block text-sm font-medium text-gray-700">
              Horas de Uso
            </label>
            <InputNumber
              id="horasUso"
              v-model="form.horasUso"
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
          @click="router.push('/maquinas')"
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
import { required } from '@vuelidate/validators';
import { useMachineStore } from '@/stores/MachineStore';
import type { Machine } from '@/types/MachineTypes';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const route = useRoute();
const maquinaStore = useMachineStore();
const toast = useToast();

const isEditing = computed(() => route.params.id !== undefined);
const submitted = ref(false);
const loading = ref(false);

const form = ref<Machine>({
  tipo: '',
  modelo: '',
  marca: '',
  codigoFabrica: '',
  nombreMaquina: '',
  caracteristicas: {
    capacidad: 0,
    unidadCapacidad: '',
    consumoEnergetico: 0,
    dimensiones: {
      alto: 0,
      ancho: 0,
      profundidad: 0,
    },
  },
  fechaInstalacion: new Date(),
  ultimoMantenimiento: {
    fecha: new Date(),
    descripcion: '',
    tecnico: '',
  },
  proximoMantenimiento: new Date(),
  horasUso: 0,
});

const rules = {
  tipo: { required },
  modelo: { required },
  marca: { required },
  nombreMaquina: { required },
};

const v$ = useVuelidate(rules, form);

const tipoOptions = ['Lavadora', 'Secadora', 'Plancha'];
const unidadCapacidadOptions = ['kg', 'lb', 'l'];

onMounted(async () => {
  if (isEditing.value && route.params.id) {
    try {
      await maquinaStore.getMaquinaById(route.params.id as string);
      if (maquinaStore.currentMaquina) {
        form.value = {
          ...maquinaStore.currentMaquina,
          fechaInstalacion: maquinaStore.currentMaquina.fechaInstalacion
            ? new Date(maquinaStore.currentMaquina.fechaInstalacion)
            : new Date(),
          ultimoMantenimiento: {
            ...maquinaStore.currentMaquina.ultimoMantenimiento,
            fecha: maquinaStore.currentMaquina.ultimoMantenimiento.fecha
              ? new Date(maquinaStore.currentMaquina.ultimoMantenimiento.fecha)
              : new Date(),
          },
          proximoMantenimiento: maquinaStore.currentMaquina.proximoMantenimiento
            ? new Date(maquinaStore.currentMaquina.proximoMantenimiento)
            : new Date(),
        };
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los datos de la máquina',
        life: 3000,
      });
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
      await maquinaStore.updateMaquina(route.params.id as string, form.value);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Máquina actualizada exitosamente',
        life: 3000,
      });
    } else {
      await maquinaStore.createMaquina(form.value);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Máquina registrada exitosamente',
        life: 3000,
      });
    }
    router.push('/app/maquinas');
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail:
        (error as any).response?.data?.message ||
        'Error al guardar los datos de la máquina',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>
