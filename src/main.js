const splash = document.querySelector("#splash");
const canvas = document.querySelector("#splashCanvas");
const ctx = canvas.getContext("2d");
const modeTabs = document.querySelectorAll(".mode-tab");
const mapView = document.querySelector("#mapView");
const diaryView = document.querySelector("#diaryView");
const recordBrowsePanel = document.querySelector("[data-browse-panel]");
const recordBrowseKicker = document.querySelector("[data-browse-kicker]");
const recordBrowseTitle = document.querySelector("[data-browse-title]");
const recordBrowseContent = document.querySelector("[data-browse-content]");
const recordBrowseClose = document.querySelector("[data-browse-close]");
const openMapBrowseButton = document.querySelector("[data-open-map-browse]");
const openDiaryBrowseButton = document.querySelector("[data-open-diary-browse]");
const navButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");
const profileShortcut = document.querySelector("[data-open-profile]");
const createForm = document.querySelector(".create-form");
const createTitle = document.querySelector("[data-create-title]");
const createLocation = document.querySelector("[data-create-location]");
const createDate = document.querySelector("[data-create-date]");
const createRoute = document.querySelector("[data-create-route]");
const createTags = document.querySelector("[data-create-tags]");
const createVisibility = document.querySelector("[data-create-visibility]");
const createBody = document.querySelector("[data-create-body]");
const createDraftState = document.querySelector("[data-create-draft-state]");
const createPhotoCount = document.querySelector("[data-create-photo-count]");
const createPublishTarget = document.querySelector("[data-create-publish-target]");
const stepItems = document.querySelectorAll(".step-rail span");
const generateButton = document.querySelector("[data-generate-recap]");
const recapPreviewText = document.querySelector("[data-recap-status]");
const photoLibrary = document.querySelector("[data-photo-library]");
let photoOptions = Array.from(document.querySelectorAll("[data-photo-option]"));
const photoInput = document.querySelector("[data-photo-input]");
const importPhotoButton = document.querySelector("[data-import-photo]");
const addPhotoButton = document.querySelector("[data-add-photo]");
const selectedPhotos = document.querySelector("[data-selected-photos]");
const autoTimeline = document.querySelector("[data-auto-timeline]");
const sharePoster = document.querySelector("[data-share-poster]");
const posterImage = document.querySelector("[data-poster-image]");
const posterTitle = document.querySelector("[data-poster-title]");
const posterLocation = document.querySelector("[data-poster-location]");
const posterBody = document.querySelector("[data-poster-body]");
const posterCanvas = document.querySelector("[data-export-canvas]");
const posterDownload = document.querySelector("[data-download-poster]");
const saveMemoryButton = document.querySelector("[data-save-memory]");
const saveStatus = document.querySelector("[data-save-status]");
const memoryRow = document.querySelector("[data-memory-row]");
const diaryTimeline = document.querySelector("[data-diary-timeline]");
const summaryMemory = document.querySelector("[data-summary-memory]");
const summaryCity = document.querySelector("[data-summary-city]");
const recordLatestTitle = document.querySelector("[data-record-latest-title]");
const recordLatestMeta = document.querySelector("[data-record-latest-meta]");
const recordVisibility = document.querySelector("[data-record-visibility]");
const recordNextAction = document.querySelector("[data-record-next-action]");
const openArchiveButton = document.querySelector("[data-open-archive]");
const archiveBack = document.querySelector("[data-archive-back]");
const archiveSearch = document.querySelector("[data-archive-search]");
const archiveFilters = document.querySelectorAll("[data-archive-filter]");
const archiveList = document.querySelector("[data-archive-list]");
const archiveEmpty = document.querySelector("[data-archive-empty]");
const archiveCount = document.querySelector("[data-archive-count]");
const exportArchiveButton = document.querySelector("[data-export-archive]");
const importArchiveButton = document.querySelector("[data-import-archive]");
const importArchiveInput = document.querySelector("[data-import-archive-input]");
const archiveTransferStatus = document.querySelector("[data-archive-transfer-status]");
const editPanel = document.querySelector("[data-edit-panel]");
const editHeading = document.querySelector("[data-edit-heading]");
const editTitle = document.querySelector("[data-edit-title]");
const editBody = document.querySelector("[data-edit-body]");
const editLocation = document.querySelector("[data-edit-location]");
const editRoute = document.querySelector("[data-edit-route]");
const editPhotos = document.querySelector("[data-edit-photos]");
const editTags = document.querySelector("[data-edit-tags]");
const editSave = document.querySelector("[data-edit-save]");
const editCancel = document.querySelector("[data-edit-cancel]");
const editStatus = document.querySelector("[data-edit-status]");
const searchShortcut = document.querySelector(".search-button");
const destinationSearch = document.querySelector(".review-search input");
const destinationSearchButton = document.querySelector(".review-search button");
const communityTabs = document.querySelectorAll("[data-community-tab]");
const communityPanels = document.querySelectorAll("[data-community-panel]");
const communityChannelKicker = document.querySelector("[data-community-channel-kicker]");
const communityChannelTitle = document.querySelector("[data-community-channel-title]");
const communityChannelCopy = document.querySelector("[data-community-channel-copy]");
const communityCityButtons = document.querySelectorAll("[data-city-query]");
const reviewFilters = document.querySelectorAll(".review-filter");
const reviewCards = document.querySelectorAll("[data-review-card]");
const reviewEmpty = document.querySelector(".review-empty");
const destinationBack = document.querySelector("[data-destination-back]");
const destinationImage = document.querySelector("[data-destination-image]");
const destinationTitle = document.querySelector("[data-destination-title]");
const destinationLocation = document.querySelector("[data-destination-location]");
const destinationScore = document.querySelector("[data-destination-score]");
const destinationRecommend = document.querySelector("[data-destination-recommend]");
const destinationSummary = document.querySelector("[data-destination-summary]");
const destinationSeason = document.querySelector("[data-destination-season]");
const destinationDuration = document.querySelector("[data-destination-duration]");
const destinationCost = document.querySelector("[data-destination-cost]");
const destinationCrowd = document.querySelector("[data-destination-crowd]");
const destinationVerdict = document.querySelector("[data-destination-verdict]");
const destinationFit = document.querySelector("[data-destination-fit]");
const destinationPros = document.querySelector("[data-destination-pros]");
const destinationCons = document.querySelector("[data-destination-cons]");
const destinationDimensions = document.querySelector("[data-destination-dimensions]");
const destinationMemory = document.querySelector("[data-destination-memory]");
const destinationMemoryNote = document.querySelector("[data-destination-memory-note]");
const destinationRoute = document.querySelector("[data-destination-route]");
const destinationComments = document.querySelector("[data-destination-comments]");
const wantAction = document.querySelector("[data-want-action]");
const planAction = document.querySelector("[data-plan-action]");
const memoryAction = document.querySelector("[data-memory-action]");
const actionFeedback = document.querySelector("[data-action-feedback]");
const planPanel = document.querySelector("[data-plan-panel]");
const planClose = document.querySelector("[data-plan-close]");
const planSave = document.querySelector("[data-plan-save]");
const planStatus = document.querySelector("[data-plan-status]");
const planTitle = document.querySelector("[data-plan-title]");
const planDuration = document.querySelector("[data-plan-duration]");
const planSeason = document.querySelector("[data-plan-season]");
const planCrowd = document.querySelector("[data-plan-crowd]");
const planRoute = document.querySelector("[data-plan-route]");
const memoryBack = document.querySelector("[data-memory-back]");
const memoryHero = document.querySelector("[data-memory-hero]");
const memoryTitle = document.querySelector("[data-memory-title]");
const memoryLocation = document.querySelector("[data-memory-location]");
const memoryMeta = document.querySelector("[data-memory-meta]");
const memoryBody = document.querySelector("[data-memory-body]");
const memoryGallery = document.querySelector("[data-memory-gallery]");
const memoryRoute = document.querySelector("[data-memory-route]");
const memoryOrigin = document.querySelector("[data-memory-origin]");
const memoryStatusChip = document.querySelector("[data-memory-status-chip]");
const memoryTags = document.querySelector("[data-memory-tags]");
const conversationList = document.querySelector("[data-conversation-list]");
const conversationItems = document.querySelectorAll("[data-conversation-item]");
const messageInboxSummary = document.querySelector("[data-message-inbox-summary]");
const messageUnreadCount = document.querySelector("[data-message-unread-count]");
const conversationThread = document.querySelector("[data-conversation-thread]");
const conversationTitle = document.querySelector("[data-conversation-title]");
const conversationStatus = document.querySelector("[data-conversation-status]");
const conversationMessages = document.querySelector("[data-conversation-messages]");
const conversationInput = document.querySelector("[data-conversation-message-input]");
const conversationSend = document.querySelector("[data-conversation-send]");
const messageThreadState = document.querySelector("[data-message-thread-state]");
const messageEmptyReply = document.querySelector("[data-message-empty-reply]");
const directMessageUsername = document.querySelector("[data-direct-message-username]");
const directMessageStart = document.querySelector("[data-direct-message-start]");
const directMessageFeedback = document.querySelector("[data-direct-message-feedback]");
const profileActionButtons = document.querySelectorAll("[data-profile-primary-action], [data-profile-quick-action]");
const profileAvatarEdit = document.querySelector("[data-profile-avatar-edit]");
const profileEditPanel = document.querySelector("[data-profile-edit-panel]");
const profileEditClose = document.querySelector("[data-profile-edit-close]");
const profileAvatarInput = document.querySelector("[data-profile-avatar-input]");
const profileAvatarImage = document.querySelector("[data-profile-avatar-image]");
const profileAvatarPreview = document.querySelector("[data-profile-avatar-preview]");
const profileSpaceEntryButtons = document.querySelectorAll("[data-open-profile-space]");
const profileLocalMemories = document.querySelector("[data-profile-local-memories]");
const profileLocalMeta = document.querySelector("[data-profile-local-meta]");
const profileDraftMemories = document.querySelector("[data-profile-draft-memories]");
const profileDraftMeta = document.querySelector("[data-profile-draft-meta]");
const profileArchiveSummary = document.querySelector("[data-profile-archive-summary]");
const profileSpaceBack = document.querySelector("[data-profile-space-back]");
const profileSpaceEditButtons = document.querySelectorAll("[data-profile-space-edit], [data-profile-space-avatar-edit]");
const profileSpaceTabs = document.querySelectorAll("[data-profile-space-tab]");
const profileSpaceEmpty = document.querySelector("[data-profile-space-empty]");
const profileSpaceCounters = document.querySelector("[data-profile-space-counters]");
const profileSpaceList = document.querySelector("[data-profile-space-list]");

