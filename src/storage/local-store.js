(function () {
  const destinationStorageKey = "shanhai-destination-state";
  const memoryStorageKey = "shanhai-memory-entries";

  function getStorage(storage) {
    return storage || window.localStorage;
  }

  function loadDestinationState(storage) {
    try {
      const parsed = JSON.parse(getStorage(storage).getItem(destinationStorageKey));
      return {
        wants: Array.isArray(parsed?.wants) ? parsed.wants : [],
        plans: Array.isArray(parsed?.plans) ? parsed.plans : [],
      };
    } catch {
      return { wants: [], plans: [] };
    }
  }

  function saveDestinationState(destinationState, storage) {
    try {
      getStorage(storage).setItem(destinationStorageKey, JSON.stringify(destinationState));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || "storage unavailable" };
    }
  }

  function loadSavedMemories(storage) {
    try {
      const parsed = JSON.parse(getStorage(storage).getItem(memoryStorageKey));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function persistSavedMemories(memories, storage) {
    try {
      getStorage(storage).setItem(memoryStorageKey, JSON.stringify(memories));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || "storage unavailable" };
    }
  }

  window.shanhaiLocalStore = {
    loadDestinationState,
    saveDestinationState,
    loadSavedMemories,
    persistSavedMemories,
  };
})();
