(function () {
  const memoryDomain = window.shanhaiMemoryDomain;

  function buildArchiveExport(archive) {
    return JSON.stringify(memoryDomain.normalizeArchive(archive), null, 2);
  }

  function parseArchiveImport(text) {
    try {
      return { ok: true, archive: memoryDomain.normalizeArchive(JSON.parse(text)) };
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }

  function mergeUnique(left = [], right = []) {
    const seen = new Set();
    return [...left, ...right].filter((memory) => {
      if (!memory.id || seen.has(memory.id)) {
        return false;
      }

      seen.add(memory.id);
      return true;
    });
  }

  function mergeValues(left = [], right = []) {
    return Array.from(new Set([...left, ...right]));
  }

  function mergeArchive(current, incoming) {
    const normalizedCurrent = memoryDomain.normalizeArchive(current);
    const normalizedIncoming = memoryDomain.normalizeArchive(incoming);

    return memoryDomain.normalizeArchive({
      memories: mergeUnique(normalizedCurrent.memories, normalizedIncoming.memories),
      destinationState: {
        wants: mergeValues(normalizedCurrent.destinationState.wants, normalizedIncoming.destinationState.wants),
        plans: mergeValues(normalizedCurrent.destinationState.plans, normalizedIncoming.destinationState.plans),
      },
    });
  }

  window.shanhaiArchiveTransfer = {
    buildArchiveExport,
    parseArchiveImport,
    mergeArchive,
  };
})();
