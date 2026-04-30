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
