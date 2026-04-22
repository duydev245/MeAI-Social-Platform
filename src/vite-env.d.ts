/// <reference types="vite/client" />

interface Window {
  __MEAI_RUNTIME_CONFIG__?: {
    VITE_API_URL?: string;
    VITE_GOOGLE_CLIENT_ID?: string;
    VITE_NODE_ENV?: 'development' | 'production';
  };
}
