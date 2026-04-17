import { z } from 'zod';

const configSchema = z.object({
  BASE_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
});

const config = configSchema.safeParse({
  BASE_URL: import.meta.env.VITE_API_URL,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

if (!config.success) {
  console.error('Invalid configuration:', config.error.format());
  throw new Error('Invalid configuration');
}

const envConfig = config.data;

export default envConfig;
