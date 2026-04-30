(function () {
  const api = window.shanhaiApi;

  if (!api) {
    return;
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  const elements = {
    panel: $("[data-cloud-panel]"),
    name: $("[data-cloud-name]"),
    email: $("[data-cloud-email]"),
    password: $("[data-cloud-password]"),
    register: $("[data-cloud-register]"),
    login: $("[data-cloud-login]"),
    updateProfile: $("[data-cloud-update-profile]"),
    logout: $("[data-cloud-logout]"),
    deleteAccount: $("[data-cloud-delete-account]"),
    status: $("[data-cloud-status]"),
    profile: $("[data-cloud-profile]"),
    title: $("[data-cloud-title]"),
    location: $("[data-cloud-location]"),
    body: $("[data-cloud-body]"),
    privacy: $("[data-cloud-privacy]"),
    tags: $("[data-cloud-tags]"),
    saveMemory: $("[data-cloud-save-memory]"),
    photoInput: $("[data-cloud-photo-input]"),
    photoFileName: $("[data-cloud-photo-file-name]"),
    uploadPhoto: $("[data-cloud-upload-photo]"),
    deletePhoto: $("[data-cloud-delete-photo]"),
    memoryList: $("[data-cloud-memory-list]"),
    photoList: $("[data-cloud-photo-list]"),
    publicList: $("[data-public-memory-list]"),
    communityFeed: $("[data-community-feed]"),
    communitySearch: $("[data-community-search-input]"),
    communitySearchAction: $("[data-community-search-action]"),
    communitySort: $("[data-community-sort]"),
    creatorStats: $("[data-creator-stats]"),
    creatorPublicMemories: $("[data-creator-public-memories]"),
    creatorTotalLikes: $("[data-creator-total-likes]"),
    creatorTotalBookmarks: $("[data-creator-total-bookmarks]"),
    creatorTotalComments: $("[data-creator-total-comments]"),
    creatorFollowers: $("[data-creator-followers]"),
    profileSpaceComments: $("[data-profile-space-comments]"),
    notificationList: $("[data-notification-list]"),
  };

  if (!elements.panel) {
    return;
  }

  let currentUser = null;
  let activeMemoryId = "";
  let activePhotoId = "";

  function setStatus(message) {
    elements.status.textContent = message;
  }

  function parseTags(value) {
    return String(value || "")
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function usernameFromName(value) {
    return (
      String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32) || "traveler"
    );
  }

  function renderProfile(user) {
    currentUser = user;
    elements.profile.textContent = user ? `${user.name} · @${user.username}` : "未登录";
  }

  function renderPhotoList(photos = []) {
    if (!elements.photoList) {
      return;
    }
    if (!photos.length) {
      const empty = document.createElement("p");
      empty.textContent = "当前映记还没有照片。";
      elements.photoList.replaceChildren(empty);
      activePhotoId = "";
      return;
    }
    elements.photoList.replaceChildren(
      ...photos.map((photo, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.cloudPhotoId = photo.id;
        button.textContent = photo.alt || photo.fileName || `照片 ${index + 1}`;
        button.classList.toggle("is-active", index === 0);
        button.addEventListener("click", () => {
          activePhotoId = photo.id;
          elements.photoList.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
        });
        return button;
      }),
    );
    activePhotoId = photos[0].id;
  }

  function renderMemoryList(memories = []) {
    elements.memoryList.replaceChildren(
      ...memories.map((memory) => {
        const item = document.createElement("article");
        const title = document.createElement("strong");
        const meta = document.createElement("span");
        title.textContent = memory.title;
        meta.textContent = `${memory.status === "public" ? "公开" : memory.status === "unlisted" ? "仅链接" : "私密"} · ${memory.locationLabel || "未标记地点"} · ${memory.photos?.length || 0} 张照片`;
        item.dataset.cloudMemoryId = memory.id;
        item.addEventListener("click", () => {
          activeMemoryId = memory.id;
          renderPhotoList(memory.photos || []);
        });
        item.append(title, meta);
        return item;
      }),
    );
    const activeMemory = memories.find((memory) => memory.id === activeMemoryId) || memories[0];
    if (activeMemory) {
      activeMemoryId = activeMemory.id;
      renderPhotoList(activeMemory.photos || []);
      return;
    }
    activeMemoryId = "";
    renderPhotoList([]);
  }

  function renderPublicList(memories = []) {
    if (!memories.length) {
      const empty = document.createElement("p");
      empty.textContent = "还没有公开发布的映记。";
      elements.publicList.replaceChildren(empty);
      return;
    }

    elements.publicList.replaceChildren(
      ...memories.map((memory) => {
        const item = document.createElement("article");
        const title = document.createElement("strong");
        const body = document.createElement("span");
        const status = document.createElement("em");
        item.className = "public-memory-card";
        title.textContent = memory.title;
        body.textContent = `${memory.locationLabel || "公开映记"} · ${memory.author?.name || "山海旅人"}`;
        status.textContent = "公开";
        item.append(title, body, status);
        return item;
      }),
    );
  }
  function renderCreatorStats(stats = {}) {
    if (!elements.creatorStats) {
      return;
    }
    elements.creatorPublicMemories.textContent = String(stats.publicMemories || 0);
    elements.creatorTotalLikes.textContent = String(stats.totalLikes || 0);
    elements.creatorTotalBookmarks.textContent = String(stats.totalBookmarks || 0);
    elements.creatorTotalComments.textContent = String(stats.totalComments || 0);
    if (elements.profileSpaceComments) {
      elements.profileSpaceComments.textContent = String(stats.totalComments || 0);
    }
    elements.creatorFollowers.textContent = String(stats.followers || 0);
  }

  function notificationTitle(type) {
    return (
      {
        like: "你的公开映记收到新的喜欢",
        bookmark: "有人收藏了你的公开映记",
        comment: "你的公开映记收到新的评论",
        follow: "有人关注了你的主页",
      }[type] || "社区状态已更新"
    );
  }

  function formatDate(value) {
    if (!value) {
      return "刚刚";
    }
    return new Date(value).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function renderNotifications(notifications = []) {
    if (!elements.notificationList) {
      return;
    }
    const source = notifications.length ? notifications : [{ id: "empty", type: "empty", createdAt: "", readAt: true }];
    elements.notificationList.replaceChildren(
      ...source.map((notification) => {
        const item = document.createElement("article");
        const dot = document.createElement("span");
        const body = document.createElement("div");
        const title = document.createElement("h3");
        const time = document.createElement("p");
        dot.className = notification.readAt ? "" : "message-dot";
        item.dataset.notificationItem = notification.id;
        item.dataset.notificationType = notification.type;
        title.textContent = notification.type === "empty" ? "暂无新的互动通知" : notificationTitle(notification.type);
        time.textContent = notification.type === "empty" ? "社区互动会出现在这里" : formatDate(notification.createdAt);
        body.append(title, time);
        item.append(dot, body);
        return item;
      }),
    );
  }

  function renderCommunityFeed(memories = []) {
    if (!elements.communityFeed) {
      return;
    }
    if (!memories.length) {
      const empty = document.createElement("article");
      empty.dataset.communityItem = "empty";
      const title = document.createElement("h3");
      const body = document.createElement("p");
      title.textContent = "还没有匹配的公开映记";
      body.textContent = "换个关键词，或先发布一篇公开旅行日志。";
      empty.append(title, body);
      elements.communityFeed.replaceChildren(empty);
      return;
    }

    elements.communityFeed.replaceChildren(
      ...memories.map((memory) => {
        const item = document.createElement("article");
        const image = document.createElement("img");
        const title = document.createElement("h3");
        const meta = document.createElement("p");
        const actions = document.createElement("div");
        const like = document.createElement("button");
        const bookmark = document.createElement("button");
        const follow = document.createElement("button");
        const report = document.createElement("button");
        const commentRow = document.createElement("div");
        const commentInput = document.createElement("input");
        const commentSubmit = document.createElement("button");

        item.dataset.communityItem = memory.id;
        image.src = memory.photos?.[0]?.url || "assets/photo-ocean.svg";
        image.alt = memory.title;
        title.textContent = memory.title;
        meta.textContent = `${memory.locationLabel || memory.city || "旅行映记"} · ${memory.likeCount || 0} 喜欢 · ${memory.commentCount || 0} 评论`;
        actions.className = "community-actions";

        like.type = "button";
        like.dataset.communityAction = "like";
        like.dataset.communityLike = memory.id;
        like.textContent = memory.likedByViewer ? "已喜欢" : "喜欢";
        bookmark.type = "button";
        bookmark.dataset.communityAction = "bookmark";
        bookmark.dataset.communityBookmark = memory.id;
        bookmark.textContent = memory.bookmarkedByViewer ? "已收藏" : "收藏";
        follow.type = "button";
        follow.dataset.communityAction = "follow";
        follow.dataset.communityFollow = memory.author?.username || "";
        follow.textContent = "关注作者";
        report.type = "button";
        report.dataset.communityAction = "report";
        report.dataset.communityReport = memory.id;
        report.textContent = "举报";
        actions.append(like, bookmark, follow, report);

        commentRow.className = "community-comment-row";
        commentInput.type = "text";
        commentInput.placeholder = "写评论";
        commentInput.dataset.communityCommentInput = memory.id;
        commentSubmit.type = "button";
        commentSubmit.dataset.communityAction = "comment";
        commentSubmit.dataset.communityCommentSubmit = memory.id;
        commentSubmit.textContent = "评论";
        commentRow.append(commentInput, commentSubmit);
        item.append(image, title, meta, actions, commentRow);
        return item;
      }),
    );
  }

  async function refreshCommunityFeed() {
    if (!elements.communityFeed || !window.location.protocol.startsWith("http")) {
      return;
    }
    const payload = await api.discoverMemories({
      q: elements.communitySearch?.value || "",
      sort: elements.communitySort?.value || "latest",
    });
    renderCommunityFeed(payload.memories);
  }

  async function refreshCreatorStats() {
    if (!api.getToken() || !elements.creatorStats) {
      renderCreatorStats();
      return;
    }
    const payload = await api.creatorStats();
    renderCreatorStats(payload.stats);
  }

  async function refreshNotifications() {
    if (!elements.notificationList) {
      return;
    }
    if (!api.getToken()) {
      renderNotifications([]);
      return;
    }
    const payload = await api.notifications();
    renderNotifications(payload.notifications);
  }

  async function refreshMemories() {
    try {
      const [owned, published] = await Promise.all([
        api.getToken() ? api.listMemories() : Promise.resolve({ memories: [] }),
        window.location.protocol.startsWith("http") ? api.listPublicMemories() : Promise.resolve({ memories: [] }),
      ]);
      renderMemoryList(owned.memories);
      renderPublicList(published.memories);
      await Promise.all([refreshCommunityFeed(), refreshCreatorStats(), refreshNotifications()]);
    } catch (error) {
      renderPublicList([]);
      setStatus(error.message || "云端服务暂时不可用。");
    }
  }

  async function restoreSession() {
    if (!api.getToken()) {
      renderProfile(null);
      await refreshMemories();
      return;
    }

    try {
      const payload = await api.me();
      renderProfile(payload.user);
      setStatus("已恢复登录，可继续云端记录。");
      await refreshMemories();
    } catch {
      api.logout();
      renderProfile(null);
      setStatus("登录已过期，请重新登录。");
      await refreshMemories();
    }
  }

  async function authenticate(kind) {
    try {
      const payload =
        kind === "register"
          ? await api.register({
              name: elements.name.value,
              email: elements.email.value,
              password: elements.password.value,
            })
          : await api.login({
              email: elements.email.value,
              password: elements.password.value,
            });
      renderProfile(payload.user);
      setStatus(`已登录：${payload.user.name}`);
      await refreshMemories();
    } catch (error) {
      setStatus(error.message || "账号操作失败");
    }
  }

  async function updateProfile() {
    try {
      const payload = await api.updateMe({
        name: elements.name.value,
        username: usernameFromName(elements.name.value),
      });
      renderProfile(payload.user);
      setStatus("资料已更新。");
    } catch (error) {
      setStatus(error.message || "资料更新失败");
    }
  }

  async function deleteAccount() {
    try {
      await api.deleteMe();
      api.logout();
      currentUser = null;
      activeMemoryId = "";
      activePhotoId = "";
      renderProfile(null);
      renderMemoryList([]);
      renderCreatorStats();
      renderNotifications([]);
      setStatus("账号已注销，本机登录已清除。");
    } catch (error) {
      setStatus(error.message || "账号注销失败");
    }
  }

  async function saveMemory() {
    try {
      const payload = await api.createMemory({
        title: elements.title.value,
        body: elements.body.value,
        locationLabel: elements.location.value,
        status: elements.privacy.value,
        tags: parseTags(elements.tags.value),
      });
      activeMemoryId = payload.memory.id;
      setStatus("云端日志已保存。");
      await refreshMemories();
    } catch (error) {
      setStatus(error.message || "云端日志保存失败");
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result || "")));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(file);
    });
  }

  async function uploadPhoto() {
    const [file] = elements.photoInput.files || [];
    if (!file || !activeMemoryId) {
      setStatus("请先保存一篇云端日志，再选择照片。");
      return;
    }
    try {
      await api.uploadPhoto(activeMemoryId, {
        fileName: file.name,
        mimeType: file.type,
        dataUrl: await readFileAsDataUrl(file),
        alt: elements.title.value || "旅行照片",
      });
      setStatus("照片已上传。");
      elements.photoInput.value = "";
      elements.photoFileName.textContent = "未选择文件";
      await refreshMemories();
    } catch (error) {
      setStatus(error.message || "照片上传失败");
    }
  }

  async function deleteSelectedPhoto() {
    if (!activeMemoryId || !activePhotoId) {
      setStatus("请先选择要删除的照片。");
      return;
    }
    try {
      await api.deletePhoto(activeMemoryId, activePhotoId);
      setStatus("照片已删除。");
      activePhotoId = "";
      await refreshMemories();
    } catch (error) {
      setStatus(error.message || "照片删除失败");
    }
  }

  async function handleCommunityAction(event) {
    const button = event.target.closest("[data-community-action]");
    if (!button) {
      return;
    }
    if (!api.getToken()) {
      setStatus("请先登录，再进行社区互动。");
      return;
    }

    try {
      const action = button.dataset.communityAction;
      if (action === "like") {
        await api.toggleLike(button.dataset.communityLike);
      }
      if (action === "bookmark") {
        await api.toggleBookmark(button.dataset.communityBookmark);
      }
      if (action === "comment") {
        const memoryId = button.dataset.communityCommentSubmit;
        const input = document.querySelector(`[data-community-comment-input="${memoryId}"]`);
        await api.createComment(memoryId, { body: input?.value || "很有帮助的旅行记录。" });
        if (input) {
          input.value = "";
        }
      }
      if (action === "follow") {
        await api.followProfile(button.dataset.communityFollow);
      }
      if (action === "report") {
        await api.createReport({
          targetType: "memory",
          targetId: button.dataset.communityReport,
          reason: "用户从移动端社区提交复核。",
        });
      }
      setStatus("社区操作已同步。");
      await Promise.all([refreshCommunityFeed(), refreshCreatorStats(), refreshNotifications()]);
    } catch (error) {
      setStatus(error.message || "社区操作失败");
    }
  }

  elements.register.addEventListener("click", () => authenticate("register"));
  elements.login.addEventListener("click", () => authenticate("login"));
  elements.updateProfile?.addEventListener("click", updateProfile);
  elements.deleteAccount?.addEventListener("click", deleteAccount);
  elements.logout.addEventListener("click", async () => {
    api.logout();
    activeMemoryId = "";
    activePhotoId = "";
    renderProfile(null);
    setStatus("已退出本机登录。");
    await refreshMemories();
  });
  elements.saveMemory.addEventListener("click", saveMemory);
  elements.uploadPhoto.addEventListener("click", uploadPhoto);
  elements.photoInput?.addEventListener("change", () => {
    elements.photoFileName.textContent = elements.photoInput.files?.[0]?.name || "未选择文件";
  });
  elements.deletePhoto?.addEventListener("click", deleteSelectedPhoto);
  elements.communitySearchAction?.addEventListener("click", refreshCommunityFeed);
  elements.communitySearch?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      refreshCommunityFeed();
    }
  });
  elements.communitySort?.addEventListener("change", refreshCommunityFeed);
  elements.communityFeed?.addEventListener("click", handleCommunityAction);

  window.addEventListener("load", restoreSession);
})();
