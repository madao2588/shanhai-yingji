(function () {
  const tokenKey = "shanhai-api-token";

  function getToken() {
    return window.sessionStorage.getItem(tokenKey) || "";
  }

  function setToken(token) {
    if (token) {
      window.sessionStorage.setItem(tokenKey, token);
      return;
    }

    window.sessionStorage.removeItem(tokenKey);
  }

  async function request(path, options = {}) {
    const token = getToken();
    const response = await fetch(path, {
      method: options.method || "GET",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(payload?.error || `Request failed: ${response.status}`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }

  async function register(input) {
    const payload = await request("/api/auth/register", { method: "POST", body: input });
    setToken(payload.token);
    return payload;
  }

  async function login(input) {
    const payload = await request("/api/auth/login", { method: "POST", body: input });
    setToken(payload.token);
    return payload;
  }

  function logout() {
    setToken("");
  }

  function queryString(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim()) {
        query.set(key, value);
      }
    });
    const text = query.toString();
    return text ? `?${text}` : "";
  }

  window.shanhaiApi = {
    getToken,
    setToken,
    logout,
    register,
    login,
    me: () => request("/api/me"),
    updateMe: (input) => request("/api/me", { method: "PATCH", body: input }),
    deleteMe: () => request("/api/me", { method: "DELETE" }),
    listMemories: () => request("/api/memories"),
    createMemory: (input) => request("/api/memories", { method: "POST", body: input }),
    updateMemory: (id, input) => request(`/api/memories/${encodeURIComponent(id)}`, { method: "PATCH", body: input }),
    deleteMemory: (id) => request(`/api/memories/${encodeURIComponent(id)}`, { method: "DELETE" }),
    uploadPhoto: (id, input) => request(`/api/memories/${encodeURIComponent(id)}/photos`, { method: "POST", body: input }),
    deletePhoto: (memoryId, photoId) =>
      request(`/api/memories/${encodeURIComponent(memoryId)}/photos/${encodeURIComponent(photoId)}`, { method: "DELETE" }),
    listPublicMemories: () => request("/api/public/memories"),
    discoverMemories: (params) => request(`/api/discover/memories${queryString(params)}`),
    listTags: () => request("/api/tags"),
    listDestinations: () => request("/api/destinations"),
    toggleLike: (id) => request(`/api/memories/${encodeURIComponent(id)}/like`, { method: "POST" }),
    toggleBookmark: (id) => request(`/api/memories/${encodeURIComponent(id)}/bookmark`, { method: "POST" }),
    listComments: (id) => request(`/api/memories/${encodeURIComponent(id)}/comments`),
    createComment: (id, input) => request(`/api/memories/${encodeURIComponent(id)}/comments`, { method: "POST", body: input }),
    followProfile: (username) => request(`/api/profile/${encodeURIComponent(username)}/follow`, { method: "POST" }),
    createReport: (input) => request("/api/reports", { method: "POST", body: input }),
    creatorStats: () => request("/api/creator/stats"),
    notifications: () => request("/api/notifications"),
    exportArchive: () => request("/api/export"),
    importArchive: (archive) => request("/api/import", { method: "POST", body: archive }),
  };
})();
