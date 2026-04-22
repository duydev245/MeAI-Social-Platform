import { z } from 'zod';

const configSchema = z.object({
  BASE_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
});

const runtimeConfig = window.__MEAI_RUNTIME_CONFIG__ ?? {};

const config = configSchema.safeParse({
  BASE_URL: runtimeConfig.VITE_API_URL ?? import.meta.env.VITE_API_URL,
  GOOGLE_CLIENT_ID: runtimeConfig.VITE_GOOGLE_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_CLIENT_ID,
  NODE_ENV: runtimeConfig.VITE_NODE_ENV ?? import.meta.env.VITE_NODE_ENV,
});

if (!config.success) {
  console.error('Invalid configuration:', config.error.format());
  throw new Error('Invalid configuration');
}

const envConfig = config.data;

export default envConfig;
