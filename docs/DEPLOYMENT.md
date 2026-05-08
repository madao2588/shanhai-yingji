# 部署指南

## 本地运行

```powershell
npm ci
npm test
npm run serve
```

默认地址：`http://127.0.0.1:4173`

## 环境变量

参考 `.env.example`：

- `PORT`
- `SHANHAI_DATA_DIR`
- `SHANHAI_ALLOWED_ORIGIN`
- `SHANHAI_MAX_JSON_BYTES`
- `SHANHAI_MAX_UPLOAD_BYTES`
- `SHANHAI_RATE_LIMIT_WINDOW_MS`
- `SHANHAI_RATE_LIMIT_MAX`

## Docker

```powershell
docker build -t shanhai-yingji .
docker run --rm -p 4173:4173 -v shanhai-data:/data shanhai-yingji
```

## 生产反向代理

生产必须放在 HTTPS 反向代理之后。生产待替换项：

- `PROD_DOMAIN`
- TLS 证书路径
- 反向代理配置
- 数据目录挂载
- 备份目标

## 回滚

1. 停止新版本容器或进程。
2. 恢复上一版本镜像/代码。
3. 恢复数据目录备份。
4. 运行 `GET /api/health` 和登录/创建/公开读取冒烟测试。
# Final community deployment update

Set `SHANHAI_ADMIN_EMAILS` before first admin registration, for example `SHANHAI_ADMIN_EMAILS=admin@example.com,ops@example.com`. The account must register with one of those emails to receive admin moderation access.

For a production community launch, deploy the Node service behind HTTPS, persist `.data/` on a durable volume only for single-instance validation, and plan the managed-database/object-storage migration before multi-instance traffic. The community tables that must migrate are users, sessions, memories, photos, likes, bookmarks, comments, follows, reports, notifications, moderation actions, and views.

## Production beta: Render + R2 + Upstash

The recommended first public beta target is Render Web Service with Render PostgreSQL, Cloudflare R2 for uploads, Upstash Redis REST rate limiting, and Cloudflare DNS/TLS.

Required production environment:

- `NODE_ENV=production`
- `SHANHAI_DATABASE_ADAPTER=postgres`
- `DATABASE_URL`
- `DATABASE_SSL=true`
- `SHANHAI_MEDIA_STORE=r2`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `SHANHAI_RATE_LIMIT_STORE=upstash`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `SHANHAI_PUBLIC_BASE_URL`
- `SHANHAI_ALLOWED_ORIGIN`
- `SHANHAI_ADMIN_EMAILS`

Release steps:

1. Create the Render PostgreSQL database and web service from `render.yaml`.
2. Create an R2 bucket and a public media domain; set all `R2_*` values in Render.
3. Create an Upstash Redis database; set the REST URL and token in Render.
4. Set `SHANHAI_ALLOWED_ORIGIN` and `SHANHAI_PUBLIC_BASE_URL` to the final HTTPS app origin.
5. Deploy, then verify `GET /api/health` reports `database=postgres` and `mediaStore=r2`.
6. Register the first admin account using an email in `SHANHAI_ADMIN_EMAILS`.
