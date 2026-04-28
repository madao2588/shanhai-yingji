import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const domainPath = "src/domain/memory.js";
assert.equal(existsSync(domainPath), true, "memory domain helpers should live in src/domain");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(readFileSync(domainPath, "utf8"), context, { filename: domainPath });

const domain = context.window.shanhaiMemoryDomain;

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

assert.equal(typeof domain.createMemory, "function", "domain should create memory entries");
assert.equal(typeof domain.normalizeMemory, "function", "domain should normalize memory entries");
assert.equal(typeof domain.normalizeArchive, "function", "domain should normalize archive payloads");

const normalized = domain.normalizeMemory({ id: "one", title: "One", location: "Kyoto" }, "2026-04-28T00:00:00.000Z");
assert.equal(normalized.id, "one", "normalized memories should keep ids");
assert.deepEqual(plain(normalized.tags), [], "normalized memories should include tags");
assert.equal(normalized.favorite, false, "normalized memories should include favorite state");
assert.equal(normalized.createdAt, "2026-04-28T00:00:00.000Z", "normalized memories should include createdAt");
assert.equal(normalized.updatedAt, "2026-04-28T00:00:00.000Z", "normalized memories should include updatedAt");

const created = domain.createMemory({ title: "New", location: "Paris" }, "2026-04-28T01:00:00.000Z");
assert.match(created.id, /^memory-/, "created memories should receive an id");
assert.equal(created.createdAt, "2026-04-28T01:00:00.000Z", "created memories should receive createdAt");

const fromArray = domain.normalizeArchive([{ id: "legacy", title: "Legacy" }], "2026-04-28T02:00:00.000Z");
assert.equal(fromArray.version, 1, "legacy memory arrays should migrate to versioned archives");
assert.equal(fromArray.memories[0].id, "legacy", "legacy archive migration should keep memories");
assert.deepEqual(plain(fromArray.destinationState), { wants: [], plans: [] }, "legacy archive migration should add destination defaults");

const fromObject = domain.normalizeArchive(
  {
    version: 1,
    memories: [{ id: "object", title: "Object", tags: ["quiet"], favorite: true }],
    destinationState: { wants: ["kiyomizu"], plans: ["philosopher"] },
  },
  "2026-04-28T03:00:00.000Z"
);
assert.deepEqual(plain(fromObject.destinationState), { wants: ["kiyomizu"], plans: ["philosopher"] }, "versioned archives should keep destination state");
assert.deepEqual(plain(fromObject.memories[0].tags), ["quiet"], "versioned archives should keep tags");
assert.equal(fromObject.memories[0].favorite, true, "versioned archives should keep favorite state");
