const crypto = require("node:crypto");

const passwordIterations = 120000;
const keyLength = 32;
const digest = "sha256";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const normalized = String(password || "");
  const hash = crypto.pbkdf2Sync(normalized, salt, passwordIterations, keyLength, digest).toString("hex");
  return `${passwordIterations}:${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [iterations, salt, expectedHash] = String(storedHash || "").split(":");
  if (!iterations || !salt || !expectedHash) {
    return false;
  }

  const actualHash = crypto
    .pbkdf2Sync(String(password || ""), salt, Number(iterations), keyLength, digest)
    .toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actualHash, "hex"), Buffer.from(expectedHash, "hex"));
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role || "member",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  createToken,
  hashPassword,
  publicUser,
  verifyPassword,
};
