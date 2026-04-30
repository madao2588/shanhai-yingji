const path = require("node:path");

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function loadConfig(overrides = {}) {
  const rootDir = overrides.rootDir || path.resolve(__dirname, "..");
  const adminEmails =
    overrides.adminEmails ||
    String(process.env.SHANHAI_ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

  return {
    port: Number(overrides.port || process.env.PORT || 4173),
    publicDir: overrides.publicDir || rootDir,
    dataDir: overrides.dataDir || process.env.SHANHAI_DATA_DIR || path.resolve(rootDir, ".data"),
    allowedOrigin: overrides.allowedOrigin || process.env.SHANHAI_ALLOWED_ORIGIN || "",
    adminEmails,
    maxJsonBytes: overrides.maxJsonBytes || numberFromEnv("SHANHAI_MAX_JSON_BYTES", 8 * 1024 * 1024),
    maxUploadBytes: overrides.maxUploadBytes || numberFromEnv("SHANHAI_MAX_UPLOAD_BYTES", 5 * 1024 * 1024),
    rateLimit: {
      windowMs: overrides.rateLimit?.windowMs || numberFromEnv("SHANHAI_RATE_LIMIT_WINDOW_MS", 60 * 1000),
      max: overrides.rateLimit?.max || numberFromEnv("SHANHAI_RATE_LIMIT_MAX", 240),
    },
  };
}

module.exports = {
  loadConfig,
};