const particlePalette = [
  "rgba(214, 181, 109, 0.9)",
  "rgba(255, 122, 92, 0.82)",
  "rgba(111, 200, 189, 0.8)",
  "rgba(245, 239, 228, 0.62)",
];

const destinationData = window.destinationData || {};
const memoryDomain = window.shanhaiMemoryDomain;
const localStore = window.shanhaiLocalStore;
const archiveTransfer = window.shanhaiArchiveTransfer;

let particles = [];
let animationFrame = 0;
let startTime = performance.now();
let activeReviewFilter = "all";
let activeArchiveFilter = "all";
let activeDestinationId = "kiyomizu";
let activeMemoryId = "seed-kyoto";
let activeEditMemoryId = "";
let selectedPhotoIds = Array.from(photoOptions)
  .filter((option) => option.classList.contains("is-selected"))
  .map((option) => option.dataset.photoId);
let isRestoringCreateDraft = false;
const baseArchiveStats = {
  memories: 28,
  cities: 12,
};
const seedMemories = window.seedMemories || [];
let destinationState = localStore.loadDestinationState();
let savedMemories = localStore.loadSavedMemories();
let cloudSpaceMemories = [];

function persistSavedMemories() {
  return localStore.persistSavedMemories(savedMemories);
}

function saveDestinationState() {
  const result = localStore.saveDestinationState(destinationState);
  if (!result.ok) {
    actionFeedback.textContent = "本机存储不可用，本次状态只会暂时保留。";
  }
}

function hasState(kind, destinationId = activeDestinationId) {
  return destinationState[kind].includes(destinationId);
}

function toggleState(kind, destinationId = activeDestinationId) {
  const values = new Set(destinationState[kind]);
  const shouldRemove = values.has(destinationId);

  if (shouldRemove) {
    values.delete(destinationId);
  } else {
    values.add(destinationId);
  }

  destinationState = { ...destinationState, [kind]: Array.from(values) };
  saveDestinationState();
  return !shouldRemove;
}

function sizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles(rect.width, rect.height);
}

function routePoint(t, width, height) {
  const x = width * (0.18 + 0.66 * t);
  const y = height * (0.62 - 0.28 * Math.sin(t * Math.PI) + 0.06 * Math.sin(t * Math.PI * 3));
  return { x, y };
}

function createParticles(width, height) {
  const count = Math.max(120, Math.floor((width * height) / 2100));
  particles = Array.from({ length: count }, (_, index) => {
    const t = index / Math.max(count - 1, 1);
    const target = routePoint(t, width, height);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      tx: target.x + (Math.random() - 0.5) * 34,
      ty: target.y + (Math.random() - 0.5) * 34,
      size: 0.7 + Math.random() * 1.9,
      drift: Math.random() * Math.PI * 2,
      color: particlePalette[index % particlePalette.length],
      delay: Math.random() * 0.28,
    };
  });
}

function drawMapLines(width, height, progress) {
  ctx.save();
  ctx.globalAlpha = 0.08 + progress * 0.16;
  ctx.strokeStyle = "rgba(245, 239, 228, 0.5)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i += 1) {
    const y = height * (0.22 + i * 0.12);
    ctx.beginPath();
    ctx.moveTo(width * 0.14, y);
    ctx.bezierCurveTo(width * 0.32, y - 18, width * 0.66, y + 18, width * 0.86, y - 4);
    ctx.stroke();
  }

  for (let i = 0; i < 4; i += 1) {
    const x = width * (0.22 + i * 0.17);
    ctx.beginPath();
    ctx.moveTo(x, height * 0.18);
    ctx.bezierCurveTo(x + 22, height * 0.34, x - 18, height * 0.56, x + 10, height * 0.76);
    ctx.stroke();
  }

  ctx.restore();
}

function drawParticles(time) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const elapsed = (time - startTime) / 2300;
  const progress = Math.min(elapsed, 1);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(8, 10, 12, 0.26)";
  ctx.fillRect(0, 0, width, height);

  drawMapLines(width, height, progress);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  particles.forEach((particle) => {
    const localProgress = Math.max(0, Math.min((progress - particle.delay) / 0.8, 1));
    const particleEase = 1 - Math.pow(1 - localProgress, 3);
    const drift = Math.sin(time * 0.0014 + particle.drift) * 5;
    const x = particle.x + (particle.tx - particle.x) * particleEase + drift;
    const y = particle.y + (particle.ty - particle.y) * particleEase + Math.cos(time * 0.001 + particle.drift) * 4;
    const alpha = 0.18 + particleEase * 0.72;

    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.lineWidth = 1.4;
  ctx.strokeStyle = "rgba(214, 181, 109, 0.36)";
  ctx.globalAlpha = Math.min(progress * 1.5, 0.72);
  ctx.beginPath();

  for (let i = 0; i <= 70; i += 1) {
    const point = routePoint(i / 70, width, height);
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }

  ctx.stroke();
  ctx.restore();

  if (progress < 1.12) {
    animationFrame = requestAnimationFrame(drawParticles);
  }
}

function hideSplash() {
  splash.classList.add("is-hidden");
}

function startSplash() {
  splash.classList.remove("is-hidden");
  startTime = performance.now();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(drawParticles);
  window.setTimeout(hideSplash, 2450);
}

function activateScreen(target, hashTarget = target, updateHash = true) {
  const nextTarget = document.querySelector(`[data-screen="${target}"]`) ? target : "record";

  screens.forEach((screen) => {
    const isActive = screen.dataset.screen === nextTarget;
    screen.classList.toggle("is-active", isActive);
    if (isActive) {
      screen.scrollTop = 0;
    }
  });

  const navTarget =
    nextTarget === "destination"
      ? "community"
      : nextTarget === "memory-detail" || nextTarget === "archive"
        ? "record"
        : nextTarget === "profile-space"
          ? "profile"
          : nextTarget;
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === navTarget);
  });

  if (updateHash && window.location.hash !== `#${hashTarget}`) {
    history.replaceState(null, "", `#${hashTarget}`);
  }
}

