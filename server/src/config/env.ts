import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  CLIENT_ORIGIN: z.string().min(1, 'CLIENT_ORIGIN is required'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Environment validation failed:');
  result.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

type EnvSchema = z.infer<typeof envSchema>;
export const env: EnvSchema = result.data;