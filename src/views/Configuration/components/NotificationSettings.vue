<!-- components/configuration/NotificationSettings.vue -->
<template>
  <SectionCard title="Notifications" icon="pi pi-bell">
    <div class="grid gap-4">
      <div class="field col-12">
        <label>Notification Channels</label>
        <MultiSelect
          v-model="config.notifications.channels"
          :options="notificationChannels"
          display="chip"
          class="w-full"
          @change="saveConfig"
        />
      </div>

      <div class="field col-12 md:col-6">
        <label>Frequency</label>
        <SelectButton
          v-model="config.notifications.frequency"
          :options="['realtime', 'hourly', 'daily']"
          :allowEmpty="false"
          class="w-full"
          @change="saveConfig"
        />
      </div>

      <div class="field col-12 md:col-6">
        <label>Delivery Methods</label>
        <div class="flex flex-wrap gap-3">
          <ToggleButton
            v-for="channel in notificationChannels"
            :key="channel"
            :checked="isChannelSelected(channel)"
            :onLabel="channel"
            :offLabel="channel"
            class="capitalize"
            @change="toggleChannel(channel)"
          />
        </div>
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigurationStore } from '@/stores/ConfigurationStore';
import { storeToRefs } from 'pinia';
import type { NotificationChannel } from '@/types/ConfigurationTypes';

const configStore = useConfigurationStore();
const { config, notificationChannels } = storeToRefs(configStore);
const { toggleNotificationChannel, saveConfig } = configStore;

const selectedChannels = computed({
  get: () => config.value.notifications.channels,
  set: (value) => (config.value.notifications.channels = value)
});

const isChannelSelected = (channel: NotificationChannel) => {
  return config.value.notifications.channels.includes(channel);
};

const toggleChannel = (channel: NotificationChannel) => {
  toggleNotificationChannel(channel);
  saveConfig();
};
</script>