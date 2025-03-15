<!-- components/configuration/SecuritySettings.vue -->
<template>
  <SectionCard title="Security" icon="pi pi-shield">
    <div class="grid gap-4">
      <div class="field col-12 md:col-6">
        <label>Two-Factor Authentication</label>
        <ToggleButton
          v-model="config.security.twoFactorAuth"
          onLabel="Enabled"
          offLabel="Disabled"
          class="w-full"
          @change="handle2FAChange"
        />
      </div>

      <div class="field col-12 md:col-6">
        <label>Password Expiration (days)</label>
        <InputNumber
          v-model="config.security.passwordExpiration"
          :min="1"
          :max="365"
          showButtons
          class="w-full"
          @input="saveConfig"
        />
      </div>

      <div class="field col-12">
        <label>Account Lock Threshold</label>
        <Slider
          v-model="config.security.failedAttemptsLock"
          :min="1"
          :max="10"
          :step="1"
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
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();
const configStore = useConfigurationStore();
const { config } = storeToRefs(configStore);
const { saveConfig } = configStore;

const handle2FAChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked;
  if (value) {
    confirm.require({
      message: 'Are you sure you want to enable two-factor authentication?',
      header: 'Enable 2FA',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        config.value.security.twoFactorAuth = true;
        saveConfig();
      },
      reject: () => {
        config.value.security.twoFactorAuth = false;
      }
    });
  } else {
    config.value.security.twoFactorAuth = false;
    saveConfig();
  }
};
</script>