import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const domainPath = "src/domain/memory.js";
const transferPath = "src/storage/archive-export.js";

assert.equal(existsSync(transferPath), true, "archive import/export helpers should live in src/storage");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(readFileSync(domainPath, "utf8"), context, { filename: domainPath });
vm.runInContext(readFileSync(transferPath, "utf8"), context, { filename: transferPath });

const transfer = context.window.shanhaiArchiveTransfer;

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

assert.equal(typeof transfer.buildArchiveExport, "function", "transfer helpers should build export JSON");
assert.equal(typeof transfer.parseArchiveImport, "function", "transfer helpers should parse import JSON");
assert.equal(typeof transfer.mergeArchive, "function", "transfer helpers should merge archives");

const current = {
  version: 1,
  memories: [{ id: "one", title: "One", tags: ["kyoto"], favorite: true }],
  destinationState: { wants: ["kiyomizu"], plans: [] },
};
const incoming = {
  version: 1,
  memories: [
    { id: "one", title: "One duplicate" },
    { id: "two", title: "Two" },
  ],
  destinationState: { wants: ["philosopher"], plans: ["kiyomizu"] },
};

const exported = transfer.buildArchiveExport(current);
assert.equal(JSON.parse(exported).version, 1, "exports should include archive version");
assert.equal(JSON.parse(exported).memories[0].id, "one", "exports should include memories");

assert.deepEqual(plain(transfer.parseArchiveImport("{broken")), { ok: false, error: "Invalid JSON" }, "invalid JSON should be rejected without archive changes");

const parsed = transfer.parseArchiveImport(JSON.stringify(incoming));
assert.equal(parsed.ok, true, "valid import JSON should parse");
assert.equal(parsed.archive.memories.length, 2, "valid import JSON should normalize memories");

const merged = transfer.mergeArchive(current, parsed.archive);
assert.equal(merged.memories.length, 2, "merge should not duplicate memories with the same id");
assert.equal(merged.memories[0].id, "one", "merge should keep existing memories first");
assert.deepEqual(plain(merged.destinationState), { wants: ["kiyomizu", "philosopher"], plans: ["kiyomizu"] }, "merge should combine destination state");