function activateMode(selectedMode) {
  modeTabs.forEach((item) => {
    const isSelected = item.dataset.mode === selectedMode;
    item.classList.toggle("is-active", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
  });

  mapView.classList.toggle("is-active", selectedMode === "map");
  diaryView.classList.toggle("is-active", selectedMode === "diary");
}

function openRecordBrowse(kind) {
  if (!recordBrowsePanel || !recordBrowseContent) {
    return;
  }

  const isDiary = kind === "diary";
  const entries = isDiary
    ? [
        ["雨后的清水寺", "日记 · 1,240 字 · 12 张照片 · 已生成回望长图"],
        ["冰岛环岛第 3 天", "映记 · 黑沙滩、海风和迟到的日落"],
        ["巴黎左岸一小时", "回望 · 咖啡、旧书摊和塞纳河雨声"],
      ]
    : [
        ["京都", "路线 · 清水寺 -> 二年坂 -> 八坂神社 · 4.8 km"],
        ["雷克雅未克", "城市 · 南岸瀑布 -> 黑沙滩 -> 海岸线 · 312 km"],
        ["巴黎", "路线 · 左岸 -> 旧书摊 -> 塞纳河 · 3.2 km"],
      ];

  recordBrowseKicker.textContent = isDiary ? "日记翻阅" : "足迹翻阅";
  recordBrowseTitle.textContent = isDiary ? "映记与回望" : "城市路线";
  recordBrowseContent.replaceChildren(
    ...entries.map(([title, body]) => {
      const item = document.createElement("article");
      const strong = document.createElement("strong");
      const span = document.createElement("span");

      strong.textContent = title;
      span.textContent = body;
      item.append(strong, span);
      return item;
    }),
  );
  recordBrowsePanel.hidden = false;
  recordBrowsePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function switchCommunityTab(tabName) {
  const channelCopy = {
    reviews: ["当前频道", "目的地点评", "按城市、景区和真实体验筛选，先判断值不值得去。"],
    featured: ["当前频道", "精选公开映记", "看编辑精选、热门路线和高质量公开日志，适合找灵感。"],
    nearby: ["当前频道", "附近旅行动态", "查看身边正在发生的旅行记录、路线提醒和地点热度。"],
    cities: ["当前频道", "城市索引", "按城市进入点评、公开日志和路线集合，方便连续翻阅。"],
  };
  const [kicker, title, copy] = channelCopy[tabName] || channelCopy.reviews;

  communityTabs.forEach((tab) => {
    const isActive = tab.dataset.communityTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  communityPanels.forEach((panel) => {
    const isActive = panel.dataset.communityPanel === tabName;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  communityChannelKicker.textContent = kicker;
  communityChannelTitle.textContent = title;
  communityChannelCopy.textContent = copy;

  if (destinationSearch) {
    destinationSearch.placeholder =
      tabName === "featured"
        ? "搜索精选公开映记、路线或创作者"
        : tabName === "nearby"
          ? "搜索附近城市、路线或地点"
          : tabName === "cities"
            ? "搜索城市名"
            : "搜索城市、景区或关键词";
  }
}

const baseConversationState = {
  "lin-che": {
    title: "林澈",
    status: "正在整理京都路线",
    preview: "刚分享了京都路线",
    lastTime: "现在",
    unreadCount: 1,
    messages: [
      ["from-friend", "我把清水寺到八坂神社的步行线补全了，你看要不要放进公开映记？"],
      ["from-me", "可以，记得加上人流时间和拍照点。"],
    ],
  },
  mori: {
    title: "森野",
    status: "想复用你的冰岛照片参数",
    preview: "问你冰岛照片参数",
    lastTime: "12:08",
    unreadCount: 1,
    messages: [
      ["from-friend", "黑沙滩那组颜色很好看，是清晨拍的吗？"],
      ["from-me", "是清晨，风很大，快门要留一点余量。"],
    ],
  },
  aya: {
    title: "青禾",
    status: "关注了你的公开主页",
    preview: "收藏了你的西湖晨雾",
    lastTime: "昨天",
    unreadCount: 0,
    messages: [
      ["from-friend", "西湖晨雾那篇我收藏了，下次想照着走一遍。"],
      ["from-me", "我把路线和备选咖啡店也补上。"],
    ],
  },
};

function isConversationMessage(message) {
  return Array.isArray(message) && typeof message[0] === "string" && typeof message[1] === "string";
}

function normalizeConversationMessage(message) {
  if (isConversationMessage(message)) {
    return message;
  }
  if (message && typeof message === "object" && typeof message.body === "string") {
    return [message.direction === "from-friend" ? "from-friend" : "from-me", message.body];
  }
  return null;
}

function mergeConversationMessages(...messageLists) {
  const seen = new Set();
  const merged = [];

  messageLists.flat().forEach((message) => {
    const normalized = normalizeConversationMessage(message);
    if (!normalized) {
      return;
    }
    const key = `${normalized[0]}\u0000${normalized[1]}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    merged.push(normalized);
  });

  return merged;
}

function normalizeConversationState(conversations) {
  if (!conversations || typeof conversations !== "object" || Array.isArray(conversations)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(conversations).map(([id, conversation]) => {
      const fallback = baseConversationState[id] || {};
      const messages = Array.isArray(conversation?.messages) ? mergeConversationMessages(conversation.messages) : fallback.messages || [];

      return [
        id,
        {
          ...fallback,
          title: typeof conversation?.title === "string" ? conversation.title : fallback.title,
          status: typeof conversation?.status === "string" ? conversation.status : fallback.status,
          preview: typeof conversation?.preview === "string" ? conversation.preview : fallback.preview,
          lastTime: typeof conversation?.lastTime === "string" ? conversation.lastTime : fallback.lastTime,
          unreadCount: Number.isFinite(conversation?.unreadCount) ? Math.max(0, conversation.unreadCount) : fallback.unreadCount || 0,
          messages: messages.length ? messages : fallback.messages || [],
        },
      ];
    }),
  );
}

function hydrateConversationState() {
  const savedConversations = normalizeConversationState(localStore.loadConversationState?.());
  const seededConversations = Object.fromEntries(
    Object.entries(baseConversationState).map(([id, conversation]) => [
      id,
      {
        ...conversation,
        ...(savedConversations[id] || {}),
      },
    ]),
  );
  return {
    ...seededConversations,
    ...Object.fromEntries(Object.entries(savedConversations).filter(([id]) => !seededConversations[id])),
  };
}

function persistConversationState() {
  localStore.persistConversationState?.(conversationState);
}

const conversationState = hydrateConversationState();

let activeConversationId = "lin-che";

function applyRemoteConversation(conversation) {
  const id = conversation?.conversationId || conversation?.id;
  if (!id) {
    return;
  }

  const fallback = baseConversationState[id] || {};
  const current = conversationState[id] || {
    title: conversation.title || id,
    status: conversation.status || "云端私信",
    preview: conversation.preview || "还没有消息",
    lastTime: conversation.lastTime || "刚刚",
    unreadCount: 0,
    messages: [],
  };
  const remoteMessages = Array.isArray(conversation.messages) ? conversation.messages.map(normalizeConversationMessage).filter(Boolean) : [];
  conversationState[id] = {
    ...current,
    title: conversation.title || current.title || fallback.title,
    status: conversation.status || current.status || fallback.status,
    preview: conversation.preview || current.preview || fallback.preview,
    lastTime: conversation.lastTime || current.lastTime || fallback.lastTime,
    unreadCount: Number.isFinite(conversation.unreadCount) ? Math.max(0, conversation.unreadCount) : current.unreadCount || 0,
    messages: mergeConversationMessages(fallback.messages || [], current.messages || [], remoteMessages),
  };
}

function rerenderActiveConversation() {
  renderConversationList();
  if (!conversationThread?.hidden) {
    const activeConversation = conversationState[activeConversationId] || conversationState["lin-che"];
    conversationTitle.textContent = activeConversation.title;
    conversationStatus.textContent = activeConversation.status;
    renderConversationMessages(activeConversation.messages);
  }
}

async function syncConversationsFromCloud() {
  const api = window.shanhaiApi;
  if (!api?.getToken?.()) {
    return;
  }

  try {
    const payload = await api.listConversations();
    (payload.conversations || []).forEach(applyRemoteConversation);
    persistConversationState();
    rerenderActiveConversation();
  } catch (error) {
    if (messageThreadState && !conversationThread?.hidden) {
      messageThreadState.textContent = "云端消息暂时不可用，本机记录已保留";
    }
  }
}

async function syncSentConversation(conversationId, text) {
  const api = window.shanhaiApi;
  if (!api?.getToken?.()) {
    return;
  }

  try {
    const conversation = conversationState[conversationId] || conversationState["lin-che"];
    const payload = await api.sendConversationMessage(conversationId, {
      body: text,
      title: conversation.title,
    });
    applyRemoteConversation(payload.conversation);
    persistConversationState();
    rerenderActiveConversation();
    if (messageThreadState) {
      messageThreadState.textContent = "云端已同步";
    }
  } catch (error) {
    if (messageThreadState) {
      messageThreadState.textContent = "本机已保存，云端同步失败";
    }
  }
}

function normalizeDirectUsername(value) {
  return String(value || "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();
}

function conversationInitial(data, id) {
  const source = data?.title || id || "?";
  return source.trim().charAt(0).toUpperCase() || "?";
}

function getConversationItems() {
  return Array.from(conversationList?.querySelectorAll("[data-conversation-item]") || conversationItems);
}

function renderCloudConversationItems() {
  if (!conversationList) {
    return;
  }

  Object.entries(conversationState).forEach(([id, data]) => {
    if (conversationList.querySelector(`[data-conversation-item="${CSS.escape(id)}"]`)) {
      return;
    }

    const item = document.createElement("button");
    const avatar = document.createElement("span");
    const text = document.createElement("span");
    const title = document.createElement("strong");
    const preview = document.createElement("em");
    const meta = document.createElement("small");
    const time = document.createElement("span");
    const unread = document.createElement("b");

    item.className = "conversation-item";
    item.type = "button";
    item.dataset.conversationItem = id;
    avatar.className = "conversation-avatar cloud";
    avatar.textContent = conversationInitial(data, id);
    preview.dataset.conversationPreview = "";
    time.dataset.conversationTime = "";
    unread.dataset.conversationUnread = "";
    title.textContent = data.title || `@${id}`;
    preview.textContent = data.preview || "还没有消息";
    time.textContent = data.lastTime || "现在";
    unread.textContent = data.unreadCount ? `${data.unreadCount} 新` : "已读";
    text.append(title, preview);
    meta.append(time, unread);
    item.append(avatar, text, meta);
    conversationList.append(item);
  });
}

function renderConversationList() {
  renderCloudConversationItems();
  const items = getConversationItems();
  const unreadTotal = Object.values(conversationState).reduce((total, item) => total + item.unreadCount, 0);

  if (messageInboxSummary) {
    messageInboxSummary.textContent = `${items.length} 个对话 · ${unreadTotal} 条未读`;
  }
  if (messageUnreadCount) {
    messageUnreadCount.textContent = unreadTotal ? `${unreadTotal} 未读` : "全部已读";
  }

  items.forEach((item) => {
    const id = item.dataset.conversationItem;
    const data = conversationState[id];
    const preview = item.querySelector("[data-conversation-preview]");
    const time = item.querySelector("[data-conversation-time]");
    const unread = item.querySelector("[data-conversation-unread]");

    if (!data) {
      return;
    }

    item.classList.toggle("is-active", id === activeConversationId);
    item.classList.toggle("has-unread", data.unreadCount > 0);
    item.setAttribute("aria-label", `${data.title}，${data.preview}`);
    if (preview) {
      preview.textContent = data.preview;
    }
    if (time) {
      time.textContent = data.lastTime;
    }
    if (unread) {
      unread.textContent = data.unreadCount ? `${data.unreadCount} 新` : "已读";
    }
  });
}

function renderConversationMessages(messages) {
  conversationMessages.replaceChildren(
    ...messages.map(([className, text]) => {
      const message = document.createElement("article");
      const bubble = document.createElement("span");

      message.className = className;
      bubble.textContent = text;
      message.append(bubble);
      return message;
    }),
  );
}

function openConversation(conversationId) {
  if (!conversationThread || !conversationMessages) {
    return;
  }

  const activeId = conversationState[conversationId] ? conversationId : "lin-che";
  const activeConversation = conversationState[activeId];
  activeConversationId = activeId;
  activeConversation.unreadCount = 0;
  conversationTitle.textContent = activeConversation.title;
  conversationStatus.textContent = activeConversation.status;
  renderConversationMessages(activeConversation.messages);
  renderConversationList();
  if (messageThreadState) {
    messageThreadState.textContent = "正在查看";
  }
  if (messageEmptyReply) {
    messageEmptyReply.textContent = "";
  }
  if (conversationInput) {
    conversationInput.setAttribute("aria-invalid", "false");
  }
  conversationThread.hidden = false;
  persistConversationState();
}

function startDirectConversation() {
  const username = normalizeDirectUsername(directMessageUsername?.value);
  if (!username || !/^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/.test(username)) {
    if (directMessageFeedback) {
      directMessageFeedback.textContent = "请输入正确的用户名";
    }
    directMessageUsername?.focus();
    return;
  }

  if (!window.shanhaiApi?.getToken?.()) {
    if (directMessageFeedback) {
      directMessageFeedback.textContent = "请先登录账号，再发起云端私信";
    }
    directMessageUsername?.focus();
    return;
  }

  if (!conversationState[username]) {
    conversationState[username] = {
      title: `@${username}`,
      status: "云端私信",
      preview: "还没有消息",
      lastTime: "现在",
      unreadCount: 0,
      messages: [],
    };
  }

  if (directMessageUsername) {
    directMessageUsername.value = "";
  }
  if (directMessageFeedback) {
    directMessageFeedback.textContent = "已打开云端私信";
  }
  persistConversationState();
  openConversation(username);
  conversationInput?.focus();
}

function renderProfileDashboardStats() {
  const localEntries = savedMemories.filter((memory) => isSavedMemory(memory));
  const cityCount = new Set(localEntries.map((memory) => memory.city || memory.location).filter(Boolean)).size;
  const draftCount = localEntries.filter((memory) => !["public", "unlisted"].includes(memory.status || memory.visibility)).length;
  const publicCount = localEntries.filter((memory) => (memory.status || memory.visibility) === "public").length;

  if (profileLocalMemories) {
    profileLocalMemories.textContent = String(localEntries.length);
  }
  if (profileLocalMeta) {
    profileLocalMeta.textContent = `${cityCount} 座城市`;
  }
  if (profileDraftMemories) {
    profileDraftMemories.textContent = String(draftCount);
  }
  if (profileDraftMeta) {
    profileDraftMeta.textContent = publicCount ? `${publicCount} 篇已公开` : "私密和草稿";
  }
  if (profileArchiveSummary) {
    profileArchiveSummary.textContent = `${localEntries.length} 篇本机映记`;
  }
}

function sendConversationReply() {
  const text = conversationInput?.value.trim();

  if (!text || !conversationMessages) {
    if (conversationInput) {
      conversationInput.setAttribute("aria-invalid", "true");
      conversationInput.focus();
    }
    if (messageEmptyReply) {
      messageEmptyReply.textContent = "请输入回复内容。";
    }
    return;
  }

  const activeConversation = conversationState[activeConversationId] || conversationState["lin-che"];
  activeConversation.messages.push(["from-me", text]);
  activeConversation.preview = `我：${text}`;
  activeConversation.lastTime = "刚刚";
  activeConversation.status = "已发送";
  persistConversationState();
  conversationInput.value = "";
  conversationInput.setAttribute("aria-invalid", "false");
  if (messageEmptyReply) {
    messageEmptyReply.textContent = "";
  }
  if (messageThreadState) {
    messageThreadState.textContent = "已发送";
  }
  openConversation(activeConversationId);
  if (messageThreadState) {
    messageThreadState.textContent = "已发送";
  }
  syncSentConversation(activeConversationId, text);
}

function getVisibilityLabel(value) {
  return (
    {
      public: "公开",
      unlisted: "仅链接",
      private: "私密",
    }[value] || "私密"
  );
}

function renderProfileSpaceList(tabName = "notes") {
  if (!profileSpaceList || !profileSpaceCounters || !profileSpaceEmpty) {
    return;
  }

  const localEntries = savedMemories.filter((memory) => isSavedMemory(memory));
  const entries = [...cloudSpaceMemories, ...localEntries];
  const publicCount = entries.filter((memory) => (memory.status || memory.visibility) === "public").length;
  const privateCount = entries.filter((memory) => !["public", "unlisted"].includes(memory.status || memory.visibility)).length;
  const unlistedCount = entries.filter((memory) => (memory.status || memory.visibility) === "unlisted").length;

  profileSpaceCounters.replaceChildren(
    ...[`公开 ${publicCount}`, `私密 ${privateCount}`, `仅链接 ${unlistedCount}`].map((label) => {
      const item = document.createElement("span");
      item.textContent = label;
      return item;
    }),
  );

  if (tabName !== "notes") {
    profileSpaceList.replaceChildren();
    profileSpaceEmpty.hidden = false;
    return;
  }

  if (!entries.length) {
    profileSpaceList.replaceChildren();
    profileSpaceEmpty.hidden = false;
    return;
  }

  profileSpaceEmpty.hidden = true;
  profileSpaceList.replaceChildren(
    ...entries.map((memory) => {
      const item = document.createElement("article");
      const image = document.createElement("img");
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      const meta = document.createElement("span");
      const status = document.createElement("em");

      item.dataset.profileSpaceMemory = memory.id;
      image.src = memory.cover;
      image.alt = memory.alt || `${memory.title} 照片`;
      title.textContent = memory.title;
      meta.textContent = [memory.location, memory.route].filter(Boolean).join(" · ");
      status.textContent = getVisibilityLabel(memory.status || memory.visibility);
      copy.append(title, meta, status);
      item.append(image, copy);
      item.addEventListener("click", () => openMemoryDetail(memory.id));
      return item;
    }),
  );
}

function activateProfileSpaceTab(tabName = "notes") {
  profileSpaceTabs.forEach((button) => {
    const isSelected = button.dataset.profileSpaceTab === tabName;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  if (!profileSpaceEmpty) {
    return;
  }

  const copy = {
    notes: ["还没有公开内容", "编辑资料后，就可以从云端发布区把旅行映记发布到这里。"],
    bookmarks: ["还没有收藏路线", "在社区收藏公开映记后，会集中出现在这里。"],
    liked: ["还没有赞过内容", "你喜欢过的旅行记录会沉淀成个人灵感库。"],
    comments: ["还没有评论互动", "公开映记收到的评论、赞和收藏会在这里汇总。"],
    following: ["正在整理关注列表", "关注的旅行创作者会成为你的灵感来源。"],
    followers: ["正在整理粉丝列表", "公开发布后，关注你的人会显示在这里。"],
  }[tabName] || ["还没有公开内容", "编辑资料后，就可以从云端发布区把旅行映记发布到这里。"];

  profileSpaceEmpty.querySelector("strong").textContent = copy[0];
  profileSpaceEmpty.querySelector("p").textContent = copy[1];
  renderProfileSpaceList(tabName);
}

function openProfileSpace(tabName = "notes") {
  closeProfileEditPanel();
  activateScreen("profile-space", "profile-space");
  activateProfileSpaceTab(tabName);
}

function openProfileEditPanel() {
  if (!profileEditPanel) {
    return;
  }

  activateScreen("profile-space", "profile-space");
  profileEditPanel.hidden = false;
  requestAnimationFrame(() => {
    profileEditPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function closeProfileEditPanel() {
  if (profileEditPanel) {
    profileEditPanel.hidden = true;
  }
}

function previewProfileAvatar() {
  const file = profileAvatarInput?.files?.[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const source = String(reader.result || "");
    if (profileAvatarImage) {
      profileAvatarImage.src = source;
    }
    if (profileAvatarPreview) {
      profileAvatarPreview.src = source;
    }
  });
  reader.readAsDataURL(file);
}

function handleProfileAction(event) {
  const button = event.currentTarget;
  const target = button.dataset.profileGo;

  if (target === "profile-space") {
    openProfileSpace();
    return;
  }

  if (target === "archive") {
    openArchiveLibrary();
    return;
  }

  if (target) {
    activateScreen(target);
    return;
  }

  if (button.dataset.profileFocus === "photos") {
    document.querySelector("[data-cloud-photo-list]")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (button.dataset.profileFocus === "export") {
    document.querySelector("[data-cloud-panel]")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function getPhotoData(option) {
  return {
    id: option.dataset.photoId,
    place: option.dataset.photoPlace,
    time: option.dataset.photoTime,
    src: option.dataset.photoSrc,
    alt: option.querySelector("img")?.alt || "旅行照片",
  };
}

function getSelectedPhotoData() {
  const photoById = new Map(photoOptions.map((option) => [option.dataset.photoId, option]));
  return selectedPhotoIds.map((photoId) => photoById.get(photoId)).filter(Boolean).map(getPhotoData);
}

function readCreateDraft() {
  return localStore.loadCreateDraft();
}

function getLocalPhotoDrafts() {
  return photoOptions
    .filter((option) => option.dataset.photoId.startsWith("local-"))
    .map(getPhotoData);
}

function getCreatePublishLabel() {
  return (
    {
      private: "私密保存",
      unlisted: "仅链接可见",
      public: "公开发布",
    }[createVisibility?.value] || "私密保存"
  );
}

function renderCreateReadiness(state = "已自动保存") {
  if (createDraftState) {
    createDraftState.textContent = state;
  }
  if (createPhotoCount) {
    createPhotoCount.textContent = selectedPhotoIds.length ? `${selectedPhotoIds.length} 张已选` : "还未选择";
  }
  if (createPublishTarget) {
    createPublishTarget.textContent = getCreatePublishLabel();
  }
}

function saveCreateDraft() {
  if (isRestoringCreateDraft) {
    return;
  }

  const result = localStore.saveCreateDraft({
    title: createTitle.value,
    location: createLocation.value,
    date: createDate?.value || "",
    route: createRoute?.value || "",
    tags: createTags?.value || "",
    visibility: createVisibility?.value || "private",
    body: createBody.value,
    selectedPhotoIds,
    localPhotos: getLocalPhotoDrafts(),
  });

  if (!result.ok) {
    saveStatus.textContent = "草稿暂时无法自动保存，本机存储空间可能不足。";
    renderCreateReadiness("草稿未保存");
    return;
  }
  renderCreateReadiness("已自动保存");
}

function clearCreateDraft() {
  localStore.clearCreateDraft();
}

function restoreCreateDraft() {
  const draft = readCreateDraft();

  if (!draft || typeof draft !== "object") {
    syncCreateFlow(false);
    return;
  }

  isRestoringCreateDraft = true;

  if (Array.isArray(draft.localPhotos)) {
    draft.localPhotos.forEach((photo) => {
      const hasPhoto = photo?.id && photoOptions.some((option) => option.dataset.photoId === photo.id);
      if (hasPhoto || !photo?.src) {
        return;
      }
      createPhotoOption({
        id: photo.id,
        place: photo.place || "本地照片",
        time: photo.time || "--",
        src: photo.src,
        alt: photo.alt || `${photo.place || "本地照片"} 旅行照片`,
      });
    });
  }

  if (typeof draft.title === "string") {
    createTitle.value = draft.title;
  }
  if (typeof draft.location === "string") {
    createLocation.value = draft.location;
  }
  if (typeof draft.date === "string" && createDate) {
    createDate.value = draft.date;
  }
  if (typeof draft.route === "string" && createRoute) {
    createRoute.value = draft.route;
  }
  if (typeof draft.tags === "string" && createTags) {
    createTags.value = draft.tags;
  }
  if (typeof draft.visibility === "string" && createVisibility) {
    createVisibility.value = draft.visibility;
  }
  if (typeof draft.body === "string") {
    createBody.value = draft.body;
  }
  if (Array.isArray(draft.selectedPhotoIds)) {
    const availablePhotoIds = new Set(photoOptions.map((option) => option.dataset.photoId));
    selectedPhotoIds = draft.selectedPhotoIds.filter((photoId) => availablePhotoIds.has(photoId));
  }

  isRestoringCreateDraft = false;
  syncCreateFlow(false);
}

function getBodyExcerpt() {
  const value = createBody.value.trim();
  return value.length > 54 ? `${value.slice(0, 54)}...` : value;
}

function getArchiveEntries() {
  return [...savedMemories, ...seedMemories];
}

function findMemory(memoryId = activeMemoryId) {
  return getArchiveEntries().find((memory) => memory.id === memoryId) || getArchiveEntries()[0];
}

function renderMemoryCard(memory) {
  const article = document.createElement("article");
  const image = document.createElement("img");
  const title = document.createElement("h3");
  const meta = document.createElement("p");

  article.dataset.memoryId = memory.id;
  article.setAttribute("role", "button");
  article.tabIndex = 0;
  image.src = memory.cover;
  image.alt = memory.alt || `${memory.title} 照片`;
  title.textContent = memory.title;
  meta.textContent = `${memory.photoCount} 张照片 · ${memory.words} 字`;
  article.append(image, title, meta);
  article.addEventListener("click", () => openMemoryDetail(memory.id));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMemoryDetail(memory.id);
    }
  });
  return article;
}

function renderDiaryEntry(memory, index) {
  const article = document.createElement("article");
  const time = document.createElement("time");
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  const body = document.createElement("p");

  if (index === 0 && savedMemories.length) {
    article.className = "is-new-memory";
  }

  time.textContent = memory.dateLabel;
  title.textContent = memory.title;
  body.textContent = memory.body;
  copy.append(title, body);
  article.append(time, copy);
  article.dataset.memoryId = memory.id;
  article.setAttribute("role", "button");
  article.tabIndex = 0;
  article.addEventListener("click", () => openMemoryDetail(memory.id));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMemoryDetail(memory.id);
    }
  });
  return article;
}

function renderContinueEntry() {
  const article = document.createElement("article");
  const time = document.createElement("time");
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  const body = document.createElement("p");

  article.className = "continue-card";
  time.textContent = "今天";
  title.textContent = "继续记录";
  body.textContent = "补完下一段山海。";
  copy.append(title, body);
  article.append(time, copy);
  return article;
}

function renderPersonalArchive() {
  const entries = getArchiveEntries();
  const savedCities = new Set(savedMemories.map((memory) => memory.location).filter(Boolean));
  const latest = entries[0];
  const publicCount = entries.filter((memory) => (memory.status || memory.visibility) === "public").length;
  const privateCount = entries.filter((memory) => !["public", "unlisted"].includes(memory.status || memory.visibility)).length;
  const unlistedCount = entries.filter((memory) => (memory.status || memory.visibility) === "unlisted").length;

  memoryRow.replaceChildren(...entries.slice(0, 4).map(renderMemoryCard));
  diaryTimeline.replaceChildren(...entries.slice(0, 3).map(renderDiaryEntry), renderContinueEntry());
  summaryMemory.textContent = `${baseArchiveStats.memories + savedMemories.length} 篇映记`;
  summaryCity.textContent = `${baseArchiveStats.cities + savedCities.size} 座城市`;

  if (latest && recordLatestTitle && recordLatestMeta) {
    recordLatestTitle.textContent = latest.title;
    recordLatestMeta.textContent = `${getVisibilityLabel(latest.status || latest.visibility)} · ${latest.photoCount || latest.photos?.length || 0} 张照片`;
  }
  if (recordVisibility) {
    const visibilityParts = [`私密 ${privateCount}`, `公开 ${publicCount}`];
    if (unlistedCount) {
      visibilityParts.splice(1, 0, `仅链接 ${unlistedCount}`);
    }
    recordVisibility.textContent = entries.length ? visibilityParts.join(" · ") : "本机档案待创建";
  }
  if (recordNextAction) {
    recordNextAction.textContent = entries.length ? "继续整理" : "创建第一篇";
  }
  renderProfileDashboardStats();
}

function getMemoryCountry(memory) {
  if (memory.country) {
    return memory.country;
  }

  if (memory.location?.includes("日本")) {
    return "日本";
  }

  if (memory.location?.includes("冰岛")) {
    return "冰岛";
  }

  return "未标记";
}

function getMemorySearchText(memory) {
  return [memory.title, memory.location, memory.country, memory.city, memory.body, memory.route, ...(memory.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function inferLocationParts(location = "") {
  const country = location.includes("日本") ? "日本" : location.includes("冰岛") ? "冰岛" : "未标记";
  const city = location.replace(/\d{4}\.\d{2}\.\d{2}\s*·\s*/, "").replace(country, "").trim() || location;
  return { country, city };
}

function isSavedMemory(memory) {
  return memory.source === "saved" || memory.id.startsWith("memory-");
}

function matchesArchiveFilter(memory) {
  if (activeArchiveFilter === "all") {
    return true;
  }

  if (activeArchiveFilter === "japan") {
    return getMemoryCountry(memory) === "日本";
  }

  if (activeArchiveFilter === "iceland") {
    return getMemoryCountry(memory) === "冰岛";
  }

  if (activeArchiveFilter === "year-2026") {
    return (memory.year || "2026") === "2026";
  }

  if (activeArchiveFilter === "favorite") {
    return memory.favorite;
  }

  if (activeArchiveFilter === "tagged") {
    return memory.tags?.length > 0;
  }

  if (activeArchiveFilter === "saved") {
    return isSavedMemory(memory);
  }

  return true;
}

function filterArchiveLibrary() {
  const query = archiveSearch.value.trim().toLowerCase();
  return getArchiveEntries().filter((memory) => {
    const matchesQuery = !query || getMemorySearchText(memory).includes(query);
    return matchesQuery && matchesArchiveFilter(memory);
  });
}

function renderArchiveCard(memory) {
  const article = document.createElement("article");
  const image = document.createElement("img");
  const copy = document.createElement("div");
  const label = document.createElement("p");
  const title = document.createElement("h3");
  const body = document.createElement("span");
  const tagList = document.createElement("div");
  const actions = document.createElement("div");
  const favoriteButton = document.createElement("button");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  article.dataset.memoryId = memory.id;
  article.setAttribute("role", "button");
  article.tabIndex = 0;
  image.src = memory.cover;
  image.alt = memory.alt || `${memory.title} 照片`;
  label.textContent = `${memory.year || "2026"} · ${getMemoryCountry(memory)} · ${memory.photoCount} 张照片`;
  title.textContent = memory.title;
  body.textContent = memory.body;
  tagList.className = "tag-list";
  (memory.tags?.length ? memory.tags : ["未标记"]).forEach((tag) => {
    const tagItem = document.createElement("em");
    tagItem.textContent = tag;
    tagList.append(tagItem);
  });
  actions.className = "archive-actions";
  favoriteButton.type = "button";
  favoriteButton.dataset.archiveFavorite = memory.id;
  favoriteButton.textContent = memory.favorite ? "已收藏" : "收藏";
  favoriteButton.classList.toggle("is-active", memory.favorite);
  favoriteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleArchiveFavorite(memory.id);
  });

  if (isSavedMemory(memory)) {
    actions.append(favoriteButton);

    editButton.type = "button";
    editButton.dataset.archiveEdit = memory.id;
    editButton.textContent = "编辑";
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      editSavedMemory(memory.id);
    });

    deleteButton.type = "button";
    deleteButton.dataset.archiveDelete = memory.id;
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteSavedMemory(memory.id);
    });

    actions.append(editButton, deleteButton);
  }

  copy.append(label, title, body, tagList);
  if (actions.childElementCount > 0) {
    copy.append(actions);
  }
  article.append(image, copy);
  article.addEventListener("click", () => openMemoryDetail(memory.id));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMemoryDetail(memory.id);
    }
  });
  return article;
}

function updateSavedMemory(memoryId, updater) {
  const index = savedMemories.findIndex((memory) => memory.id === memoryId);
  if (index === -1) {
    return false;
  }

  savedMemories = savedMemories.map((memory, itemIndex) => (itemIndex === index ? memoryDomain.normalizeMemory(updater(memory)) : memory));
  const result = persistSavedMemories();
  return result.ok;
}

function toggleArchiveFavorite(memoryId) {
  if (!updateSavedMemory(memoryId, (memory) => ({ ...memory, favorite: !memory.favorite, updatedAt: new Date().toISOString() }))) {
    archiveCount.textContent = "本机存储不可用，收藏状态没有保存。";
    return;
  }

  renderPersonalArchive();
  renderArchiveLibrary();
}

function editSavedMemory(memoryId) {
  const current = savedMemories.find((memory) => memory.id === memoryId);
  if (!current) {
    return;
  }

  activeEditMemoryId = memoryId;
  editHeading.textContent = current.title;
  editTitle.value = current.title;
  editBody.value = current.body || "";
  editLocation.value = current.location || "";
  editRoute.value = current.route || "";
  editPhotos.value = (current.photos?.length ? current.photos : [current.cover]).filter(Boolean).join("\n");
  editTags.value = current.tags?.join(", ") || "";
  editStatus.textContent = "";
  editPanel.hidden = false;
  editTitle.focus();
}

function closeEditPanel() {
  activeEditMemoryId = "";
  editPanel.hidden = true;
  editStatus.textContent = "";
}

function parseTagInput(value) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parsePhotoInput(value) {
  return value
    .split(/\r?\n/)
    .map((src) => src.trim())
    .filter(Boolean);
}

function saveEditedMemory() {
  const current = savedMemories.find((memory) => memory.id === activeEditMemoryId);
  if (!current) {
    closeEditPanel();
    return;
  }

  const nextTitle = editTitle.value.trim() || current.title;
  const nextBody = editBody.value.trim() || current.body;
  const nextLocation = editLocation.value.trim() || current.location;
  const nextRoute = editRoute.value.trim() || nextLocation;
  const nextPhotos = parsePhotoInput(editPhotos.value);
  const nextTags = parseTagInput(editTags.value);
  const nextCover = nextPhotos[0] || current.cover;
  const locationParts = inferLocationParts(nextLocation);
  const didSave = updateSavedMemory(activeEditMemoryId, (memory) => ({
    ...memory,
    title: nextTitle,
    body: nextBody,
    location: nextLocation,
    country: locationParts.country,
    city: locationParts.city,
    route: nextRoute,
    cover: nextCover,
    photos: nextPhotos.length ? nextPhotos : memory.photos,
    photoCount: nextPhotos.length || memory.photoCount,
    words: nextBody.length,
    tags: nextTags,
    updatedAt: new Date().toISOString(),
  }));

  if (!didSave) {
    editStatus.textContent = "本机存储不可用，编辑没有保存。";
    return;
  }

  closeEditPanel();
  renderPersonalArchive();
  renderArchiveLibrary();
}

function deleteSavedMemory(memoryId) {
  const current = savedMemories.find((memory) => memory.id === memoryId);
  if (!current || !confirm(`删除「${current.title}」？`)) {
    return;
  }

  savedMemories = savedMemories.filter((memory) => memory.id !== memoryId);
  const result = persistSavedMemories();
  if (!result.ok) {
    savedMemories = [current, ...savedMemories];
    archiveCount.textContent = "本机存储不可用，删除没有保存。";
    return;
  }

  renderPersonalArchive();
  renderArchiveLibrary();
}

function getCurrentArchive() {
  return {
    version: 1,
    memories: savedMemories,
    destinationState,
  };
}

function exportArchive() {
  const json = archiveTransfer.buildArchiveExport(getCurrentArchive());
  const link = document.createElement("a");
  link.href = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
  link.download = `shanhai-yingji-archive-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  archiveTransferStatus.textContent = "已生成本地档案 JSON。";
}

function importArchiveFile() {
  const [file] = importArchiveInput.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const parsed = archiveTransfer.parseArchiveImport(String(reader.result || ""));
    if (!parsed.ok) {
      archiveTransferStatus.textContent = "导入失败：请选择有效的山海映记 JSON。";
      importArchiveInput.value = "";
      return;
    }

    const merged = archiveTransfer.mergeArchive(getCurrentArchive(), parsed.archive);
    const result = localStore.persistArchive(merged);
    if (!result.ok) {
      archiveTransferStatus.textContent = "本机存储不可用，导入没有保存。";
      importArchiveInput.value = "";
      return;
    }

    savedMemories = merged.memories;
    destinationState = merged.destinationState;
    renderPersonalArchive();
    renderArchiveLibrary();
    archiveTransferStatus.textContent = `导入完成，当前共有 ${savedMemories.length} 篇本地映记。`;
    importArchiveInput.value = "";
  });
  reader.readAsText(file);
}

function renderArchiveLibrary() {
  const results = filterArchiveLibrary();

  archiveFilters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.archiveFilter === activeArchiveFilter);
  });

  archiveCount.textContent = `${results.length} 篇映记`;
  archiveList.replaceChildren(...results.map(renderArchiveCard));
  archiveEmpty.hidden = results.length > 0;
}

function openArchiveLibrary(updateHash = true) {
  renderArchiveLibrary();
  activateScreen("archive", "archive", updateHash);
}

function renderMemoryDetail(memoryId = activeMemoryId) {
  const memory = findMemory(memoryId);
  const photos = memory.photos?.length ? memory.photos : [memory.cover];

  activeMemoryId = memory.id;
  memoryHero.src = memory.cover;
  memoryHero.alt = memory.alt || `${memory.title} 封面照片`;
  memoryTitle.textContent = memory.title;
  memoryLocation.textContent = memory.location;
  memoryMeta.textContent = `${memory.photoCount} 张照片 · ${memory.words} 字`;
  memoryBody.textContent = memory.body;
  memoryRoute.textContent = memory.route || memory.location;
  memoryOrigin.textContent = memory.origin || "来自我的山海档案";
  if (memoryStatusChip) {
    memoryStatusChip.textContent = getVisibilityLabel(memory.status || memory.visibility);
  }
  if (memoryTags) {
    memoryTags.replaceChildren(
      ...(memory.tags?.length ? memory.tags : ["未标记"]).map((tag) => {
        const item = document.createElement("span");
        item.textContent = tag;
        return item;
      }),
    );
  }
  memoryGallery.replaceChildren(
    ...photos.slice(0, 6).map((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${memory.title} 照片 ${index + 1}`;
      return image;
    }),
  );
}

function renderExternalMemoryDetail(memory) {
  const photos = memory.photos?.length ? memory.photos : [memory.cover];

  activeMemoryId = memory.id;
  memoryHero.src = memory.cover;
  memoryHero.alt = memory.alt || `${memory.title} 封面照片`;
  memoryTitle.textContent = memory.title;
  memoryLocation.textContent = memory.location;
  memoryMeta.textContent = `${memory.photoCount} 张照片 · ${memory.words} 字`;
  memoryBody.textContent = memory.body;
  memoryRoute.textContent = memory.route || memory.location;
  memoryOrigin.textContent = memory.origin || "来自社区公开映记";
  if (memoryStatusChip) {
    memoryStatusChip.textContent = getVisibilityLabel(memory.status || memory.visibility);
  }
  if (memoryTags) {
    memoryTags.replaceChildren(
      ...(memory.tags?.length ? memory.tags : ["未标记"]).map((tag) => {
        const item = document.createElement("span");
        item.textContent = tag;
        return item;
      }),
    );
  }
  memoryGallery.replaceChildren(
    ...photos.slice(0, 6).map((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${memory.title} 照片 ${index + 1}`;
      return image;
    }),
  );
}

function openMemoryDetail(memoryId = activeMemoryId, updateHash = true) {
  renderMemoryDetail(memoryId);
  activateScreen("memory-detail", `memory:${activeMemoryId}`, updateHash);
}

window.shanhaiOpenExternalMemory = function openExternalMemory(memory = {}) {
  const photos = Array.isArray(memory.photos) ? memory.photos.map((photo) => photo.url).filter(Boolean) : [];
  const route = Array.isArray(memory.route) ? memory.route.join(" -> ") : String(memory.route || "");
  renderExternalMemoryDetail({
    id: memory.id || "community-memory",
    title: memory.title || "未命名公开映记",
    location: memory.locationLabel || memory.city || memory.country || "公开映记",
    body: memory.body || "",
    photoCount: photos.length || 1,
    words: String(memory.body || "").length,
    cover: photos[0] || "assets/photo-ocean.svg",
    alt: memory.title || "公开映记照片",
    route,
    origin: memory.author?.name ? `来自 ${memory.author.name} 的公开映记` : "来自社区公开映记",
    tags: memory.tags || [],
    status: memory.status || memory.visibility || "public",
    visibility: memory.visibility || memory.status || "public",
    photos,
  });
  activateScreen("memory-detail", `public-memory:${memory.id || "community-memory"}`, false);
  window.dispatchEvent(new CustomEvent("shanhai:public-memory-opened", { detail: { memoryId: memory.id || "" } }));
};

window.addEventListener("shanhai:cloud-space-updated", (event) => {
  cloudSpaceMemories = Array.isArray(event.detail?.memories) ? event.detail.memories : [];
  renderProfileSpaceList("notes");
  renderProfileDashboardStats();
});

function renderSelectedPhotos() {
  const selected = getSelectedPhotoData();

  if (!selected.length) {
    const empty = document.createElement("span");
    empty.className = "selected-empty";
    empty.textContent = "至少选择一张照片生成档案";
    selectedPhotos.replaceChildren(empty);
    return;
  }

  selectedPhotos.replaceChildren(
    ...selected.map((photo, index) => {
      const card = document.createElement("article");
      const image = document.createElement("img");
      const copy = document.createElement("div");
      const title = document.createElement("h3");
      const meta = document.createElement("p");
      const order = document.createElement("div");
      const previous = document.createElement("button");
      const next = document.createElement("button");
      const remove = document.createElement("button");

      card.className = "selected-card";
      card.dataset.selectedPhotoCard = "";
      image.src = photo.src;
      image.alt = photo.alt;
      title.textContent = photo.place;
      meta.textContent = `${photo.time} · 第 ${index + 1} 张`;
      order.className = "photo-order";
      previous.type = "button";
      previous.textContent = "←";
      previous.dataset.selectedPhotoUp = "";
      previous.ariaLabel = `将 ${photo.place} 前移`;
      previous.title = "前移照片";
      previous.disabled = index === 0;
      previous.addEventListener("click", () => moveSelectedPhoto(photo.id, -1));
      next.type = "button";
      next.textContent = "→";
      next.dataset.selectedPhotoDown = "";
      next.ariaLabel = `将 ${photo.place} 后移`;
      next.title = "后移照片";
      next.disabled = index === selected.length - 1;
      next.addEventListener("click", () => moveSelectedPhoto(photo.id, 1));
      remove.type = "button";
      remove.textContent = "×";
      remove.dataset.selectedPhotoRemove = "";
      remove.ariaLabel = `移除 ${photo.place}`;
      remove.title = "移除照片";
      remove.addEventListener("click", () => removeSelectedPhoto(photo.id));

      order.append(previous, next, remove);
      copy.append(title, meta, order);
      card.append(image, copy);
      return card;
    }),
  );
}

function renderAutoTimeline() {
  const selected = getSelectedPhotoData();
  const items = selected.length
    ? selected
    : [{ time: "--", place: "等待照片", alt: "选择照片后自动生成路线" }];

  autoTimeline.replaceChildren(
    ...items.map((photo, index) => {
      const article = document.createElement("article");
      const time = document.createElement("time");
      const copy = document.createElement("div");
      const title = document.createElement("h3");
      const note = document.createElement("p");

      time.textContent = photo.time;
      title.textContent = photo.place;
      note.textContent =
        index === 0 ? "作为映记开场画面，自动绑定时间与地点。" : "继续串联为个人路线节点。";
      copy.append(title, note);
      article.append(time, copy);

      return article;
    }),
  );
}

function syncPhotoOptions() {
  photoOptions.forEach((option) => {
    const isSelected = selectedPhotoIds.includes(option.dataset.photoId);
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
}

function resetPosterDownload() {
  posterDownload.href = "#";
  posterDownload.textContent = "生成后可下载 PNG";
  posterDownload.setAttribute("aria-disabled", "true");
  posterDownload.classList.remove("is-ready");
}

function resetSaveState() {
  saveMemoryButton.textContent = "保存到我的档案";
  saveStatus.textContent = "";
}

function updatePosterPreview(isGenerated = false) {
  const selected = getSelectedPhotoData();
  const cover = selected[0] || getPhotoData(photoOptions[0]);
  const uniquePlaces = new Set(selected.map((photo) => photo.place));

  posterImage.src = cover.src;
  posterImage.alt = cover.alt;
  posterTitle.textContent = createTitle.value.trim() || "未命名映记";
  posterLocation.textContent = createLocation.value.trim() || "等待地点";
  posterBody.textContent = getBodyExcerpt() || "写下这一段回望后生成分享长图。";
  recapPreviewText.textContent = selected.length
    ? `${selected.length} 张照片 · ${uniquePlaces.size} 个地点 · ${isGenerated ? "分享长图已生成" : "可生成分享长图"}`
    : "选择照片后生成分享长图";
  sharePoster.classList.toggle("is-generated", isGenerated);

  if (!isGenerated) {
    resetPosterDownload();
  }
}

function syncCreateFlow(isGenerated = false) {
  syncPhotoOptions();
  renderSelectedPhotos();
  renderAutoTimeline();
  updatePosterPreview(isGenerated);

  if (!isGenerated) {
    resetSaveState();
  }
}

function selectPhotoAsset(event) {
  const photoId = event.currentTarget.dataset.photoId;
  const isSelected = selectedPhotoIds.includes(photoId);

  selectedPhotoIds = isSelected
    ? selectedPhotoIds.filter((id) => id !== photoId)
    : [...selectedPhotoIds, photoId];

  syncCreateFlow(false);
  updateCreateProgress();
  saveCreateDraft();
}

function createPhotoOption(photo) {
  const option = document.createElement("button");
  const image = document.createElement("img");
  const label = document.createElement("span");

  option.className = "photo-option";
  option.type = "button";
  option.dataset.photoOption = "";
  option.dataset.photoId = photo.id;
  option.dataset.photoPlace = photo.place;
  option.dataset.photoTime = photo.time;
  option.dataset.photoSrc = photo.src;
  image.src = photo.src;
  image.alt = photo.alt;
  label.textContent = photo.place;
  option.append(image, label);
  option.addEventListener("click", selectPhotoAsset);
  photoLibrary.append(option);
  photoOptions = [...photoOptions, option];
  return option;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

async function importLocalPhotos(event) {
  const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const photos = await Promise.all(
    files.map(async (file, index) => {
      const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "本地照片";
      return {
        id: `local-${Date.now()}-${index}`,
        place: name,
        time,
        src: await readFileAsDataUrl(file),
        alt: `${name} 旅行照片`,
      };
    }),
  );

  photos.forEach((photo) => {
    createPhotoOption(photo);
    selectedPhotoIds = [...selectedPhotoIds, photo.id];
  });

  event.target.value = "";
  syncCreateFlow(false);
  updateCreateProgress();
  saveCreateDraft();
}

function moveSelectedPhoto(photoId, direction) {
  const index = selectedPhotoIds.indexOf(photoId);
  const targetIndex = index + direction;

  if (index < 0 || targetIndex < 0 || targetIndex >= selectedPhotoIds.length) {
    return;
  }

  const nextIds = [...selectedPhotoIds];
  [nextIds[index], nextIds[targetIndex]] = [nextIds[targetIndex], nextIds[index]];
  selectedPhotoIds = nextIds;
  syncCreateFlow(false);
  saveCreateDraft();
}

function removeSelectedPhoto(photoId) {
  selectedPhotoIds = selectedPhotoIds.filter((id) => id !== photoId);
  syncCreateFlow(false);
  updateCreateProgress();
  saveCreateDraft();
}

function addSuggestedPhoto() {
  const nextOption = photoOptions.find((option) => !selectedPhotoIds.includes(option.dataset.photoId));

  if (nextOption) {
    selectedPhotoIds = [...selectedPhotoIds, nextOption.dataset.photoId];
  }

  syncCreateFlow(false);
  updateCreateProgress();
  saveCreateDraft();
}

function updateCreateProgress() {
  const values = Array.from(createForm.elements)
    .filter((field) => field.matches("input, textarea, select"))
    .map((field) => field.value.trim());
  const completed = values.filter(Boolean).length + (selectedPhotoIds.length ? 1 : 0);
  const activeIndex = Math.min(completed, stepItems.length - 1);

  stepItems.forEach((step, index) => {
    step.classList.toggle("is-active", index <= activeIndex);
  });

  renderCreateReadiness();
  syncCreateFlow(false);
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    if (/^https?:/.test(src)) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCover(ctx, image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  const cropX = (image.naturalWidth - cropWidth) / 2;
  const cropY = (image.naturalHeight - cropHeight) / 2;

  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, x, y, width, height);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const characters = Array.from(text);
  const lines = [];
  let line = "";

  characters.forEach((character) => {
    const nextLine = `${line}${character}`;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      lines.push(line);
      line = character;
    } else {
      line = nextLine;
    }
  });

  if (line) {
    lines.push(line);
  }

  lines.slice(0, maxLines).forEach((item, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? "..." : "";
    ctx.fillText(`${item}${suffix}`, x, y + index * lineHeight);
  });

  return y + Math.min(lines.length, maxLines) * lineHeight;
}

async function drawPosterToCanvas() {
  const ctx = posterCanvas.getContext("2d");
  const width = posterCanvas.width;
  const height = posterCanvas.height;
  const selected = getSelectedPhotoData();
  const cover = selected[0] || getPhotoData(photoOptions[0]);
  const title = createTitle.value.trim() || "未命名映记";
  const location = createLocation.value.trim() || "等待地点";
  const body = getBodyExcerpt() || "写下这一段回望后生成分享长图。";

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#080a0c";
  ctx.fillRect(0, 0, width, height);

  try {
    const image = await loadCanvasImage(cover.src);
    drawCover(ctx, image, 0, 0, width, 950);
  } catch {
    const gradient = ctx.createLinearGradient(0, 0, width, 950);
    gradient.addColorStop(0, "#1f6f6a");
    gradient.addColorStop(0.58, "#221d16");
    gradient.addColorStop(1, "#080a0c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 950);
  }

  const shade = ctx.createLinearGradient(0, 80, 0, 1180);
  shade.addColorStop(0, "rgba(8,10,12,0.08)");
  shade.addColorStop(0.62, "rgba(8,10,12,0.42)");
  shade.addColorStop(1, "#080a0c");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, width, 1180);

  ctx.strokeStyle = "rgba(214,181,109,0.76)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(108, 204);
  ctx.bezierCurveTo(286, 132, 430, 286, 584, 232);
  ctx.bezierCurveTo(744, 176, 826, 356, 960, 286);
  ctx.stroke();

  selected.slice(0, 4).forEach((photo, index) => {
    const x = 132 + index * 248;
    ctx.fillStyle = index === 0 ? "#ff7a5c" : "#d6b56d";
    ctx.beginPath();
    ctx.arc(x, 238 + Math.sin(index) * 42, 13, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(245,239,228,0.72)";
  ctx.font = "28px sans-serif";
  ctx.fillText("山海映记", 78, 104);
  ctx.fillText("PRIVATE TRAVEL ARCHIVE", 78, 145);

  ctx.fillStyle = "#f5efe4";
  ctx.font = "600 68px serif";
  wrapCanvasText(ctx, title, 78, 1058, 880, 82, 2);

  ctx.fillStyle = "rgba(214,181,109,0.92)";
  ctx.font = "30px sans-serif";
  ctx.fillText(location, 78, 910);

  ctx.fillStyle = "rgba(245,239,228,0.72)";
  ctx.font = "32px sans-serif";
  const nextY = wrapCanvasText(ctx, body, 78, 1238, 880, 50, 3);

  ctx.strokeStyle = "rgba(245,239,228,0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(78, nextY + 36);
  ctx.lineTo(1000, nextY + 36);
  ctx.stroke();

  ctx.fillStyle = "rgba(245,239,228,0.62)";
  ctx.font = "28px sans-serif";
  const timelineY = nextY + 96;
  (selected.length ? selected : [cover]).slice(0, 4).forEach((photo, index) => {
    const y = timelineY + index * 58;
    ctx.fillStyle = "rgba(214,181,109,0.86)";
    ctx.fillText(photo.time, 78, y);
    ctx.fillStyle = "rgba(245,239,228,0.74)";
    ctx.fillText(photo.place, 210, y);
  });

  ctx.fillStyle = "rgba(245,239,228,0.48)";
  ctx.font = "24px sans-serif";
  ctx.fillText(`${selected.length || 1} 张照片 · ${new Set(selected.map((photo) => photo.place)).size || 1} 个地点 · 由山海映记生成`, 78, 1596);

  return posterCanvas.toDataURL("image/png");
}

function buildCreatedMemory() {
  const selected = getSelectedPhotoData();
  const cover = selected[0] || getPhotoData(photoOptions[0]);
  const body = createBody.value.trim() || "写下这一段回望后生成分享长图。";
  const location = createLocation.value.trim() || "未标记地点";
  const { country, city } = inferLocationParts(location);
  const dateValue = createDate?.value || "";
  const route = createRoute?.value.trim() || selected.map((photo) => photo.place).join(" -> ") || location;
  const status = createVisibility?.value || "private";
  const inputTags = parseTagInput(createTags?.value || "");
  const fallbackTags = [country, city].filter((tag) => tag && tag !== "未标记地点");

  return memoryDomain.createMemory({
    title: createTitle.value.trim() || "未命名映记",
    location,
    country,
    city,
    year: dateValue ? dateValue.slice(0, 4) : "2026",
    source: "saved",
    status,
    visibility: status,
    date: dateValue,
    dateLabel: dateValue ? dateValue.slice(5).replace("-", ".") : "今天",
    body,
    photoCount: Math.max(selected.length, 1),
    words: body.length,
    cover: cover.src,
    alt: cover.alt,
    route,
    origin: "来自刚保存的映记",
    tags: inputTags.length ? inputTags : fallbackTags,
    photos: (selected.length ? selected : [cover]).map((photo) => photo.src),
  });
}

async function syncCreatedMemoryToCloud(memory) {
  const api = window.shanhaiApi;
  const canUseApi = api?.getToken?.() && window.location.protocol.startsWith("http");

  if (!canUseApi) {
    return { ok: false, skipped: true };
  }

  try {
    const payload = await api.createMemory({
      title: memory.title,
      body: memory.body,
      locationLabel: memory.location,
      occurredAt: memory.date || "",
      route: String(memory.route || "")
        .split(/\s*->\s*|、|，|,/)
        .map((item) => item.trim())
        .filter(Boolean),
      status: memory.status || "private",
      tags: memory.tags || [],
    });
    const uploadablePhotos = getSelectedPhotoData().filter((photo) => /^data:image\/(png|jpeg|webp|gif);base64,/.test(photo.src));
    let uploadedCount = 0;
    for (const photo of uploadablePhotos.slice(0, 6)) {
      const mimeType = photo.src.match(/^data:([^;]+);base64,/)?.[1] || "image/png";
      await api.uploadPhoto(payload.memory.id, {
        fileName: `${photo.place || "create-photo"}.${mimeType.split("/")[1] || "png"}`,
        mimeType,
        dataUrl: photo.src,
        alt: photo.alt || memory.title,
      });
      uploadedCount += 1;
    }
    return { ok: true, uploadedCount };
  } catch (error) {
    return { ok: false, error: error?.message || "云端同步失败" };
  }
}

async function saveCreatedMemory() {
  const memory = buildCreatedMemory();

  savedMemories = [memory, ...savedMemories].slice(0, 12);

  try {
    const result = persistSavedMemories();
    if (!result.ok) {
      throw new Error(result.error);
    }
    renderPersonalArchive();
    renderArchiveLibrary();
    renderProfileSpaceList("notes");
    clearCreateDraft();
    saveMemoryButton.textContent = "已保存到我的档案";
    saveStatus.textContent = `已保存为${getVisibilityLabel(memory.status)}映记，并同步首页、档案和个人空间。`;
    const cloudResult = await syncCreatedMemoryToCloud(memory);
    if (cloudResult.ok) {
      const photoCopy = cloudResult.uploadedCount ? `，含 ${cloudResult.uploadedCount} 张照片` : "";
      saveStatus.textContent = `已保存为${getVisibilityLabel(memory.status)}映记，并同步到云端与社区发现${photoCopy}。`;
      window.dispatchEvent(new CustomEvent("shanhai:cloud-memory-updated"));
    } else if (cloudResult.error) {
      saveStatus.textContent = `本地已保存，云端同步失败：${cloudResult.error}`;
    }
  } catch {
    savedMemories = savedMemories.filter((item) => item.id !== memory.id);
    saveStatus.textContent = "本机存储空间不足，暂时无法保存这篇映记。";
  }
}

async function generateSharePoster() {
  const originalText = generateButton.textContent;

  generateButton.disabled = true;
  generateButton.textContent = "生成中";
  stepItems.forEach((step) => step.classList.add("is-active"));

  try {
    const posterUrl = await drawPosterToCanvas();
    posterDownload.href = posterUrl;
    posterDownload.textContent = "下载 PNG 长图";
    posterDownload.setAttribute("aria-disabled", "false");
    posterDownload.classList.add("is-ready");
    syncCreateFlow(true);
  } catch {
    recapPreviewText.textContent = "图片权限受限，已保留页面预览";
    sharePoster.classList.add("is-generated");
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = originalText;
  }
}

function filterReviews() {
  const query = destinationSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  reviewCards.forEach((card) => {
    const keywords = `${card.dataset.keywords || ""} ${card.textContent}`.toLowerCase();
    const types = (card.dataset.type || "").split(" ");
    const matchesQuery = !query || keywords.includes(query);
    const matchesFilter = activeReviewFilter === "all" || types.includes(activeReviewFilter);
    const isVisible = matchesQuery && matchesFilter;

    card.classList.toggle("is-hidden", !isVisible);
    visibleCount += isVisible ? 1 : 0;
  });

  reviewEmpty.hidden = visibleCount > 0;
}

function renderList(container, items) {
  container.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
}

function renderDimensions(items) {
  destinationDimensions.replaceChildren(
    ...items.map(([label, value]) => {
      const article = document.createElement("article");
      const span = document.createElement("span");
      const strong = document.createElement("strong");

      article.style.setProperty("--value", `${Math.min(Math.max(value, 0), 100)}%`);
      span.textContent = label;
      strong.textContent = String(value);
      article.append(span, strong);

      return article;
    }),
  );
}

function renderComments(items) {
  destinationComments.replaceChildren(
    ...items.map(([author, text]) => {
      const article = document.createElement("article");
      const strong = document.createElement("strong");
      const paragraph = document.createElement("p");

      strong.textContent = author;
      paragraph.textContent = text;
      article.append(strong, paragraph);

      return article;
    }),
  );
}

function renderPlanDraft(data) {
  const isPlanned = hasState("plans");

  planStatus.textContent = isPlanned ? "已保存到计划" : "未保存";
  planTitle.textContent = `${data.title} · 旅行计划`;
  planDuration.textContent = data.duration;
  planSeason.textContent = data.season;
  planCrowd.textContent = data.crowd;
  planRoute.textContent = data.route;
  planSave.textContent = isPlanned ? "已保存，继续编辑" : "保存到旅行计划";
}

function syncDestinationActions() {
  const data = destinationData[activeDestinationId];
  const isWanted = hasState("wants");
  const isPlanned = hasState("plans");

  wantAction.textContent = isWanted ? "已加入想去" : "加入想去";
  wantAction.classList.toggle("is-saved", isWanted);
  wantAction.setAttribute("aria-pressed", String(isWanted));
  planAction.textContent = isPlanned ? "查看计划" : "创建计划";
  planAction.classList.toggle("is-saved", isPlanned);
  planAction.setAttribute("aria-pressed", String(isPlanned));
  renderPlanDraft(data);
}

function renderDestination(destinationId) {
  const data = destinationData[destinationId] || destinationData.kiyomizu;
  activeDestinationId = destinationData[destinationId] ? destinationId : "kiyomizu";

  destinationTitle.textContent = data.title;
  destinationLocation.textContent = data.location;
  destinationScore.textContent = data.score;
  destinationRecommend.textContent = data.recommend;
  destinationSummary.textContent = data.summary;
  destinationImage.src = data.image;
  destinationImage.alt = data.imageAlt;
  destinationSeason.textContent = data.season;
  destinationDuration.textContent = data.duration;
  destinationCost.textContent = data.cost;
  destinationCrowd.textContent = data.crowd;
  destinationVerdict.textContent = data.verdict;
  destinationFit.textContent = data.fit;
  destinationMemory.textContent = data.memory;
  destinationMemoryNote.textContent = data.memoryNote;
  destinationRoute.textContent = data.route;

  renderList(destinationPros, data.pros);
  renderList(destinationCons, data.cons);
  renderDimensions(data.dimensions);
  renderComments(data.comments);
  syncDestinationActions();
  planPanel.hidden = true;
  actionFeedback.textContent = "";
}

function openDestination(destinationId = activeDestinationId, updateHash = true) {
  renderDestination(destinationId);
  activateScreen("destination", `destination:${activeDestinationId}`, updateHash);
}

function toggleWantToGo() {
  const data = destinationData[activeDestinationId];
  const isWanted = toggleState("wants");

  syncDestinationActions();
  actionFeedback.textContent = isWanted
    ? `${data.title} 已加入想去清单。`
    : `${data.title} 已从想去清单移除。`;
}

function openPlanDraft() {
  const data = destinationData[activeDestinationId];

  renderPlanDraft(data);
  planPanel.hidden = false;
  actionFeedback.textContent = `已根据 ${data.title} 生成计划草稿。`;
  planPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function savePlanDraft() {
  const data = destinationData[activeDestinationId];

  if (!hasState("plans")) {
    toggleState("plans");
  }

  renderPlanDraft(data);
  actionFeedback.textContent = `${data.title} 已保存到旅行计划。`;
}

function openMemoryLink() {
  activateMode("diary");
  activateScreen("record");
}

function handleHashRoute() {
  const hash = window.location.hash.slice(1);

  if (hash.startsWith("destination:")) {
    openDestination(hash.split(":")[1], false);
    return;
  }

  if (hash.startsWith("memory:")) {
    openMemoryDetail(hash.split(":")[1], false);
    return;
  }

  if (hash === "archive") {
    openArchiveLibrary(false);
    return;
  }

  activateScreen(hash || "record", hash || "record", false);
}

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateMode(tab.dataset.mode));
});

openMapBrowseButton?.addEventListener("click", () => openRecordBrowse("map"));
openDiaryBrowseButton?.addEventListener("click", () => openRecordBrowse("diary"));
recordBrowseClose?.addEventListener("click", () => {
  recordBrowsePanel.hidden = true;
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => activateScreen(button.dataset.target));
});

recordNextAction?.addEventListener("click", () => activateScreen("create"));
profileShortcut.addEventListener("click", () => activateScreen("profile"));
openArchiveButton.addEventListener("click", () => openArchiveLibrary());
archiveBack.addEventListener("click", () => activateScreen("record"));
archiveSearch.addEventListener("input", renderArchiveLibrary);
archiveFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeArchiveFilter = button.dataset.archiveFilter;
    renderArchiveLibrary();
  });
});
exportArchiveButton.addEventListener("click", exportArchive);
importArchiveButton.addEventListener("click", () => importArchiveInput.click());
importArchiveInput.addEventListener("change", importArchiveFile);
editPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  saveEditedMemory();
});
editCancel.addEventListener("click", closeEditPanel);

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
createForm.addEventListener("input", () => {
  updateCreateProgress();
  saveCreateDraft();
});
createForm.addEventListener("change", () => {
  updateCreateProgress();
  saveCreateDraft();
});
photoOptions.forEach((option) => {
  option.addEventListener("click", selectPhotoAsset);
});
importPhotoButton.addEventListener("click", () => photoInput.click());
photoInput.addEventListener("change", importLocalPhotos);
addPhotoButton.addEventListener("click", addSuggestedPhoto);

