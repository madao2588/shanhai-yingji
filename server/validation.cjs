const allowedStatuses = new Set(["private", "unlisted", "public"]);
const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function fail(message) {
  const error = new Error(message);
  error.status = 400;
  throw error;
}

function requireEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    fail("valid email is required");
  }
  return email;
}

function requirePassword(value) {
  const password = String(value || "");
  if (password.length < 10 || password.length > 200) {
    fail("password must be between 10 and 200 characters");
  }
  return password;
}

function cleanText(value, max, fallback = "") {
  const text = String(value || "").trim();
  if (text.length > max) {
    fail(`text exceeds ${max} characters`);
  }
  return text || fallback;
}

function cleanTags(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 12).map((tag) => cleanText(tag, 32)).filter(Boolean);
}

function cleanTextList(value, maxItems = 12, maxLength = 80) {
  if (Array.isArray(value)) {
    return value.slice(0, maxItems).map((item) => cleanText(item, maxLength)).filter(Boolean);
  }
  const text = cleanText(value, maxLength * maxItems);
  return text
    ? text
        .split(/[,，\n]/)
        .map((item) => cleanText(item, maxLength))
        .filter(Boolean)
        .slice(0, maxItems)
    : [];
}

function validateAuthInput(input = {}) {
  return {
    name: cleanText(input.name, 60, "山海旅人"),
    email: requireEmail(input.email),
    password: requirePassword(input.password),
  };
}

function validateLoginInput(input = {}) {
  return {
    email: requireEmail(input.email),
    password: String(input.password || ""),
  };
}

function validateProfileInput(input = {}) {
  const output = {};
  if (Object.prototype.hasOwnProperty.call(input, "name")) {
    output.name = cleanText(input.name, 60, "山海旅人");
  }
  if (Object.prototype.hasOwnProperty.call(input, "username")) {
    const username = cleanText(input.username, 40).toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(username)) {
      fail("username must use 3-40 lowercase letters, numbers, or hyphens");
    }
    output.username = username;
  }
  return output;
}

function validateMemoryInput(input = {}, { partial = false } = {}) {
  const output = {};

  if (!partial || Object.prototype.hasOwnProperty.call(input, "title")) {
    output.title = cleanText(input.title, 120, partial ? "" : "未命名映记");
  }
  if (Object.prototype.hasOwnProperty.call(input, "body")) {
    output.body = cleanText(input.body, 12000);
  }
  if (Object.prototype.hasOwnProperty.call(input, "locationLabel") || Object.prototype.hasOwnProperty.call(input, "location")) {
    output.locationLabel = cleanText(input.locationLabel || input.location, 120);
  }
  ["country", "city", "occurredAt", "destinationId", "season", "budget", "audience"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      output[field] = cleanText(input[field], 80);
    }
  });
  if (Object.prototype.hasOwnProperty.call(input, "route")) {
    output.route = cleanTextList(input.route, 20, 100);
  }
  if (Object.prototype.hasOwnProperty.call(input, "visited")) {
    output.visited = Boolean(input.visited);
  }
  if (Object.prototype.hasOwnProperty.call(input, "tags")) {
    output.tags = cleanTags(input.tags);
  }
  if (Object.prototype.hasOwnProperty.call(input, "status")) {
    if (!allowedStatuses.has(input.status)) {
      fail("status must be private, unlisted, or public");
    }
    output.status = input.status;
  }

  return output;
}

function validateCommentInput(input = {}) {
  return {
    body: cleanText(input.body, 1200),
    parentId: cleanText(input.parentId, 80),
  };
}

function validateConversationId(value) {
  const conversationId = cleanText(value, 80).toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/.test(conversationId)) {
    fail("conversation id is invalid");
  }
  return conversationId;
}

function validateConversationMessageInput(input = {}) {
  const body = cleanText(input.body, 1200);
  if (!body) {
    fail("message body is required");
  }
  return {
    body,
    title: cleanText(input.title, 80),
  };
}

function validateReportInput(input = {}) {
  const targetType = cleanText(input.targetType, 30);
  if (!["memory", "comment", "profile"].includes(targetType)) {
    fail("targetType must be memory, comment, or profile");
  }
  return {
    targetType,
    targetId: cleanText(input.targetId, 80),
    reason: cleanText(input.reason, 1000),
  };
}

function validateModerationInput(input = {}) {
  const status = cleanText(input.status, 40);
  if (!["open", "reviewing", "resolved", "removed", "ignored"].includes(status)) {
    fail("moderation status is invalid");
  }
  return {
    status,
    action: cleanText(input.action, 80),
    notes: cleanText(input.notes, 1000),
  };
}

function validateUploadInput(input = {}, maxUploadBytes = 5 * 1024 * 1024) {
  const dataUrl = String(input.dataUrl || "");
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    fail("valid dataUrl is required");
  }

  const dataUrlMimeType = match[1];
  const mimeType = input.mimeType || dataUrlMimeType;
  if (mimeType !== dataUrlMimeType) {
    fail("upload mimeType must match dataUrl media type");
  }
  if (!allowedImageTypes.has(mimeType)) {
    fail("only png, jpeg, webp, and gif images are allowed");
  }

  const byteLength = Buffer.byteLength(match[2], "base64");
  if (byteLength > maxUploadBytes) {
    fail("uploaded image is too large");
  }

  return {
    fileName: cleanText(input.fileName, 120, "upload"),
    mimeType,
    dataUrl,
    alt: cleanText(input.alt, 160),
  };
}

module.exports = {
  validateAuthInput,
  validateCommentInput,
  validateConversationId,
  validateConversationMessageInput,
  validateLoginInput,
  validateMemoryInput,
  validateModerationInput,
  validateProfileInput,
  validateReportInput,
  validateUploadInput,
};
