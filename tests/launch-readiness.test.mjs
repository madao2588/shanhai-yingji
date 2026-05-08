import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  ".env.example",
  "Dockerfile",
  ".dockerignore",
  "docs/API.md",
  "docs/ARCHITECTURE.md",
  "docs/SECURITY.md",
  "docs/DEPLOYMENT.md",
  "docs/LAUNCH-CHECKLIST.md",
  "docs/RUNBOOK.md",
  "docs/BACKUP-RESTORE.md",
  "docs/MONITORING.md",
  "docs/TROUBLESHOOTING.md",
  "docs/RELEASE-NOTES.md",
];

for (const file of requiredFiles) {
  assert.equal(existsSync(file), true, `${file} should exist for launch readiness`);
}

const envExample = readFileSync(".env.example", "utf8");
assert.match(envExample, /PORT=/, "env example should document PORT");
assert.match(envExample, /SHANHAI_DATA_DIR=/, "env example should document data directory");
assert.match(envExample, /SHANHAI_ALLOWED_ORIGIN=/, "env example should document allowed origin");
assert.match(envExample, /SHANHAI_RATE_LIMIT_MAX=/, "env example should document rate limit max");

const dockerfile = readFileSync("Dockerfile", "utf8");
assert.match(dockerfile, /npm ci/, "Dockerfile should install locked dependencies");
assert.match(dockerfile, /npm run serve/, "Dockerfile should run the production server command");

const readme = readFileSync("README.md", "utf8");
assert.match(readme, /npm run serve/, "README should include fullstack serve command");
assert.match(readme, /生产必须替换/, "README should call out production replacement items");
assert.match(readme, /npm test/, "README should include the final verification command");

const apiDocs = readFileSync("docs/API.md", "utf8");
assert.match(apiDocs, /POST \/api\/auth\/register/, "API docs should cover registration");
assert.match(apiDocs, /POST \/api\/memories\/:id\/photos/, "API docs should cover media upload");
assert.match(apiDocs, /GET \/api\/health/, "API docs should cover health checks");
assert.match(apiDocs, /checks\.database/, "API docs should cover structured health checks");

const launchChecklist = readFileSync("docs/LAUNCH-CHECKLIST.md", "utf8");
assert.match(launchChecklist, /checks\.database\.status=ok/, "launch checklist should require dependency health checks");
assert.match(launchChecklist, /备份/, "launch checklist should cover backups");
assert.match(launchChecklist, /HTTPS/, "launch checklist should cover HTTPS");
assert.match(launchChecklist, /回滚/, "launch checklist should cover rollback");

const runbook = readFileSync("docs/RUNBOOK.md", "utf8");
assert.match(runbook, /checks\.media\.status=ok/, "runbook should cover media health checks");
assert.match(runbook, /巡检/, "runbook should cover routine checks");
assert.match(runbook, /上传/, "runbook should cover upload incidents");

const backup = readFileSync("docs/BACKUP-RESTORE.md", "utf8");
assert.match(backup, /RPO/, "backup docs should cover RPO");
assert.match(backup, /恢复验证/, "backup docs should cover restore validation");
assert.match(backup, /PostgreSQL/, "backup docs should cover production database backups");
assert.match(backup, /R2/, "backup docs should cover production media backups");

const sourceFiles = [
  "index.html",
  "src/data/seed-destinations.js",
  "src/data/seed-memories.js",
  "src/main.js",
  "styles.css",
];

for (const file of sourceFiles) {
  assert.doesNotMatch(readFileSync(file, "utf8"), /images\.unsplash\.com/, `${file} should not depend on remote Unsplash images for launch`);
}
