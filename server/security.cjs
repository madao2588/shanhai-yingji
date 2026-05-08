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

function rateLimitKey(request) {
  return `rate:${request.socket.remoteAddress || "unknown"}`;
}

function createMemoryRateLimiter({ windowMs = 60000, max = 240 } = {}) {
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

function createUpstashRateLimiter({ windowMs = 60000, max = 240, redisRestUrl, redisRestToken, fetchImpl = fetch } = {}) {
  return async function checkRateLimit(request) {
    const now = Date.now();
    const resetAt = now + windowMs;
    const response = await fetchImpl(`${String(redisRestUrl || "").replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${redisRestToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", rateLimitKey(request)],
        ["PEXPIRE", rateLimitKey(request), String(windowMs), "NX"],
      ]),
    });

    if (!response.ok) {
      const error = new Error("rate limiter unavailable");
      error.status = 503;
      throw error;
    }

    const payload = await response.json();
    const count = Number(payload?.[0]?.result || 0);
    return {
      limited: count > max,
      remaining: Math.max(max - count, 0),
      resetAt,
    };
  };
}

function createRateLimiter(config = {}) {
  if (config.store === "upstash") {
    return createUpstashRateLimiter(config);
  }
  return createMemoryRateLimiter(config);
}

module.exports = {
  createRateLimiter,
  createMemoryRateLimiter,
  createUpstashRateLimiter,
  securityHeaders,
};
