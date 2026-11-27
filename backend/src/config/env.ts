import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/mega_tools'),
  BODY_LIMIT: z.string().default('10mb'),
  EMAIL_PROVIDER: z.enum(['console', 'smtp']).default('console'),
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  EMAIL_FROM: z.string().default(''),
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('uploads'),
  AWS_ACCESS_KEY: z.string().default(''),
  AWS_SECRET_KEY: z.string().default(''),
  BUCKET_REGION: z.string().default(''),
  AWS_BUCKET_NAME: z.string().default(''),
  AWS_BASE_URL: z.string().default(''),
  CURRENCY_EXCHANGE_API_KEY: z.string().default(''),
  REDIS_HOST: z.string().default(''),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  SEO_WORKERS_ENABLED: z
    .string()
    .default('false')
    .transform((value) => value.trim().toLowerCase() === 'true'),
  DATAFORSEO_LOGIN: z.string().default(''),
  DATAFORSEO_PASSWORD: z.string().default(''),
  DATAFORSEO_LOCATION_CODE: z.coerce.number().int().positive().default(2840),
  DATAFORSEO_LANGUAGE_CODE: z.string().trim().min(2).max(8).default('en'),
  OPENAI_API_KEY: z.string().default(''),
  OPENAI_SEO_MODEL: z.string().default(''),
  BULL_BOARD_USER: z.string().default('admin'),
  BULL_BOARD_PASSWORD: z.string().default(''),
  GOOGLE_INDEXING_ENABLED: z
    .string()
    .default('false')
    .transform((value) => value.trim().toLowerCase() === 'true'),
  GOOGLE_INDEXING_KEY_FILE: z.string().default(''),
  PUBLIC_SITE_URL: z.string().default(''),
  SITE_URL: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(parsed.error.format(), null, 2)
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
