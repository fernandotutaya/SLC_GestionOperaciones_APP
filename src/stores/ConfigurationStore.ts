// stores/ConfigurationStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AppConfig, NotificationChannel } from '@/types/ConfigurationTypes';

export const useConfigurationStore = defineStore('ConfigurationStore', () => {
  const config = ref<AppConfig>({
    language: 'en',
    theme: 'system',
    animationsEnabled: true,
    security: {
      twoFactorAuth: false,
      passwordExpiration: 90,
      failedAttemptsLock: 5,
    },
    notifications: {
      email: true,
      push: false,
      frequency: 'daily',
      channels: ['email'],
    },
    advanced: {
      cacheTTL: 3600,
      dataExportFormat: 'json',
    },
  });

  const availableLanguages = ['en', 'es', 'fr', 'de'];
  const notificationChannels: NotificationChannel[] = ['email', 'sms', 'slack', 'webhook'];

  // Getters
  const currentTheme = computed(() => {
    if (config.value.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return config.value.theme;
  });

  // Actions
  const loadConfig = async () => {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      config.value = JSON.parse(savedConfig);
    }
  };

  const saveConfig = debounce(() => {
    localStorage.setItem('appConfig', JSON.stringify(config.value));
  }, 500);

  const resetToDefaults = () => {
    config.value = {
      language: 'en',
      theme: 'system',
      animationsEnabled: true,
      security: {
        twoFactorAuth: false,
        passwordExpiration: 90,
        failedAttemptsLock: 5,
      },
      notifications: {
        email: true,
        push: false,
        frequency: 'daily',
        channels: ['email'],
      },
      advanced: {
        cacheTTL: 3600,
        dataExportFormat: 'json',
      },
    };
  };

  const toggleNotificationChannel = (channel: NotificationChannel) => {
    const index = config.value.notifications.channels.indexOf(channel);
    if (index === -1) {
      config.value.notifications.channels.push(channel);
    } else {
      config.value.notifications.channels.splice(index, 1);
    }
    saveConfig();
  };

  return {
    config,
    currentTheme,
    availableLanguages,
    notificationChannels,
    loadConfig,
    saveConfig,
    resetToDefaults,
    toggleNotificationChannel,
  };
});

function debounce(fn: Function, delay: number) {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}