generateButton.addEventListener("click", generateSharePoster);
saveMemoryButton.addEventListener("click", saveCreatedMemory);

reviewFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    activeReviewFilter = filter.dataset.reviewFilter;
    reviewFilters.forEach((item) => item.classList.toggle("is-active", item === filter));
    filterReviews();
  });
});

destinationSearch.addEventListener("input", filterReviews);
destinationSearchButton.addEventListener("click", filterReviews);
communityTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchCommunityTab(tab.dataset.communityTab));
});
communityCityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchCommunityTab("reviews");
    destinationSearch.value = button.dataset.cityQuery;
    filterReviews();
  });
});

searchShortcut?.addEventListener("click", () => {
  activateScreen("community");
  window.setTimeout(() => destinationSearch.focus(), 120);
});

reviewCards.forEach((card) => {
  card.addEventListener("click", () => openDestination(card.dataset.destinationId));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDestination(card.dataset.destinationId);
    }
  });
});

destinationBack.addEventListener("click", () => activateScreen("community"));
memoryBack.addEventListener("click", () => activateScreen("record"));
wantAction.addEventListener("click", toggleWantToGo);
planAction.addEventListener("click", openPlanDraft);
planClose.addEventListener("click", () => {
  planPanel.hidden = true;
  actionFeedback.textContent = "";
});
planSave.addEventListener("click", savePlanDraft);
memoryAction.addEventListener("click", openMemoryLink);
conversationList?.addEventListener("click", (event) => {
  const item = event.target.closest("[data-conversation-item]");
  if (item && conversationList.contains(item)) {
    openConversation(item.dataset.conversationItem);
  }
});
directMessageStart?.addEventListener("click", startDirectConversation);
directMessageUsername?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    startDirectConversation();
  }
});
conversationSend?.addEventListener("click", sendConversationReply);
conversationInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendConversationReply();
  }
});
window.addEventListener("shanhai:auth-changed", () => {
  syncConversationsFromCloud();
});
profileActionButtons.forEach((button) => {
  button.addEventListener("click", handleProfileAction);
});
profileAvatarEdit?.addEventListener("click", () => openProfileSpace());
profileSpaceEntryButtons.forEach((button) => {
  button.addEventListener("click", () => openProfileSpace(button.dataset.profileSpaceFocus || "notes"));
});
profileSpaceBack?.addEventListener("click", () => activateScreen("profile"));
profileSpaceEditButtons.forEach((button) => {
  button.addEventListener("click", openProfileEditPanel);
});
profileSpaceTabs.forEach((button) => {
  button.addEventListener("click", () => activateProfileSpaceTab(button.dataset.profileSpaceTab));
});
profileEditClose?.addEventListener("click", closeProfileEditPanel);
profileAvatarInput?.addEventListener("change", previewProfileAvatar);

window.addEventListener("resize", sizeCanvas);
window.addEventListener("hashchange", handleHashRoute);
window.addEventListener("load", () => {
  sizeCanvas();
  renderPersonalArchive();
  renderProfileSpaceList("notes");
  restoreCreateDraft();
  updateCreateProgress();
  filterReviews();
  renderConversationList();
  syncConversationsFromCloud();
  renderDestination(activeDestinationId);
  handleHashRoute();
  startSplash();
});
