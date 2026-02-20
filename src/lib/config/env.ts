import { z } from "zod";

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_TYPE: z.enum(["sqlite", "postgres", "mysql"]).default("sqlite"),
  DATABASE_URL: z.string().default("file:./data/recurb.db"),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  SESSION_SECRET: z.string().min(32),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(15).default(10),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SMTP_FROM_NAME: z.string().default("Recurb"),
  SENDGRID_API_KEY: z.string().optional(),
  MAILGUN_API_KEY: z.string().optional(),
  MAILGUN_DOMAIN: z.string().optional(),

  // Storage
  STORAGE_TYPE: z.enum(["local", "s3", "azure", "gcs"]).default("local"),
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE: z.coerce.number().default(10485760),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AZURE_STORAGE_ACCOUNT: z.string().optional(),
  AZURE_STORAGE_KEY: z.string().optional(),
  AZURE_STORAGE_CONTAINER: z.string().optional(),
  GCS_PROJECT_ID: z.string().optional(),
  GCS_BUCKET: z.string().optional(),
  GCS_KEYFILE: z.string().optional(),

  // Redis
  REDIS_ENABLED: z.coerce.boolean().default(false),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),

  // Webhooks
  SLACK_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),
  SLACK_BOT_TOKEN: z.string().optional(),
  DISCORD_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),

  // SSO/SAML
  SAML_ENABLED: z.coerce.boolean().default(false),
  SAML_ENTRY_POINT: z.string().optional(),
  SAML_ISSUER: z.string().optional(),
  SAML_CERT: z.string().optional(),
  SAML_CALLBACK_URL: z.string().url().optional(),

  // API & Rate Limiting
  API_RATE_LIMIT_ENABLED: z.coerce.boolean().default(true),
  API_RATE_LIMIT_WINDOW: z.string().default("15m"),
  API_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  // Monitoring
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FORMAT: z.enum(["json", "pretty"]).default("json"),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default("development"),
  METRICS_ENABLED: z.coerce.boolean().default(false),
  METRICS_PORT: z.coerce.number().default(9090),

  // Backup
  BACKUP_ENABLED: z.coerce.boolean().default(false),
  BACKUP_SCHEDULE: z.string().default("0 2 * * *"),
  BACKUP_RETENTION_DAYS: z.coerce.number().default(30),
  BACKUP_PATH: z.string().default("./backups"),

  // Feature Flags
  FEATURE_CSV_IMPORT: z.coerce.boolean().default(true),
  FEATURE_PDF_UPLOAD: z.coerce.boolean().default(true),
  FEATURE_WEBHOOKS: z.coerce.boolean().default(true),
  FEATURE_API_ACCESS: z.coerce.boolean().default(true),
  FEATURE_MULTI_TENANT: z.coerce.boolean().default(false),
  FEATURE_SSO: z.coerce.boolean().default(false),

  // Setup
  SETUP_COMPLETED: z.coerce.boolean().default(false),
  DEFAULT_ADMIN_EMAIL: z.string().email().default("admin@example.com"),
  DEFAULT_ADMIN_PASSWORD: z.string().default("changeme"),

  // Third-Party
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  POSTHOG_API_KEY: z.string().optional(),
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Development
  DEBUG: z.coerce.boolean().default(false),
  SEED_DEMO_DATA: z.coerce.boolean().default(false),
  DISABLE_AUTH: z.coerce.boolean().default(false),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
      throw new Error(`Environment validation failed:\n${missing.join("\n")}`);
    }
    throw error;
  }
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;

// Run runtime validation on import
if (typeof window === "undefined") {
  import("./validate").then(({ validateRuntimeConfig }) => {
    validateRuntimeConfig();
  }).catch((error) => {
    console.error("Runtime config validation failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  });
}
