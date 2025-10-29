/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_SENSORS: string;
  readonly VITE_API_RELAY_ON: string;
  readonly VITE_API_RELAY_OFF: string;
  readonly VITE_WS_URL: string;
  readonly VITE_MAP_DEFAULT_LAT: string;
  readonly VITE_MAP_DEFAULT_LNG: string;
  readonly VITE_MAP_DEFAULT_ZOOM: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_EXPORT: string;
  readonly VITE_POLL_INTERVAL_DASHBOARD: string;
  readonly VITE_POLL_INTERVAL_MAP: string;
  readonly VITE_AQI_THRESHOLD_GOOD: string;
  readonly VITE_AQI_THRESHOLD_MODERATE: string;
  readonly VITE_AQI_THRESHOLD_UNHEALTHY: string;
  readonly VITE_AQI_THRESHOLD_VERY_UNHEALTHY: string;
  readonly VITE_AQI_THRESHOLD_HAZARDOUS: string;
  readonly VITE_DATA_RETENTION_DAYS: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_GITHUB_REPO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
