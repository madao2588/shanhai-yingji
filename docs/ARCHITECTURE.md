# 山海映记架构

## 当前上线前形态

山海映记当前是移动端优先的 PWA 前端加 Node 后端：

- 前端：`index.html`、`styles.css`、`src/main.js` 保留本地档案能力。
- 云端前端：`src/api-client.js`、`src/fullstack-panel.js` 负责账号、云端日志、上传和公开列表。
- 后端：`server/app.cjs` 提供 API 和静态资源。
- 数据：`server/database.cjs` 写入 `.data/shanhai-db.json`。
- 媒体：上传文件写入 `.data/uploads/`。

## 数据流

1. 用户在“我的”页注册或登录。
2. 前端把 token 保存到 `localStorage`。
3. 云端日志通过 `/api/memories` 写入后端。
4. 图片以 data URL 上传到 `/api/memories/:id/photos`，服务端保存文件并返回 `/uploads/...`。
5. `public` 状态日志进入公开 API。

## 生产待替换项

- JSON 文件数据库应替换为 PostgreSQL 或同等级托管数据库。
- `.data/uploads/` 应替换为对象存储和 CDN。
- Bearer token 会话应配合 HTTPS、密钥轮换、审计日志和更细粒度会话管理。
- 当前单进程本地限流应替换为网关/Redis 级限流。

## 保留能力

本地 PWA 档案、草稿、JSON 导入导出和分享长图仍可在没有后端时使用。
# Final community architecture update

The app now has a backend-backed public travel community layer, not just a static showcase. `server/database.cjs` persists users, sessions, memories, photos, likes, bookmarks, comments, follows, reports, notifications, moderation actions, and views in the JSON adapter. The adapter is still intentionally swappable: production deployment should replace the JSON file with PostgreSQL or an equivalent managed database while keeping the API contract.

Visibility semantics are `private`, `unlisted`, and `public`. Public memories enter `/api/discover/memories`; unlisted memories are readable by direct `/api/public/memories/:id` links but excluded from discovery; private memories are owner-only. Admin moderation can mark reported memories removed, which keeps the record for audit while excluding it from public discovery.

The mobile frontend uses `src/api-client.js` for all community endpoints and `src/fullstack-panel.js` to render discovery, likes, bookmarks, comments, follows, reports, creator stats, and notifications into the existing phone UI.
