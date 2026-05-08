# 运维 Runbook

## 日常巡检

1. 打开 `GET /api/health`，确认 `status: ok`。
2. 检查数据目录剩余空间。
3. 检查 `.data/shanhai-db.json` 最近修改时间。
4. 抽查注册、登录、创建日志、上传图片、公开读取。

## 登录故障

- 检查服务时间是否异常。
- 检查 `/api/auth/login` 是否返回 401 或 429。
- 429 表示触发限流，等待窗口结束或调整生产网关策略。

## 上传故障

- 确认 MIME 类型是 `image/png`、`image/jpeg`、`image/webp` 或 `image/gif`。
- 检查 `SHANHAI_MAX_UPLOAD_BYTES`。
- 检查上传目录写权限。

## PWA 缓存故障

- 修改 `service-worker.js` cache name 后重新发布。
- 用户端可清除站点数据后重新打开。

## 升级与回滚

- 升级前备份数据目录。
- 升级后运行 `npm test` 和健康检查。
- 回滚时恢复上一版本代码和数据备份。
# Production beta operations

## Daily checks

- Confirm `GET /api/health` returns `status=ok`, `database=postgres`, `mediaStore=r2`, `checks.database.status=ok`, and `checks.media.status=ok`.
- Treat `checks.media.status=error` as an R2 bucket access failure; verify endpoint, bucket, access key, secret key, and public base URL before accepting traffic.
- Review Render deploy/runtime logs for 5xx responses and startup configuration failures.
- Review Upstash request limits and Cloudflare R2 storage growth.
- Confirm latest PostgreSQL automated backup is present.

## Upload incidents

1. Check whether R2 credentials, bucket name, endpoint, and public base URL are present in Render.
2. Confirm the failing upload is below `SHANHAI_MAX_UPLOAD_BYTES` and has matching `mimeType` and data URL media type.
3. If R2 is unavailable, pause new releases and keep the service running for read-only flows.
4. After recovery, upload a small PNG, verify the public URL, delete it, and confirm the object is removed.

## Rollback

1. Roll back the Render web service to the previous deploy.
2. Keep the PostgreSQL database in place unless a destructive migration was explicitly run.
3. Re-run `/api/health`, admin login, public post read, and backup export.
4. If media writes failed during the incident, reconcile orphaned R2 objects against the `photos` collection.
