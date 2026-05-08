# 山海映记

山海映记是一款移动端优先的旅行日志与公开旅行社区应用。它包含可运行后端、账号体系、旅行日志持久化、照片上传与管理、公开/私密/仅链接可见发布、社区发现流、点赞、收藏、评论、关注、举报、通知、创作者统计、管理员审核、备份导出、测试验证和部署文档。

本仓库可以直接运行完整本地服务。默认地址是 `http://127.0.0.1:4173`。

## 功能

- 账号：注册、登录、会话恢复、资料更新、账号注销。
- 日志：创建、编辑、删除旅行日志，支持标题、正文、地点、国家、城市、标签、路线、季节、预算、人群和到访状态。
- 发布：`private` 仅本人可见，`unlisted` 仅链接可见，`public` 进入社区发现流。
- 媒体：上传照片、查看当前日志照片、删除已上传照片。
- 社区：公开发现流、搜索、最新/热门排序、标签聚合、目的地聚合。
- 互动：点赞、收藏、评论、关注作者、举报内容。
- 创作者：公开日志数、喜欢数、收藏数、评论数和关注者统计。
- 通知：喜欢、收藏、评论、关注等互动通知。
- 管理员：举报列表、内容下架、运营指标、全量备份导出。
- 备份恢复：用户档案导入/导出，管理员全量备份导出。
- 移动端体验：手机尺寸优先的 HTML/CSS/JavaScript 前端，保留本地档案能力和 PWA 外壳。

## 快速运行

```powershell
npm install
npm run serve
```

打开：

```text
http://127.0.0.1:4173
```

## 环境变量

复制 `.env.example` 后按部署环境设置：

```powershell
$env:PORT = "4173"
$env:SHANHAI_DATA_DIR = "C:\shanhai-data"
$env:SHANHAI_ALLOWED_ORIGIN = "https://example.com"
$env:SHANHAI_ADMIN_EMAILS = "admin@example.com"
npm run serve
```

使用 `SHANHAI_ADMIN_EMAILS` 中的邮箱注册账号后，该账号拥有管理员审核、指标和备份权限。

## 数据库与媒体存储

当前后端使用 `server/database.cjs` 中的 JSON 数据库适配器：

- `.data/shanhai-db.json` 保存用户、会话、日志、照片元数据、点赞、收藏、评论、关注、举报、通知、审核动作和浏览记录。
- `.data/uploads/` 保存上传图片文件。

这套适配器适合本地开发、验收和单实例部署。生产多实例部署时，应把同一数据模型迁移到 PostgreSQL 或同等级托管数据库，并把上传目录迁移到对象存储和 CDN。迁移边界已经在 `docs/ARCHITECTURE.md`、`docs/DEPLOYMENT.md` 和 `docs/LAUNCH-CHECKLIST.md` 中列出。

## API

核心接口包括：

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/PATCH/DELETE /api/me`
- `GET/POST /api/memories`
- `GET/PATCH/DELETE /api/memories/:id`
- `POST /api/memories/:id/photos`
- `DELETE /api/memories/:id/photos/:photoId`
- `GET /api/discover/memories`
- `GET /api/tags`
- `GET /api/destinations`
- `POST /api/memories/:id/like`
- `POST /api/memories/:id/bookmark`
- `GET/POST /api/memories/:id/comments`
- `POST /api/profile/:username/follow`
- `GET /api/notifications`
- `GET /api/creator/stats`
- `POST /api/reports`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id`
- `GET /api/admin/metrics`
- `GET /api/admin/backup`
- `GET /api/export`
- `POST /api/import`

完整说明见 `docs/API.md`。

## 测试

```powershell
npm test
npm audit --omit=dev
```

测试覆盖：

- 语法检查：后端、前端、service worker、全部测试文件。
- 数据逻辑：本地档案、导入导出、领域模型迁移。
- API：账号、日志、媒体、公开发布、社区互动、举报、审核、备份、指标。
- 浏览器流程：本地记录、云端发布、照片上传、社区发现和互动。
- 上线检查：文档、配置、Docker、PWA、敏感文件不可访问。

## 部署

本地或单实例服务器：

```powershell
npm ci
npm run serve
```

Docker：

```powershell
docker build -t shanhai-yingji .
docker run -p 4173:4173 --env-file .env shanhai-yingji
```

上线前必须完成：

- 生产必须替换开发适配器；鐢熶骇蹇呴』鏇挎崲 JSON 数据库和本地上传目录。
- 配置 HTTPS、反向代理和真实域名。
- 设置 `SHANHAI_ALLOWED_ORIGIN` 与 `SHANHAI_ADMIN_EMAILS`。
- 准备持久化数据卷或托管数据库。
- 准备对象存储/CDN 和上传扫描策略。
- 配置备份、监控、告警和日志留存。
- 运行 `npm test` 与 `npm audit --omit=dev`。

## 文档

- `docs/API.md`：API 合同。
- `docs/ARCHITECTURE.md`：系统结构和数据边界。
- `docs/SECURITY.md`：安全与隐私控制。
- `docs/DEPLOYMENT.md`：部署流程。
- `docs/LAUNCH-CHECKLIST.md`：上线检查清单。
- `docs/RUNBOOK.md`：运行手册。
- `docs/BACKUP-RESTORE.md`：备份恢复。
- `docs/MONITORING.md`：监控告警。
- `docs/TROUBLESHOOTING.md`：故障排查。
- `docs/RELEASE-NOTES.md`：发布记录。

## Production beta stack

The first public beta target is Render Web Service, Render PostgreSQL, Cloudflare R2, Upstash Redis REST rate limiting, and Cloudflare DNS/TLS. In `NODE_ENV=production`, the server now fails fast unless PostgreSQL, R2, Redis, public origin, and admin email configuration are present. Use `render.yaml` and `docs/DEPLOYMENT.md` for the release path.
