import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const storagePath = "src/storage/local-store.js";
assert.equal(existsSync(storagePath), true, "local storage adapter should live in src/storage");

const storageCode = readFileSync(storagePath, "utf8");
const main = readFileSync("src/main.js", "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(storageCode, context, { filename: storagePath });

const store = context.window.shanhaiLocalStore;

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

assert.equal(typeof store.loadDestinationState, "function", "store should expose destination state loading");
assert.equal(typeof store.saveDestinationState, "function", "store should expose destination state saving");
assert.equal(typeof store.loadSavedMemories, "function", "store should expose memory loading");
assert.equal(typeof store.persistSavedMemories, "function", "store should expose memory saving");

function fakeStorage(initial = {}) {
  const values = new Map(Object.entries(initial));

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    dump() {
      return Object.fromEntries(values);
    },
  };
}

assert.deepEqual(plain(store.loadDestinationState(fakeStorage())), { wants: [], plans: [] }, "missing destination state should load defaults");
assert.deepEqual(
  plain(store.loadDestinationState(fakeStorage({ "shanhai-destination-state": JSON.stringify({ wants: ["kiyomizu"], plans: ["philosopher"] }) }))),
  { wants: ["kiyomizu"], plans: ["philosopher"] },
  "stored destination state should round-trip"
);
assert.deepEqual(
  plain(store.loadDestinationState(fakeStorage({ "shanhai-destination-state": "{broken" }))),
  { wants: [], plans: [] },
  "broken destination state JSON should fall back to defaults"
);

const memoryStorage = fakeStorage({ "shanhai-memory-entries": JSON.stringify([{ id: "one" }]) });
assert.deepEqual(plain(store.loadSavedMemories(memoryStorage)), [{ id: "one" }], "stored memory entries should load");
assert.deepEqual(plain(store.loadSavedMemories(fakeStorage({ "shanhai-memory-entries": "{broken" }))), [], "broken memory JSON should fall back to an empty archive");

const writable = fakeStorage();
assert.deepEqual(plain(store.saveDestinationState({ wants: ["kiyomizu"], plans: [] }, writable)), { ok: true }, "destination writes should report success");
assert.deepEqual(JSON.parse(writable.dump()["shanhai-destination-state"]), { wants: ["kiyomizu"], plans: [] }, "destination writes should persist JSON");

const failingStorage = {
  getItem() {
    return null;
  },
  setItem() {
    throw new Error("quota");
  },
};
assert.deepEqual(plain(store.persistSavedMemories([{ id: "one" }], failingStorage)), { ok: false, error: "quota" }, "memory write failures should be returned instead of thrown");

assert.doesNotMatch(main, /localStorage/, "app entry should use the storage adapter instead of localStorage directly");
assert.doesNotMatch(main, /shanhai-destination-state|shanhai-memory-entries/, "storage keys should stay inside the storage adapter");
