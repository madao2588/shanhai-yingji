import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readme = readFileSync("README.md", "utf8");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

assert.doesNotMatch(packageJson.description, /static travel archive prototype/i, "package description should not frame the product as a static prototype");
assert.doesNotMatch(readme, /MVP/i, "README should not position the final product as an MVP");
assert.doesNotMatch(readme, /静态旅行日志原型|静态.*原型/, "README should not position the final product as a static prototype");
assert.match(readme, /后端|backend/i, "README should explain the backend");
assert.match(readme, /数据库|database/i, "README should explain the database");
assert.match(readme, /公开|community|社区/i, "README should explain the public community");
assert.match(readme, /管理员|admin/i, "README should explain admin operations");
assert.match(readme, /npm test/, "README should document verification");
assert.match(readme, /部署|deploy/i, "README should document deployment");
