const fs = require("node:fs/promises");
const path = require("node:path");
const { DeleteObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const uploadExtensions = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

function createSafeUploadName(mimeType) {
  const ext = uploadExtensions.get(mimeType) || ".bin";
  return `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
}

function decodeDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return null;
  }
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

class LocalMediaStore {
  constructor({ dataDir }) {
    this.uploadDir = path.join(dataDir, "uploads");
  }

  async save(payload) {
    const decoded = decodeDataUrl(payload.dataUrl);
    if (!decoded) {
      return null;
    }

    const fileName = createSafeUploadName(payload.mimeType || decoded.mimeType);
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(path.join(this.uploadDir, fileName), decoded.buffer);
    return {
      fileName,
      storageKey: fileName,
      mimeType: payload.mimeType || decoded.mimeType,
      url: `/uploads/${fileName}`,
      alt: payload.alt,
    };
  }

  async delete(photo) {
    const key = path.basename(photo?.storageKey || photo?.fileName || "");
    if (key) {
      await fs.rm(path.join(this.uploadDir, key), { force: true });
    }
  }

  async health() {
    await fs.mkdir(this.uploadDir, { recursive: true });
    return "local";
  }
}

class R2MediaStore {
  constructor({ endpoint, accessKeyId, secretAccessKey, bucket, publicBaseUrl, client }) {
    this.bucket = bucket;
    this.publicBaseUrl = String(publicBaseUrl || "").replace(/\/+$/, "");
    this.client =
      client ||
      new S3Client({
        region: "auto",
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
  }

  async save(payload) {
    const decoded = decodeDataUrl(payload.dataUrl);
    if (!decoded) {
      return null;
    }

    const fileName = createSafeUploadName(payload.mimeType || decoded.mimeType);
    const storageKey = `uploads/${fileName}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: decoded.buffer,
        ContentType: payload.mimeType || decoded.mimeType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    return {
      fileName,
      storageKey,
      mimeType: payload.mimeType || decoded.mimeType,
      url: `${this.publicBaseUrl}/${storageKey}`,
      alt: payload.alt,
    };
  }

  async delete(photo) {
    const storageKey = photo?.storageKey || photo?.fileName;
    if (!storageKey) {
      return;
    }
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      }),
    );
  }

  async health() {
    return "r2";
  }
}

function createMediaStore(config, overrides = {}) {
  if (overrides.mediaStore && typeof overrides.mediaStore !== "string") {
    return overrides.mediaStore;
  }
  if (config.mediaStore === "r2") {
    return new R2MediaStore({ ...config.r2, client: overrides.r2Client });
  }
  return new LocalMediaStore({ dataDir: config.dataDir });
}

module.exports = {
  createMediaStore,
  decodeDataUrl,
  LocalMediaStore,
  R2MediaStore,
};
