const splash = document.querySelector("#splash");
const canvas = document.querySelector("#splashCanvas");
const ctx = canvas.getContext("2d");
const modeTabs = document.querySelectorAll(".mode-tab");
const mapView = document.querySelector("#mapView");
const diaryView = document.querySelector("#diaryView");
const navButtons = document.querySelectorAll(".nav-button");
const screens = document.querySelectorAll(".screen");
const profileShortcut = document.querySelector("[data-open-profile]");
const createForm = document.querySelector(".create-form");
const createTitle = document.querySelector("[data-create-title]");
const createLocation = document.querySelector("[data-create-location]");
const createBody = document.querySelector("[data-create-body]");
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
const openArchiveButton = document.querySelector("[data-open-archive]");
const archiveBack = document.querySelector("[data-archive-back]");
const archiveSearch = document.querySelector("[data-archive-search]");
const archiveFilters = document.querySelectorAll("[data-archive-filter]");
const archiveList = document.querySelector("[data-archive-list]");
const archiveEmpty = document.querySelector("[data-archive-empty]");
const archiveCount = document.querySelector("[data-archive-count]");
const searchShortcut = document.querySelector(".search-button");
const destinationSearch = document.querySelector(".review-search input");
const destinationSearchButton = document.querySelector(".review-search button");
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

const particlePalette = [
  "rgba(214, 181, 109, 0.9)",
  "rgba(255, 122, 92, 0.82)",
  "rgba(111, 200, 189, 0.8)",
  "rgba(245, 239, 228, 0.62)",
];

const destinationData = {
  kiyomizu: {
    title: "清水寺与二年坂",
    location: "日本 · 京都 · 东山",
    score: "4.8",
    recommend: "89% 推荐 · 2,846 条点评",
    summary: "适合第一次来京都的人，把古寺、坡道、街巷和日落放在同一段行程里。",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=84",
    imageAlt: "清水寺与二年坂照片",
    season: "3-4 月 / 11 月",
    duration: "2.5-4 小时",
    cost: "门票低 · 周边中",
    crowd: "10:30-15:30",
    verdict: "值得专程去，但要避开主流时段。",
    fit: "适合摄影、第一次到访、短途城市漫游；不适合完全讨厌人流的人。",
    pros: ["京都代表性画面密度高，照片和文字都容易成章。", "清水寺、二年坂、三年坂可以串成半日路线。", "日落前后的光线层次最完整。"],
    cons: ["热门时段人流很密，主坡道拍摄体验下降。", "坡道多，雨天和拖行李不友好。", "周边消费和排队会被季节放大。"],
    dimensions: [
      ["出片指数", 96],
      ["文化体验", 88],
      ["拥挤压力", 72],
      ["交通便利", 78],
    ],
    memory: "你在这里有 1 篇映记",
    memoryNote: "雨后的清水寺 · 12 张照片 · 1,240 字",
    route: "清水寺 -> 二年坂 -> 三年坂 -> 八坂神社，步行约 38 分钟。",
    comments: [
      ["林澈", "早上七点半到，坡道还很安静，雨后石板路很漂亮。十点之后体验明显下降。"],
      ["南山", "值得去，但不要只打卡寺门。二年坂往下走的街巷更适合慢慢记录。"],
      ["Mika", "带长辈走会有点累，建议把咖啡休息点提前标好。"],
    ],
  },
  philosopher: {
    title: "哲学之道",
    location: "日本 · 京都 · 左京区",
    score: "4.6",
    recommend: "84% 推荐 · 1,392 条点评",
    summary: "更适合慢走、写日记和看季节变化，不是强打卡型景点。",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=84",
    imageAlt: "哲学之道樱花步道照片",
    season: "3 月底-4 月初",
    duration: "1.5-3 小时",
    cost: "免费 · 咖啡中",
    crowd: "樱花季 9:30 后",
    verdict: "适合慢游，不适合赶行程。",
    fit: "适合独行、情侣、写作和轻摄影；如果只想看强地标，优先级可以降低。",
    pros: ["步道节奏舒缓，适合把旅行情绪写下来。", "樱花季画面完整，水渠和街巷有层次。", "相对热门寺社更容易找到安静片段。"],
    cons: ["餐饮和洗手间密度不高，需要提前安排。", "非花季的视觉冲击会降低。", "附近点位分散，临时规划容易多走路。"],
    dimensions: [
      ["安静程度", 91],
      ["季节氛围", 88],
      ["补给便利", 58],
      ["路线舒适", 82],
    ],
    memory: "你还没有在这里写过映记",
    memoryNote: "适合加入春季京都计划。",
    route: "银阁寺 -> 哲学之道 -> 南禅寺，步行约 52 分钟。",
    comments: [
      ["小野", "樱花季早上很好，下午人会变多但没有清水寺那种压迫感。"],
      ["叶舟", "适合散步，不适合赶时间。沿路小店少，水最好自己带。"],
      ["Aki", "一个人走很舒服，照片不是最震撼，但很容易留下记忆。"],
    ],
  },
  reynisfjara: {
    title: "冰岛黑沙滩",
    location: "冰岛 · 维克镇 · Reynisfjara",
    score: "4.5",
    recommend: "81% 推荐 · 936 条点评",
    summary: "自然冲击力很强，但体验高度依赖天气、风浪和安全距离。",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=900&q=84",
    imageAlt: "冰岛黑沙滩海岸照片",
    season: "全年 · 夏季更稳",
    duration: "45-90 分钟",
    cost: "免费 · 停车中",
    crowd: "旅行团抵达时段",
    verdict: "值得去，但必须把安全放在体验前面。",
    fit: "适合自然景观、摄影和公路旅行；不适合天气恶劣时强行停留。",
    pros: ["黑沙、海蚀柱和浪线组合很有辨识度。", "短时间内就能获得强烈现场感。", "适合接入南岸自驾路线。"],
    cons: ["风浪变化快，靠近海水有风险。", "天气差时停留体验会明显下降。", "公共设施有限，冬季体感很冷。"],
    dimensions: [
      ["自然震撼", 94],
      ["安全压力", 82],
      ["出片指数", 86],
      ["停留舒适", 61],
    ],
    memory: "你在附近有 1 篇映记",
    memoryNote: "冰岛环岛第 3 天 · 9 张照片 · 860 字",
    route: "维克镇 -> 黑沙滩 -> Dyrholaey 灯塔，驾车约 32 分钟。",
    comments: [
      ["Haru", "现场很震撼，但风真的大。不要背对海浪拍照。"],
      ["Blue", "天气好会非常出片，阴雨时就更像一种荒凉体验。"],
      ["陈予", "建议不要把这里塞在日落后，路况和风浪都不适合赶。"],
    ],
  },
};

