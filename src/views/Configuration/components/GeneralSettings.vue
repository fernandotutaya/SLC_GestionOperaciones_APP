<!-- components/configuration/GeneralSettings.vue -->
<template>
  <SectionCard title="General Settings" icon="pi pi-cog">
    <div class="grid gap-4">
      <div class="field col-12 md:col-6">
        <label>Language</label>
        <Dropdown
          v-model="config.language"
          :options="availableLanguages"
          optionLabel=""
          placeholder="Select Language"
          class="w-full"
          @change="saveConfig"
        />
      </div>

      <div class="field col-12 md:col-6">
        <label>Theme</label>
        <SelectButton
          v-model="config.theme"
          :options="['light', 'dark', 'system']"
          @change="saveConfig"
        >
          <template #option="slotProps">
            <i :class="themeIcon(slotProps.option)" class="mr-2" />
            {{ slotProps.option }}
          </template>
        </SelectButton>
      </div>

      <div class="field col-12">
        <ToggleButton
          v-model="config.animationsEnabled"
          onLabel="Animations Enabled"
          offLabel="Animations Disabled"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          class="w-full"
          @change="saveConfig"
        />
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { useConfigurationStore } from '@/stores/ConfigurationStore';
import { storeToRefs } from 'pinia';

const configStore = useConfigurationStore();
const { config, availableLanguages } = storeToRefs(configStore);
const { saveConfig } = configStore;

const themeIcon = (theme: string) => ({
  'light': 'pi pi-sun',
  'dark': 'pi pi-moon',
  'system': 'pi pi-desktop'
}[theme]);
</script>