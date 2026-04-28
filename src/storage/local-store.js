(function () {
  const archiveStorageKey = "shanhai-archive";
  const createDraftStorageKey = "shanhai-create-draft";
  const destinationStorageKey = "shanhai-destination-state";
  const memoryStorageKey = "shanhai-memory-entries";
  const memoryDomain = window.shanhaiMemoryDomain;

  function getStorage(storage) {
    return storage || window.localStorage;
  }

  function readJson(storage, key) {
    try {
      const value = getStorage(storage).getItem(key);
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  }

  function readArchive(storage) {
    const archive = readJson(storage, archiveStorageKey);
    if (archive) {
      return memoryDomain.normalizeArchive(archive);
    }

    return memoryDomain.normalizeArchive({
      memories: readJson(storage, memoryStorageKey),
      destinationState: readJson(storage, destinationStorageKey),
    });
  }

  function writeArchive(archive, storage) {
    try {
      getStorage(storage).setItem(archiveStorageKey, JSON.stringify(memoryDomain.normalizeArchive(archive)));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || "storage unavailable" };
    }
  }

  function loadDestinationState(storage) {
    return readArchive(storage).destinationState;
  }

  function loadArchive(storage) {
    return readArchive(storage);
  }

  function saveDestinationState(destinationState, storage) {
    const archive = readArchive(storage);
    return writeArchive({ ...archive, destinationState }, storage);
  }

  function loadSavedMemories(storage) {
    return readArchive(storage).memories;
  }

  function persistSavedMemories(memories, storage) {
    const archive = readArchive(storage);
    return writeArchive({ ...archive, memories }, storage);
  }

  function persistArchive(archive, storage) {
    return writeArchive(archive, storage);
  }

  function loadCreateDraft(storage) {
    return readJson(storage, createDraftStorageKey) || null;
  }

  function saveCreateDraft(draft, storage) {
    try {
      getStorage(storage).setItem(createDraftStorageKey, JSON.stringify(draft));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || "storage unavailable" };
    }
  }

  function clearCreateDraft(storage) {
    try {
      getStorage(storage).removeItem(createDraftStorageKey);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || "storage unavailable" };
    }
  }

  window.shanhaiLocalStore = {
    loadArchive,
    persistArchive,
    loadCreateDraft,
    saveCreateDraft,
    clearCreateDraft,
    loadDestinationState,
    saveDestinationState,
    loadSavedMemories,
    persistSavedMemories,
  };
})();