let particles = [];
let animationFrame = 0;
let startTime = performance.now();
let activeReviewFilter = "all";
let activeArchiveFilter = "all";
let activeDestinationId = "kiyomizu";
let activeMemoryId = "seed-kyoto";
let selectedPhotoIds = Array.from(photoOptions)
  .filter((option) => option.classList.contains("is-selected"))
  .map((option) => option.dataset.photoId);
const destinationStorageKey = "shanhai-destination-state";
const memoryStorageKey = "shanhai-memory-entries";
const baseArchiveStats = {
  memories: 28,
  cities: 12,
};
const seedMemories = [
  {
    id: "seed-kyoto",
    title: "京都 · 雨后的清水寺",
    location: "日本京都",
    country: "日本",
    city: "京都",
    year: "2026",
    source: "seed",
    dateLabel: "04.12",
    body: "石板路还在反光，风里有樱花落下来的声音。",
    photoCount: 12,
    words: 1240,
    cover: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=420&q=82",
    alt: "京都街景照片",
    route: "清水寺 -> 二年坂 -> 八坂神社",
    origin: "来自最近映记",
    photos: [
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=360&q=82",
      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=360&q=82",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=360&q=82",
    ],
  },
  {
    id: "seed-iceland",
    title: "冰岛环岛第 3 天",
    location: "冰岛",
    country: "冰岛",
    city: "维克",
    year: "2026",
    source: "seed",
    dateLabel: "03.28",
    body: "黑沙滩、海风和一场迟到的日落。",
    photoCount: 9,
    words: 860,
    cover: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=420&q=82",
    alt: "冰岛山脉照片",
    route: "维克镇 -> 黑沙滩 -> Dyrholaey 灯塔",
    origin: "来自最近映记",
    photos: [
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=360&q=82",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=360&q=82",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=360&q=82",
    ],
  },
];
let destinationState = loadDestinationState();
let savedMemories = loadSavedMemories();

function loadDestinationState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(destinationStorageKey));
    return {
      wants: Array.isArray(parsed?.wants) ? parsed.wants : [],
      plans: Array.isArray(parsed?.plans) ? parsed.plans : [],
    };
  } catch {
    return { wants: [], plans: [] };
  }
}

