const path = require("node:path");

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function stringFromEnv(name, fallback = "") {
  return String(process.env[name] || fallback).trim();
}

function requireProductionValues(config) {
  if (config.nodeEnv !== "production") {
    return;
  }

  const missing = [];
  if (config.databaseAdapter !== "postgres") {
    missing.push("SHANHAI_DATABASE_ADAPTER=postgres");
  }
  if (!config.databaseUrl) {
    missing.push("DATABASE_URL");
  }
  if (config.mediaStore !== "r2") {
    missing.push("SHANHAI_MEDIA_STORE=r2");
  }
  for (const [name, value] of Object.entries(config.r2)) {
    if (!value) {
      missing.push(`R2_${name.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`);
    }
  }
  if (config.rateLimit.store !== "upstash") {
    missing.push("SHANHAI_RATE_LIMIT_STORE=upstash");
  }
  if (!config.rateLimit.redisRestUrl) {
    missing.push("UPSTASH_REDIS_REST_URL");
  }
  if (!config.rateLimit.redisRestToken) {
    missing.push("UPSTASH_REDIS_REST_TOKEN");
  }
  if (!config.publicBaseUrl) {
    missing.push("SHANHAI_PUBLIC_BASE_URL");
  }
  if (!config.allowedOrigin) {
    missing.push("SHANHAI_ALLOWED_ORIGIN");
  }
  if (!config.adminEmails.length) {
    missing.push("SHANHAI_ADMIN_EMAILS");
  }

  if (missing.length) {
    throw new Error(`Missing production configuration: ${missing.join(", ")}`);
  }
}

function loadConfig(overrides = {}) {
  const rootDir = overrides.rootDir || path.resolve(__dirname, "..");
  const nodeEnv = overrides.nodeEnv || process.env.NODE_ENV || "development";
  const databaseUrl = overrides.databaseUrl || stringFromEnv("DATABASE_URL");
  const databaseAdapter = overrides.databaseAdapter || stringFromEnv("SHANHAI_DATABASE_ADAPTER", databaseUrl ? "postgres" : "json");
  const mediaStore =
    typeof overrides.mediaStore === "string" ? overrides.mediaStore : stringFromEnv("SHANHAI_MEDIA_STORE", nodeEnv === "production" ? "r2" : "local");
  const adminEmails =
    overrides.adminEmails ||
    String(process.env.SHANHAI_ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

  const config = {
    nodeEnv,
    port: Number(overrides.port || process.env.PORT || 4173),
    publicDir: overrides.publicDir || rootDir,
    dataDir: overrides.dataDir || process.env.SHANHAI_DATA_DIR || path.resolve(rootDir, ".data"),
    databaseAdapter,
    databaseUrl,
    databaseSsl: overrides.databaseSsl ?? (stringFromEnv("DATABASE_SSL", nodeEnv === "production" ? "true" : "false") !== "false" ? { rejectUnauthorized: false } : false),
    mediaStore,
    publicBaseUrl: overrides.publicBaseUrl || stringFromEnv("SHANHAI_PUBLIC_BASE_URL"),
    allowedOrigin: overrides.allowedOrigin || process.env.SHANHAI_ALLOWED_ORIGIN || "",
    adminEmails,
    maxJsonBytes: overrides.maxJsonBytes || numberFromEnv("SHANHAI_MAX_JSON_BYTES", 8 * 1024 * 1024),
    maxUploadBytes: overrides.maxUploadBytes || numberFromEnv("SHANHAI_MAX_UPLOAD_BYTES", 5 * 1024 * 1024),
    r2: {
      endpoint: overrides.r2?.endpoint || stringFromEnv("R2_ENDPOINT"),
      accessKeyId: overrides.r2?.accessKeyId || stringFromEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: overrides.r2?.secretAccessKey || stringFromEnv("R2_SECRET_ACCESS_KEY"),
      bucket: overrides.r2?.bucket || stringFromEnv("R2_BUCKET"),
      publicBaseUrl: overrides.r2?.publicBaseUrl || stringFromEnv("R2_PUBLIC_BASE_URL") || overrides.publicBaseUrl || stringFromEnv("SHANHAI_PUBLIC_BASE_URL"),
    },
    rateLimit: {
      windowMs: overrides.rateLimit?.windowMs || numberFromEnv("SHANHAI_RATE_LIMIT_WINDOW_MS", 60 * 1000),
      max: overrides.rateLimit?.max || numberFromEnv("SHANHAI_RATE_LIMIT_MAX", 240),
      store: overrides.rateLimit?.store || stringFromEnv("SHANHAI_RATE_LIMIT_STORE", nodeEnv === "production" ? "upstash" : "memory"),
      redisRestUrl: overrides.rateLimit?.redisRestUrl || stringFromEnv("UPSTASH_REDIS_REST_URL"),
      redisRestToken: overrides.rateLimit?.redisRestToken || stringFromEnv("UPSTASH_REDIS_REST_TOKEN"),
      fetchImpl: overrides.rateLimit?.fetchImpl,
    },
  };

  requireProductionValues(config);
  return config;
}

module.exports = {
  loadConfig,
};
