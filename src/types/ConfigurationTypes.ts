// types/configTypes.ts
export interface AppConfig {
    language: string;
    theme: 'light' | 'dark' | 'system';
    animationsEnabled: boolean;
    security: {
      twoFactorAuth: boolean;
      passwordExpiration: number;
      failedAttemptsLock: number;
    };
    notifications: {
      email: boolean;
      push: boolean;
      frequency: 'realtime' | 'hourly' | 'daily';
      channels: string[];
    };
    advanced: {
      cacheTTL: number;
      dataExportFormat: 'json' | 'csv' | 'xml';
    };
  }
  
  export type NotificationChannel = 'email' | 'sms' | 'slack' | 'webhook';