function loadSavedMemories() {
  try {
    const parsed = JSON.parse(localStorage.getItem(memoryStorageKey));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSavedMemories() {
  localStorage.setItem(memoryStorageKey, JSON.stringify(savedMemories));
}

function saveDestinationState() {
  try {
    localStorage.setItem(destinationStorageKey, JSON.stringify(destinationState));
  } catch {
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
    nextTarget === "destination" ? "community" : nextTarget === "memory-detail" || nextTarget === "archive" ? "record" : nextTarget;
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

  memoryRow.replaceChildren(...entries.slice(0, 4).map(renderMemoryCard));
  diaryTimeline.replaceChildren(...entries.slice(0, 3).map(renderDiaryEntry), renderContinueEntry());
  summaryMemory.textContent = `${baseArchiveStats.memories + savedMemories.length} 篇映记`;
  summaryCity.textContent = `${baseArchiveStats.cities + savedCities.size} 座城市`;
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
  return [memory.title, memory.location, memory.country, memory.city, memory.body, memory.route]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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

  if (activeArchiveFilter === "saved") {
    return memory.source === "saved" || memory.id.startsWith("memory-");
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

  article.dataset.memoryId = memory.id;
  article.setAttribute("role", "button");
  article.tabIndex = 0;
  image.src = memory.cover;
  image.alt = memory.alt || `${memory.title} 照片`;
  label.textContent = `${memory.year || "2026"} · ${getMemoryCountry(memory)} · ${memory.photoCount} 张照片`;
  title.textContent = memory.title;
  body.textContent = memory.body;
  copy.append(label, title, body);
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

      card.className = "selected-card";
      image.src = photo.src;
      image.alt = photo.alt;
      title.textContent = photo.place;
      meta.textContent = `${photo.time} · 第 ${index + 1} 张`;
      order.className = "photo-order";
      previous.type = "button";
      previous.textContent = "前";
      previous.disabled = index === 0;
      previous.addEventListener("click", () => moveSelectedPhoto(photo.id, -1));
      next.type = "button";
      next.textContent = "后";
      next.disabled = index === selected.length - 1;
      next.addEventListener("click", () => moveSelectedPhoto(photo.id, 1));

      order.append(previous, next);
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
}

function addSuggestedPhoto() {
  const nextOption = photoOptions.find((option) => !selectedPhotoIds.includes(option.dataset.photoId));

  if (nextOption) {
    selectedPhotoIds = [...selectedPhotoIds, nextOption.dataset.photoId];
  }

  syncCreateFlow(false);
  updateCreateProgress();
}

function updateCreateProgress() {
  const values = Array.from(createForm.elements)
    .filter((field) => field.matches("input, textarea"))
    .map((field) => field.value.trim());
  const completed = values.filter(Boolean).length + (selectedPhotoIds.length ? 1 : 0);
  const activeIndex = Math.min(completed, stepItems.length - 1);

  stepItems.forEach((step, index) => {
    step.classList.toggle("is-active", index <= activeIndex);
  });

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
  const country = location.includes("日本") ? "日本" : location.includes("冰岛") ? "冰岛" : "未标记";
  const city = location.replace(/\d{4}\.\d{2}\.\d{2}\s*·\s*/, "").replace(country, "").trim() || location;

  return {
    id: `memory-${Date.now()}`,
    title: createTitle.value.trim() || "未命名映记",
    location,
    country,
    city,
    year: "2026",
    source: "saved",
    dateLabel: "今天",
    body,
    photoCount: Math.max(selected.length, 1),
    words: body.length,
    cover: cover.src,
    alt: cover.alt,
    route: selected.map((photo) => photo.place).join(" -> ") || location,
    origin: "来自刚保存的映记",
    photos: (selected.length ? selected : [cover]).map((photo) => photo.src),
  };
}

function saveCreatedMemory() {
  const memory = buildCreatedMemory();

  savedMemories = [memory, ...savedMemories].slice(0, 12);

  try {
    persistSavedMemories();
    renderPersonalArchive();
    renderArchiveLibrary();
    saveMemoryButton.textContent = "已保存到我的档案";
    saveStatus.textContent = "已写入首页最近映记，并同步年度档案统计。";
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

navButtons.forEach((button) => {
  button.addEventListener("click", () => activateScreen(button.dataset.target));
});

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

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
});
createForm.addEventListener("input", updateCreateProgress);
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

searchShortcut.addEventListener("click", () => {
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

window.addEventListener("resize", sizeCanvas);
window.addEventListener("hashchange", handleHashRoute);
window.addEventListener("load", () => {
  sizeCanvas();
  renderPersonalArchive();
  updateCreateProgress();
  filterReviews();
  renderDestination(activeDestinationId);
  handleHashRoute();
  startSplash();
});
