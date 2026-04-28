(function () {
  const archiveVersion = 1;

  function defaultTimestamp() {
    return new Date().toISOString();
  }

  function normalizeDestinationState(destinationState = {}) {
    return {
      wants: Array.isArray(destinationState.wants) ? destinationState.wants : [],
      plans: Array.isArray(destinationState.plans) ? destinationState.plans : [],
    };
  }

  function normalizeMemory(memory = {}, now = defaultTimestamp()) {
    const createdAt = memory.createdAt || now;

    return {
      ...memory,
      id: memory.id || `memory-${Date.parse(now) || Date.now()}`,
      title: memory.title || "未命名映记",
      tags: Array.isArray(memory.tags) ? memory.tags : [],
      favorite: Boolean(memory.favorite),
      createdAt,
      updatedAt: memory.updatedAt || createdAt,
    };
  }

  function createMemory(memory = {}, now = defaultTimestamp()) {
    return normalizeMemory(
      {
        ...memory,
        id: memory.id || `memory-${Date.parse(now) || Date.now()}`,
        createdAt: memory.createdAt || now,
        updatedAt: memory.updatedAt || now,
      },
      now
    );
  }

  function normalizeArchive(payload = {}, now = defaultTimestamp()) {
    const archive = Array.isArray(payload)
      ? { memories: payload }
      : payload && typeof payload === "object"
        ? payload
        : {};

    return {
      version: archiveVersion,
      memories: Array.isArray(archive.memories) ? archive.memories.map((memory) => normalizeMemory(memory, now)) : [],
      destinationState: normalizeDestinationState(archive.destinationState),
    };
  }

  window.shanhaiMemoryDomain = {
    createMemory,
    normalizeMemory,
    normalizeArchive,
  };
})();
