import { env } from "./env";

class ConfigValidationError extends Error {
  constructor(message: string) {
    super(`Configuration Error: ${message}`);
    this.name = "ConfigValidationError";
  }
}

export function validateRuntimeConfig() {
  const errors: string[] = [];

  // Database validation
  if (env.DATABASE_TYPE === "postgres" && !env.DATABASE_URL.includes("postgresql://")) {
    errors.push("DATABASE_URL must be a PostgreSQL connection string when DATABASE_TYPE is 'postgres'");
  }
  if (env.DATABASE_TYPE === "mysql" && !env.DATABASE_URL.includes("mysql://")) {
    errors.push("DATABASE_URL must be a MySQL connection string when DATABASE_TYPE is 'mysql'");
  }

  // Storage validation
  if (env.STORAGE_TYPE === "s3") {
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET) {
      errors.push("AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET are required when STORAGE_TYPE is 's3'");
    }
  }
  if (env.STORAGE_TYPE === "azure") {
    if (!env.AZURE_STORAGE_ACCOUNT || !env.AZURE_STORAGE_KEY || !env.AZURE_STORAGE_CONTAINER) {
      errors.push("AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY, and AZURE_STORAGE_CONTAINER are required when STORAGE_TYPE is 'azure'");
    }
  }
  if (env.STORAGE_TYPE === "gcs") {
    if (!env.GCS_PROJECT_ID || !env.GCS_BUCKET) {
      errors.push("GCS_PROJECT_ID and GCS_BUCKET are required when STORAGE_TYPE is 'gcs'");
    }
  }

  // Email validation
  const hasSmtp = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD;
  const hasSendGrid = env.SENDGRID_API_KEY;
  const hasMailgun = env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN;
  
  if (!hasSmtp && !hasSendGrid && !hasMailgun && env.NODE_ENV === "production") {
    errors.push("At least one email provider must be configured in production (SMTP, SendGrid, or Mailgun)");
  }

  // Redis validation
  if (env.REDIS_ENABLED && !env.REDIS_URL) {
    errors.push("REDIS_URL is required when REDIS_ENABLED is true");
  }

  // SAML validation
  if (env.SAML_ENABLED || env.FEATURE_SSO) {
    if (!env.SAML_ENTRY_POINT || !env.SAML_ISSUER || !env.SAML_CERT) {
      errors.push("SAML_ENTRY_POINT, SAML_ISSUER, and SAML_CERT are required when SAML is enabled");
    }
  }

  // Production security checks
  if (env.NODE_ENV === "production") {
    if (env.JWT_SECRET === "your-super-secret-jwt-key-change-this-in-production") {
      errors.push("JWT_SECRET must be changed from default value in production");
    }
    if (env.SESSION_SECRET === "your-session-secret-change-this") {
      errors.push("SESSION_SECRET must be changed from default value in production");
    }
    if (env.DEFAULT_ADMIN_PASSWORD === "changeme") {
      errors.push("DEFAULT_ADMIN_PASSWORD must be changed from default value in production");
    }
    if (env.DISABLE_AUTH) {
      errors.push("DISABLE_AUTH must be false in production");
    }
    if (env.DATABASE_TYPE === "sqlite") {
      console.warn("Warning: SQLite is not recommended for production. Consider using PostgreSQL or MySQL.");
    }
  }

  // Feature flag dependencies
  if (env.FEATURE_WEBHOOKS && !env.REDIS_ENABLED) {
    console.warn("Warning: FEATURE_WEBHOOKS is enabled but REDIS_ENABLED is false. Webhook delivery may be unreliable.");
  }

  if (errors.length > 0) {
    throw new ConfigValidationError(errors.join("\n- "));
  }
}

export function getConfigSummary() {
  return {
    environment: env.NODE_ENV,
    database: env.DATABASE_TYPE,
    storage: env.STORAGE_TYPE,
    redis: env.REDIS_ENABLED,
    features: {
      csvImport: env.FEATURE_CSV_IMPORT,
      pdfUpload: env.FEATURE_PDF_UPLOAD,
      webhooks: env.FEATURE_WEBHOOKS,
      apiAccess: env.FEATURE_API_ACCESS,
      multiTenant: env.FEATURE_MULTI_TENANT,
      sso: env.FEATURE_SSO,
    },
    setupCompleted: env.SETUP_COMPLETED,
  };
}
