<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Configuración de la Cuenta</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información de la Empresa -->
      <Panel header="Información de la Empresa" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="nombreLegal" class="block text-sm font-medium text-gray-700">Nombre Legal</label>
            <InputText
              id="nombreLegal"
              v-model="form.nombreLegal"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="ruc" class="block text-sm font-medium text-gray-700">RUC</label>
            <InputText
              id="ruc"
              v-model="form.ruc"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
            <InputText
              id="telefono"
              v-model="form.telefono"
              class="w-full"
            />
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
            <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
            <InputTextarea
              id="descripcion"
              v-model="form.descripcion"
              class="w-full"
              rows="3"
            />
          </div>
        </div>
      </Panel>

      <!-- Información de la Cuenta -->
      <Panel header="Información de la Cuenta" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="companyName" class="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
            <InputText
              id="companyName"
              v-model="form.companyName"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">Contraseña Actual</label>
            <Password
              id="currentPassword"
              v-model="currentPassword"
              class="w-full"
            />
          </div>

          <div class="p-field">
            <label for="newPassword" class="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <Password
              id="newPassword"
              v-model="newPassword"
              class="w-full"
            />
          </div>
        </div>
      </Panel>

      <!-- Información del Plan -->
      <Panel header="Información del Plan" class="mb-6">
        <div class="p-field">
          <label for="plan" class="block text-sm font-medium text-gray-700">Plan</label>
          <Dropdown
            id="plan"
            v-model="form.plan"
            :options="planOptions"
            class="w-full"
          />
        </div>
      </Panel>

      <div class="flex justify-end gap-4">
        <Button
          type="button"
          label="Cancelar"
          class="p-button-secondary"
          @click="router.push('/dashboard')"
        />
        <Button
          type="submit"
          label="Guardar"
          :loading="loading"
        />
      </div>
    </form>

    <div class="mt-6">
      <h2 class="text-xl font-bold text-gray-800">Gestión</h2>
      <div class="flex flex-col gap-4 mt-4">
        <router-link to="/app/empleados" class="text-blue-600 hover:underline">Lista de Empleados</router-link>
        <router-link to="/app/sucursales" class="text-blue-600 hover:underline">Lista de Sucursales</router-link>
        <router-link to="/app/maquinas" class="text-blue-600 hover:underline">Lista de Maquinas</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCompanyStore } from '@/stores/CompanyStore';
import type { Company } from '@/types/CompanyTypes';

const router = useRouter();
const companyStore = useCompanyStore();

const loading = ref(false);
const currentPassword = ref('');
const newPassword = ref('');

const form = ref<Company>({
  nombreLegal: '',
  ruc: '',
  email: '',
  telefono: '',
  direccion: '',
  descripcion: '',
  companyName: '',
  companyPassword: '',
  plan: '',
  logoUrl: '',
  estado: true,
  sucursales: [],
});

const planOptions = ['basic', 'premium', 'enterprise'];

onMounted(async () => {
  try {
    await companyStore.getCompanyById('your-company-id');
    if (companyStore.currentCompany) {
      form.value = { ...companyStore.currentCompany };
    }
  } catch (error) {
    // Handle error
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (currentPassword.value && newPassword.value) {
      await companyStore.changePassword('your-company-id', currentPassword.value, newPassword.value);
    }
    await companyStore.updateCompany('your-company-id', form.value);
    router.push('/dashboard');
  } catch (error) {
    // Handle error
  } finally {
    loading.value = false;
  }
};
</script>
