<!-- views/ConfigurationView.vue -->
<template>
  <div class="config-view p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-100">
          Configuracion de la aplicación
        </h1>
        <Button
          label="Reset Defaults"
          icon="pi pi-refresh"
          class="p-button-outlined p-button-danger"
          @click="confirmReset"
        />
      </div>

      <TabView class="custom-tabview">
        <TabPanel v-for="tab in tabs" :key="tab.key" :header="tab.label" :value="tab.label">
          <component :is="tab.component" />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useConfigurationStore } from '@/stores/ConfigurationStore';

const confirm = useConfirm();
const configStore = useConfigurationStore();

const tabs = ref([
  { key: 'general', label: 'General', component: defineAsyncComponent(() => import('./components/GeneralSettings.vue')) },
  { key: 'security', label: 'Seguridad', component: defineAsyncComponent(() => import('./components/SecuritySettings.vue')) },
  { key: 'notifications', label: 'Notificaciones', component: defineAsyncComponent(() => import('./components/NotificationSettings.vue')) },
  { key: 'advanced', label: 'Avanzada', component: defineAsyncComponent(() => import('./components/sections/AdvanceSection.vue')) },
  {key: 'account', label: 'Cuenta', component: defineAsyncComponent(() => import('./components/AccountSettings.vue'))},
]);

onMounted(async () => {
  await configStore.loadConfig();
});

const confirmReset = () => {
  confirm.require({
    message: 'Are you sure you want to reset all settings to default?',
    header: 'Reset Configuration',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      configStore.resetToDefaults();
      configStore.saveConfig();
    },
    reject: () => {}
  });
};
</script>

<style>
.custom-tabview .p-tabview-nav {
  @apply bg-surface-50 dark:bg-surface-800 rounded-lg p-2;
}

.custom-tabview .p-tabview-nav-link {
  @apply transition-all duration-300 hover:bg-surface-100 dark:hover:bg-surface-700;
}
</style>