const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

function now() {
  return new Date().toISOString();
}

function createEmptyData() {
  return {
    version: 1,
    users: [],
    sessions: [],
    memories: [],
    photos: [],
    likes: [],
    bookmarks: [],
    comments: [],
    follows: [],
    reports: [],
    notifications: [],
    conversations: [],
    moderationActions: [],
    views: [],
  };
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function createConversationRecord(userId, conversationId, input = {}) {
  const timestamp = now();
  return {
    id: crypto.randomUUID(),
    userId,
    conversationId,
    peerUserId: input.peerUserId || null,
    peerUsername: input.peerUsername || conversationId,
    title: input.title || conversationId,
    status: input.status || "已发送",
    preview: input.preview || "",
    lastTime: input.lastTime || "",
    unreadCount: Number.isFinite(input.unreadCount) ? Math.max(0, input.unreadCount) : 0,
    messages: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

class JsonDatabase {
  constructor({ dataDir }) {
    this.dataDir = dataDir || path.resolve(process.cwd(), ".data");
    this.filePath = path.join(this.dataDir, "shanhai-db.json");
    this.uploadDir = path.join(this.dataDir, "uploads");
    this.data = null;
    this.writeQueue = Promise.resolve();
  }

  async ensureLoaded() {
    if (this.data) {
      return this.data;
    }

    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(this.uploadDir, { recursive: true });

    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.data = { ...createEmptyData(), ...JSON.parse(raw) };
    } catch {
      this.data = createEmptyData();
      await this.save();
    }

    return this.data;
  }

  async save() {
    await fs.mkdir(this.dataDir, { recursive: true });
    this.writeQueue = this.writeQueue.then(() => fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2)));
    return this.writeQueue;
  }

  async health() {
    await this.ensureLoaded();
    return "json";
  }

  async createUser({ name, email, passwordHash, role = "member" }) {
    const data = await this.ensureLoaded();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const timestamp = now();
    const baseUsername = normalizeSlug(name) || cleanEmail.split("@")[0] || "traveler";
    let username = baseUsername;
    let suffix = 1;

    while (data.users.some((user) => user.username === username)) {
      suffix += 1;
      username = `${baseUsername}-${suffix}`;
    }

    const user = {
      id: crypto.randomUUID(),
      name: String(name || "").trim() || "山海旅人",
      email: cleanEmail,
      username,
      passwordHash,
      role,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    data.users.push(user);
    await this.save();
    return user;
  }

  async findUserByEmail(email) {
    const data = await this.ensureLoaded();
    return data.users.find((user) => user.email === String(email || "").trim().toLowerCase() && !user.deletedAt) || null;
  }

  async findUserById(userId) {
    const data = await this.ensureLoaded();
    return data.users.find((user) => user.id === userId && !user.deletedAt) || null;
  }

  async findUserByUsername(username) {
    const data = await this.ensureLoaded();
    return data.users.find((user) => user.username === username && !user.deletedAt) || null;
  }

  async updateUser(userId, patch = {}) {
    const data = await this.ensureLoaded();
    const user = data.users.find((item) => item.id === userId && !item.deletedAt);
    if (!user) {
      return null;
    }
    if (patch.username && data.users.some((item) => item.id !== userId && item.username === patch.username && !item.deletedAt)) {
      const error = new Error("username already taken");
      error.status = 409;
      throw error;
    }
    if (patch.name) {
      user.name = patch.name;
    }
    if (patch.username) {
      user.username = patch.username;
    }
    user.updatedAt = now();
    await this.save();
    return user;
  }

  async deleteUser(userId) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    const user = data.users.find((item) => item.id === userId && !item.deletedAt);
    if (!user) {
      return false;
    }
    user.deletedAt = timestamp;
    user.updatedAt = timestamp;
    data.sessions = data.sessions.filter((item) => item.userId !== userId);
    for (const memory of data.memories.filter((item) => item.userId === userId && !item.deletedAt)) {
      memory.deletedAt = timestamp;
      memory.updatedAt = timestamp;
    }
    data.likes = data.likes.filter((item) => item.userId !== userId);
    data.bookmarks = data.bookmarks.filter((item) => item.userId !== userId);
    data.follows = data.follows.filter((item) => item.followerId !== userId && item.targetUserId !== userId);
    await this.save();
    return true;
  }

  async createSession(userId, token, ttlHours = 168) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    const session = {
      tokenHash: hashToken(token),
      userId,
      createdAt: timestamp,
      expiresAt: new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString(),
    };
    data.sessions = data.sessions.filter((item) => item.expiresAt > timestamp);
    data.sessions.push(session);
    await this.save();
    return session;
  }

  async findSession(token) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    const tokenHash = hashToken(token);
    const session = data.sessions.find((item) => item.tokenHash === tokenHash && item.expiresAt > timestamp);
    return session || null;
  }

  async deleteSession(token) {
    const data = await this.ensureLoaded();
    const tokenHash = hashToken(token);
    const before = data.sessions.length;
    data.sessions = data.sessions.filter((item) => item.tokenHash !== tokenHash);
    await this.save();
    return data.sessions.length < before;
  }

  async createMemory(userId, input = {}) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    const status = ["private", "unlisted", "public"].includes(input.status) ? input.status : "private";
    const memory = {
      id: crypto.randomUUID(),
      userId,
      title: String(input.title || "").trim() || "未命名映记",
      body: String(input.body || "").trim(),
      locationLabel: String(input.locationLabel || input.location || "").trim(),
      country: String(input.country || "").trim(),
      city: String(input.city || "").trim(),
      destinationId: String(input.destinationId || "").trim(),
      season: String(input.season || "").trim(),
      budget: String(input.budget || "").trim(),
      audience: String(input.audience || "").trim(),
      route: Array.isArray(input.route) ? input.route.map(String).map((item) => item.trim()).filter(Boolean) : [],
      visited: Boolean(input.visited),
      occurredAt: String(input.occurredAt || "").trim(),
      tags: Array.isArray(input.tags) ? input.tags.map(String).map((tag) => tag.trim()).filter(Boolean) : [],
      status,
      photos: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      publishedAt: status === "public" ? timestamp : null,
    };
    data.memories.push(memory);
    await this.save();
    return memory;
  }

  async listMemories(userId) {
    const data = await this.ensureLoaded();
    return data.memories.filter((memory) => memory.userId === userId && !memory.deletedAt);
  }

  async listPublicMemories() {
    const data = await this.ensureLoaded();
    return data.memories.filter((memory) => memory.status === "public" && !memory.deletedAt && !memory.removedAt);
  }

  async discoverMemories(filters = {}) {
    const data = await this.ensureLoaded();
    const q = String(filters.q || "").trim().toLowerCase();
    const tag = String(filters.tag || "").trim().toLowerCase();
    const city = String(filters.city || "").trim().toLowerCase();
    const country = String(filters.country || "").trim().toLowerCase();
    const destinationId = String(filters.destinationId || "").trim().toLowerCase();
    const items = data.memories
      .filter((memory) => memory.status === "public" && !memory.deletedAt && !memory.removedAt)
      .filter((memory) => {
        const tags = (memory.tags || []).map((item) => String(item).toLowerCase());
        const haystack = [
          memory.title,
          memory.body,
          memory.locationLabel,
          memory.country,
          memory.city,
          memory.destinationId,
          memory.season,
          memory.budget,
          memory.audience,
          ...(memory.route || []),
          ...tags,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!q || haystack.includes(q)) &&
          (!tag || tags.includes(tag)) &&
          (!city || String(memory.city || "").toLowerCase() === city || String(memory.locationLabel || "").toLowerCase().includes(city)) &&
          (!country || String(memory.country || "").toLowerCase() === country) &&
          (!destinationId || String(memory.destinationId || "").toLowerCase() === destinationId)
        );
      });

    return items.sort((a, b) => {
      if (filters.sort === "popular") {
        const scoreA = this.getMemoryCountsSync(data, a.id).likeCount + this.getMemoryCountsSync(data, a.id).bookmarkCount;
        const scoreB = this.getMemoryCountsSync(data, b.id).likeCount + this.getMemoryCountsSync(data, b.id).bookmarkCount;
        return scoreB - scoreA || String(b.publishedAt || b.createdAt).localeCompare(String(a.publishedAt || a.createdAt));
      }
      return String(b.publishedAt || b.createdAt).localeCompare(String(a.publishedAt || a.createdAt));
    });
  }

  async findMemory(memoryId) {
    const data = await this.ensureLoaded();
    return data.memories.find((memory) => memory.id === memoryId && !memory.deletedAt) || null;
  }

  async findPublicReadableMemory(memoryId) {
    const memory = await this.findMemory(memoryId);
    if (!memory || memory.removedAt || !["public", "unlisted"].includes(memory.status)) {
      return null;
    }
    return memory;
  }

  async updateMemory(memoryId, userId, patch = {}) {
    const data = await this.ensureLoaded();
    const memory = data.memories.find((item) => item.id === memoryId && item.userId === userId && !item.deletedAt);
    if (!memory) {
      return null;
    }

    ["title", "body", "locationLabel", "country", "city", "occurredAt", "destinationId", "season", "budget", "audience"].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(patch, field)) {
        memory[field] = String(patch[field] || "").trim();
      }
    });

    if (Array.isArray(patch.route)) {
      memory.route = patch.route.map(String).map((item) => item.trim()).filter(Boolean);
    }

    if (Object.prototype.hasOwnProperty.call(patch, "visited")) {
      memory.visited = Boolean(patch.visited);
    }

    if (Array.isArray(patch.tags)) {
      memory.tags = patch.tags.map(String).map((tag) => tag.trim()).filter(Boolean);
    }

    if (["private", "unlisted", "public"].includes(patch.status)) {
      const wasPublic = memory.status === "public";
      memory.status = patch.status;
      if (!wasPublic && patch.status === "public") {
        memory.publishedAt = now();
      }
      if (patch.status === "private") {
        memory.publishedAt = null;
      }
    }

    memory.updatedAt = now();
    await this.save();
    return memory;
  }

  async deleteMemory(memoryId, userId) {
    const memory = await this.findMemory(memoryId);
    if (!memory || memory.userId !== userId) {
      return false;
    }

    memory.deletedAt = now();
    memory.updatedAt = memory.deletedAt;
    await this.save();
    return true;
  }

  async addPhoto(memoryId, userId, photo) {
    const data = await this.ensureLoaded();
    const memory = data.memories.find((item) => item.id === memoryId && item.userId === userId && !item.deletedAt);
    if (!memory) {
      return null;
    }

    const savedPhoto = {
      id: crypto.randomUUID(),
      memoryId,
      userId,
      fileName: photo.fileName,
      storageKey: photo.storageKey || photo.fileName,
      mimeType: photo.mimeType,
      url: photo.url,
      alt: String(photo.alt || "").trim(),
      createdAt: now(),
    };
    data.photos.push(savedPhoto);
    memory.photos.push(savedPhoto);
    memory.updatedAt = savedPhoto.createdAt;
    await this.save();
    return savedPhoto;
  }

  async deletePhoto(memoryId, photoId, userId) {
    const data = await this.ensureLoaded();
    const memory = data.memories.find((item) => item.id === memoryId && item.userId === userId && !item.deletedAt);
    if (!memory) {
      return null;
    }
    const photo = data.photos.find((item) => item.id === photoId && item.memoryId === memoryId && item.userId === userId && !item.deletedAt);
    if (!photo) {
      return false;
    }
    photo.deletedAt = now();
    memory.photos = (memory.photos || []).filter((item) => item.id !== photoId);
    memory.updatedAt = photo.deletedAt;
    await this.save();
    return true;
  }

  async adminMetrics() {
    const data = await this.ensureLoaded();
    return {
      users: data.users.filter((item) => !item.deletedAt).length,
      memories: data.memories.filter((item) => !item.deletedAt).length,
      publicMemories: data.memories.filter((item) => item.status === "public" && !item.deletedAt && !item.removedAt).length,
      photos: data.photos.filter((item) => !item.deletedAt).length,
      likes: data.likes.length,
      bookmarks: data.bookmarks.length,
      comments: data.comments.filter((item) => !item.deletedAt).length,
      follows: data.follows.length,
      reports: data.reports.length,
      notifications: data.notifications.length,
    };
  }

  async exportFullBackup() {
    const data = await this.ensureLoaded();
    return {
      version: data.version,
      exportedAt: now(),
      data,
    };
  }

  getMemoryCountsSync(data, memoryId) {
    return {
      likeCount: data.likes.filter((item) => item.memoryId === memoryId).length,
      bookmarkCount: data.bookmarks.filter((item) => item.memoryId === memoryId).length,
      commentCount: data.comments.filter((item) => item.memoryId === memoryId && !item.deletedAt).length,
      viewCount: data.views.filter((item) => item.memoryId === memoryId).length,
    };
  }

  async getMemoryCounts(memoryId) {
    const data = await this.ensureLoaded();
    return this.getMemoryCountsSync(data, memoryId);
  }

  async getViewerState(memoryId, userId) {
    const data = await this.ensureLoaded();
    return {
      likedByViewer: Boolean(userId && data.likes.some((item) => item.memoryId === memoryId && item.userId === userId)),
      bookmarkedByViewer: Boolean(userId && data.bookmarks.some((item) => item.memoryId === memoryId && item.userId === userId)),
    };
  }

  async createNotification(userId, type, payload = {}) {
    if (!userId) {
      return null;
    }
    const data = await this.ensureLoaded();
    const notification = {
      id: crypto.randomUUID(),
      userId,
      type,
      payload,
      readAt: null,
      createdAt: now(),
    };
    data.notifications.push(notification);
    await this.save();
    return notification;
  }

  async toggleLike(memoryId, userId) {
    const data = await this.ensureLoaded();
    const memory = data.memories.find((item) => item.id === memoryId && item.status === "public" && !item.deletedAt && !item.removedAt);
    if (!memory) {
      return null;
    }
    const existingIndex = data.likes.findIndex((item) => item.memoryId === memoryId && item.userId === userId);
    const liked = existingIndex === -1;
    if (liked) {
      data.likes.push({ id: crypto.randomUUID(), memoryId, userId, createdAt: now() });
      if (memory.userId !== userId) {
        data.notifications.push({
          id: crypto.randomUUID(),
          userId: memory.userId,
          type: "like",
          payload: { memoryId, actorId: userId },
          readAt: null,
          createdAt: now(),
        });
      }
    } else {
      data.likes.splice(existingIndex, 1);
    }
    await this.save();
    return { liked, ...this.getMemoryCountsSync(data, memoryId) };
  }

  async toggleBookmark(memoryId, userId) {
    const data = await this.ensureLoaded();
    const memory = data.memories.find((item) => item.id === memoryId && item.status === "public" && !item.deletedAt && !item.removedAt);
    if (!memory) {
      return null;
    }
    const existingIndex = data.bookmarks.findIndex((item) => item.memoryId === memoryId && item.userId === userId);
    const bookmarked = existingIndex === -1;
    if (bookmarked) {
      data.bookmarks.push({ id: crypto.randomUUID(), memoryId, userId, createdAt: now() });
      if (memory.userId !== userId) {
        data.notifications.push({
          id: crypto.randomUUID(),
          userId: memory.userId,
          type: "bookmark",
          payload: { memoryId, actorId: userId },
          readAt: null,
          createdAt: now(),
        });
      }
    } else {
      data.bookmarks.splice(existingIndex, 1);
    }
    await this.save();
    return { bookmarked, ...this.getMemoryCountsSync(data, memoryId) };
  }

  async addComment(memoryId, userId, input = {}) {
    const data = await this.ensureLoaded();
    const memory = data.memories.find((item) => item.id === memoryId && item.status === "public" && !item.deletedAt && !item.removedAt);
    if (!memory) {
      return null;
    }
    const timestamp = now();
    const comment = {
      id: crypto.randomUUID(),
      memoryId,
      userId,
      parentId: input.parentId || null,
      body: String(input.body || "").trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    data.comments.push(comment);
    if (memory.userId !== userId) {
      data.notifications.push({
        id: crypto.randomUUID(),
        userId: memory.userId,
        type: "comment",
        payload: { memoryId, commentId: comment.id, actorId: userId },
        readAt: null,
        createdAt: timestamp,
      });
    }
    await this.save();
    return comment;
  }

  async listComments(memoryId) {
    const data = await this.ensureLoaded();
    return data.comments
      .filter((comment) => comment.memoryId === memoryId && !comment.deletedAt)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  }

  async toggleFollow(targetUserId, followerId) {
    const data = await this.ensureLoaded();
    if (targetUserId === followerId || !data.users.some((user) => user.id === targetUserId)) {
      return null;
    }
    const existingIndex = data.follows.findIndex((item) => item.targetUserId === targetUserId && item.followerId === followerId);
    const following = existingIndex === -1;
    if (following) {
      data.follows.push({ id: crypto.randomUUID(), targetUserId, followerId, createdAt: now() });
      data.notifications.push({
        id: crypto.randomUUID(),
        userId: targetUserId,
        type: "follow",
        payload: { actorId: followerId },
        readAt: null,
        createdAt: now(),
      });
    } else {
      data.follows.splice(existingIndex, 1);
    }
    await this.save();
    return {
      following,
      followerCount: data.follows.filter((item) => item.targetUserId === targetUserId).length,
    };
  }

  async listNotifications(userId) {
    const data = await this.ensureLoaded();
    return data.notifications
      .filter((item) => item.userId === userId)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  async listConversations(userId) {
    const data = await this.ensureLoaded();
    return data.conversations
      .filter((item) => item.userId === userId)
      .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
  }

  async addConversationMessage(userId, conversationId, input = {}) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    let conversation = data.conversations.find((item) => item.userId === userId && item.conversationId === conversationId);
    if (!conversation) {
      conversation = {
        id: crypto.randomUUID(),
        userId,
        conversationId,
        title: input.title || conversationId,
        status: "已发送",
        preview: "",
        lastTime: "",
        unreadCount: 0,
        messages: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      data.conversations.push(conversation);
    }

    const message = {
      id: crypto.randomUUID(),
      direction: "from-me",
      body: String(input.body || "").trim(),
      createdAt: timestamp,
    };
    conversation.title = input.title || conversation.title || conversationId;
    conversation.status = "已发送";
    conversation.preview = `我：${message.body}`;
    conversation.lastTime = "刚刚";
    conversation.unreadCount = 0;
    conversation.updatedAt = timestamp;
    conversation.messages = [...(conversation.messages || []), message];
    await this.save();
    return conversation;
  }

  async addDirectMessage(sender, recipient, input = {}) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    const body = String(input.body || "").trim();
    const senderConversationId = recipient.username;
    const recipientConversationId = sender.username;
    let senderConversation = data.conversations.find((item) => item.userId === sender.id && item.conversationId === senderConversationId);
    let recipientConversation = data.conversations.find((item) => item.userId === recipient.id && item.conversationId === recipientConversationId);

    if (!senderConversation) {
      senderConversation = createConversationRecord(sender.id, senderConversationId, {
        peerUserId: recipient.id,
        peerUsername: recipient.username,
        title: recipient.name || recipient.username,
        status: "云端私信",
      });
      data.conversations.push(senderConversation);
    }

    if (!recipientConversation) {
      recipientConversation = createConversationRecord(recipient.id, recipientConversationId, {
        peerUserId: sender.id,
        peerUsername: sender.username,
        title: sender.name || sender.username,
        status: "云端私信",
      });
      data.conversations.push(recipientConversation);
    }

    const senderMessage = {
      id: crypto.randomUUID(),
      direction: "from-me",
      body,
      createdAt: timestamp,
    };
    const recipientMessage = {
      id: crypto.randomUUID(),
      direction: "from-friend",
      body,
      createdAt: timestamp,
    };

    senderConversation.peerUserId = recipient.id;
    senderConversation.peerUsername = recipient.username;
    senderConversation.title = recipient.name || recipient.username;
    senderConversation.status = "已发送";
    senderConversation.preview = `我：${body}`;
    senderConversation.lastTime = "刚刚";
    senderConversation.unreadCount = 0;
    senderConversation.updatedAt = timestamp;
    senderConversation.messages = [...(senderConversation.messages || []), senderMessage];

    recipientConversation.peerUserId = sender.id;
    recipientConversation.peerUsername = sender.username;
    recipientConversation.title = sender.name || sender.username;
    recipientConversation.status = "新消息";
    recipientConversation.preview = `${sender.name || sender.username}：${body}`;
    recipientConversation.lastTime = "刚刚";
    recipientConversation.unreadCount = Math.max(0, Number(recipientConversation.unreadCount) || 0) + 1;
    recipientConversation.updatedAt = timestamp;
    recipientConversation.messages = [...(recipientConversation.messages || []), recipientMessage];

    await this.save();
    return senderConversation;
  }

  async markNotificationRead(userId, notificationId) {
    const data = await this.ensureLoaded();
    const notification = data.notifications.find((item) => item.id === notificationId && item.userId === userId);
    if (!notification) {
      return null;
    }
    notification.readAt = notification.readAt || now();
    await this.save();
    return notification;
  }

  async creatorStats(userId) {
    const data = await this.ensureLoaded();
    const publicMemories = data.memories.filter((memory) => memory.userId === userId && memory.status === "public" && !memory.deletedAt && !memory.removedAt);
    const publicIds = new Set(publicMemories.map((memory) => memory.id));
    return {
      publicMemories: publicMemories.length,
      totalLikes: data.likes.filter((item) => publicIds.has(item.memoryId)).length,
      totalBookmarks: data.bookmarks.filter((item) => publicIds.has(item.memoryId)).length,
      totalComments: data.comments.filter((item) => publicIds.has(item.memoryId) && !item.deletedAt).length,
      followers: data.follows.filter((item) => item.targetUserId === userId).length,
    };
  }

  async aggregateTags() {
    const data = await this.ensureLoaded();
    const counts = new Map();
    for (const memory of data.memories.filter((item) => item.status === "public" && !item.deletedAt && !item.removedAt)) {
      for (const tag of memory.tags || []) {
        const name = String(tag).trim().toLowerCase();
        if (name) {
          counts.set(name, (counts.get(name) || 0) + 1);
        }
      }
    }
    return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  async aggregateDestinations() {
    const data = await this.ensureLoaded();
    const counts = new Map();
    for (const memory of data.memories.filter((item) => item.status === "public" && !item.deletedAt && !item.removedAt)) {
      const destinationId = String(memory.destinationId || memory.city || memory.locationLabel || "").trim();
      if (!destinationId) {
        continue;
      }
      const existing = counts.get(destinationId) || {
        destinationId,
        city: memory.city,
        country: memory.country,
        locationLabel: memory.locationLabel,
        count: 0,
      };
      existing.count += 1;
      counts.set(destinationId, existing);
    }
    return [...counts.values()].sort((a, b) => b.count - a.count || a.destinationId.localeCompare(b.destinationId));
  }

  async createReport(userId, input = {}) {
    const data = await this.ensureLoaded();
    const timestamp = now();
    const report = {
      id: crypto.randomUUID(),
      reporterId: userId,
      targetType: input.targetType,
      targetId: input.targetId,
      reason: String(input.reason || "").trim(),
      status: "open",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    data.reports.push(report);
    await this.save();
    return report;
  }

  async listReports() {
    const data = await this.ensureLoaded();
    return data.reports.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  async moderateReport(reportId, reviewerId, input = {}) {
    const data = await this.ensureLoaded();
    const report = data.reports.find((item) => item.id === reportId);
    if (!report) {
      return null;
    }
    const timestamp = now();
    report.status = input.status;
    report.notes = input.notes || "";
    report.reviewerId = reviewerId;
    report.updatedAt = timestamp;
    data.moderationActions.push({
      id: crypto.randomUUID(),
      reportId,
      reviewerId,
      action: input.action || input.status,
      notes: input.notes || "",
      createdAt: timestamp,
    });
    if (input.action === "remove_memory" && report.targetType === "memory") {
      const memory = data.memories.find((item) => item.id === report.targetId && !item.deletedAt);
      if (memory) {
        memory.removedAt = timestamp;
        memory.updatedAt = timestamp;
      }
    }
    await this.save();
    return report;
  }

  async exportArchive(userId) {
    const user = await this.findUserById(userId);
    const memories = await this.listMemories(userId);
    return {
      version: 1,
      exportedAt: now(),
      user: user ? { id: user.id, name: user.name, email: user.email, username: user.username } : null,
      memories,
    };
  }

  async importArchive(userId, archive = {}) {
    const memories = Array.isArray(archive.memories) ? archive.memories : [];
    let imported = 0;

    for (const item of memories) {
      const created = await this.createMemory(userId, {
        ...item,
        status: ["private", "unlisted", "public"].includes(item.status) ? item.status : "private",
      });
      if (Array.isArray(item.photos)) {
        for (const photo of item.photos) {
          await this.addPhoto(created.id, userId, {
            fileName: photo.fileName || "imported-photo",
            storageKey: photo.storageKey || photo.fileName || "imported-photo",
            mimeType: photo.mimeType || "image/jpeg",
            url: photo.url || "",
            alt: photo.alt || "",
          });
        }
      }
      imported += 1;
    }

    return { imported };
  }
}

module.exports = {
  createEmptyData,
  JsonDatabase,
  now,
};
