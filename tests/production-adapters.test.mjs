import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadConfig } = require("../server/config.cjs");
const { R2MediaStore } = require("../server/media-store.cjs");
const { PostgresDatabase, postgresCollections } = require("../server/postgres-database.cjs");
const { createRateLimiter } = require("../server/security.cjs");

assert.throws(
  () => loadConfig({ nodeEnv: "production" }),
  /Missing production configuration/,
  "production mode should fail fast when required managed services are missing",
);

const productionConfig = loadConfig({
  nodeEnv: "production",
  databaseAdapter: "postgres",
  databaseUrl: "postgres://user:pass@example.com:5432/shanhai",
  mediaStore: "r2",
  publicBaseUrl: "https://travel.example.com",
  allowedOrigin: "https://travel.example.com",
  adminEmails: ["admin@example.com"],
  r2: {
    endpoint: "https://account.r2.cloudflarestorage.com",
    accessKeyId: "key",
    secretAccessKey: "secret",
    bucket: "shanhai",
    publicBaseUrl: "https://media.example.com",
  },
  rateLimit: {
    store: "upstash",
    redisRestUrl: "https://redis.example.com",
    redisRestToken: "token",
  },
});
assert.equal(productionConfig.databaseAdapter, "postgres", "production should use PostgreSQL");
assert.equal(productionConfig.mediaStore, "r2", "production should use R2 object storage");
assert.equal(productionConfig.rateLimit.store, "upstash", "production should use shared Redis rate limiting");

assert.deepEqual(
  postgresCollections,
  ["users", "sessions", "memories", "photos", "likes", "bookmarks", "comments", "follows", "reports", "notifications", "conversations", "moderationActions", "views"],
  "PostgreSQL adapter should provision a table for every persisted collection",
);

const sentCommands = [];
const mediaStore = new R2MediaStore({
  endpoint: "https://account.r2.cloudflarestorage.com",
  accessKeyId: "key",
  secretAccessKey: "secret",
  bucket: "shanhai",
  publicBaseUrl: "https://media.example.com",
  client: {
    async send(command) {
      sentCommands.push(command.constructor.name);
    },
  },
});
const upload = await mediaStore.save({
  mimeType: "image/png",
  dataUrl: "data:image/png;base64,ZmFrZQ==",
  alt: "test",
});
assert.match(upload.url, /^https:\/\/media\.example\.com\/uploads\/.+\.png$/, "R2 uploads should return public media URLs");
assert.equal(upload.storageKey.startsWith("uploads/"), true, "R2 uploads should persist an object storage key");
await mediaStore.delete(upload);
assert.deepEqual(sentCommands, ["PutObjectCommand", "DeleteObjectCommand"], "R2 store should write and delete objects through S3-compatible commands");
assert.equal(await mediaStore.health(), "r2", "R2 media store should expose a production health probe label");

const pgQueries = [];
const postgres = new PostgresDatabase({
  pool: {
    async query(sql) {
      pgQueries.push(sql);
      return { rows: [] };
    },
    async end() {},
  },
});
assert.equal(await postgres.health(), "postgres", "PostgreSQL adapter should expose a health probe");
assert.equal(pgQueries.some((sql) => /select 1/.test(sql)), true, "PostgreSQL health should run a lightweight query");

const redisCalls = [];
const limiter = createRateLimiter({
  store: "upstash",
  max: 1,
  windowMs: 60000,
  redisRestUrl: "https://redis.example.com",
  redisRestToken: "token",
  fetchImpl: async (url, options) => {
    redisCalls.push({ url, options });
    return {
      ok: true,
      async json() {
        return [{ result: redisCalls.length }];
      },
    };
  },
});
const fakeRequest = { socket: { remoteAddress: "127.0.0.1" } };
assert.equal((await limiter(fakeRequest)).limited, false, "first shared rate-limit hit should pass");
assert.equal((await limiter(fakeRequest)).limited, true, "hits above the limit should be rejected");
assert.equal(redisCalls[0].url, "https://redis.example.com/pipeline", "Upstash limiter should use the REST pipeline endpoint");
assert.match(redisCalls[0].options.headers.authorization, /^Bearer token$/, "Upstash limiter should authenticate with the REST token");
