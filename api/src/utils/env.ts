import { z } from 'zod';

// Validation des variables d'environnement pour éviter les surprises en runtime
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(10).optional(),
  OPENAI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().optional()
});

export const env = EnvSchema.parse(process.env);


