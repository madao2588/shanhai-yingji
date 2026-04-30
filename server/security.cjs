function securityHeaders(extra = {}) {
  return {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "cross-origin-resource-policy": "same-origin",
    "content-security-policy":
      "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'self'; frame-ancestors 'none'",
    ...extra,
  };
}

function createRateLimiter({ windowMs = 60000, max = 240 } = {}) {
  const hits = new Map();

  return function checkRateLimit(request) {
    const now = Date.now();
    const key = request.socket.remoteAddress || "unknown";
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (entry.resetAt <= now) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    return {
      limited: entry.count > max,
      remaining: Math.max(max - entry.count, 0),
      resetAt: entry.resetAt,
    };
  };
}

module.exports = {
  createRateLimiter,
  securityHeaders,
};
