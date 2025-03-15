<!-- components/configuration/AdvancedSection.vue -->
<template>
  <SectionCard title="Advanced" icon="pi pi-wrench">
    <div class="grid gap-4">
      <div class="field col-12 md:col-6">
        <label>Cache TTL (seconds)</label>
        <InputNumber
          v-model="config.advanced.cacheTTL"
          :min="300"
          :max="86400"
          mode="decimal"
          showButtons
          class="w-full"
          @input="saveConfig"
        />
      </div>

      <div class="field col-12 md:col-6">
        <label>Data Export Format</label>
        <Dropdown
          v-model="config.advanced.dataExportFormat"
          :options="['json', 'csv', 'xml']"
          class="w-full"
          @change="saveConfig"
        />
      </div>

      <div class="field col-12">
        <div class="flex gap-4">
          <Button
            label="Export All Data"
            icon="pi pi-download"
            class="p-button-help"
            @click="exportData"
          />
          <Button
            label="Clear Cache"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="clearCache"
          />
        </div>
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { useConfigurationStore } from '@/stores/ConfigurationStore';
import { storeToRefs } from 'pinia';

const configStore = useConfigurationStore();
const { config } = storeToRefs(configStore);
const { saveConfig } = configStore;

const exportData = () => {
  const data = JSON.stringify(config.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `config-export-${new Date().toISOString()}.${config.value.advanced.dataExportFormat}`;
  link.click();
};

const clearCache = () => {
  localStorage.removeItem('appConfig');
  window.location.reload();
};
</script>