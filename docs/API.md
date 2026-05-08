# 山海映记 API

## 基础

- Base URL：生产待替换项，例如 `https://api.example.com`
- 鉴权：`Authorization: Bearer <token>`
- 响应格式：JSON
- 错误格式：`{ "error": "message" }`

## 健康检查

`GET /api/health`

返回服务状态、数据库适配器、媒体存储适配器和时间戳。用于负载均衡、部署探针和人工巡检。生产内测环境应显示 `database=postgres` 和 `mediaStore=r2`。

## 账号

`POST /api/auth/register`

请求：

```json
{ "name": "林山海", "email": "lin@example.com", "password": "correct horse battery" }
```

`POST /api/auth/login`

请求：

```json
{ "email": "lin@example.com", "password": "correct horse battery" }
```

## 当前用户

`GET /api/me`

需要 Bearer token。返回当前用户资料。

## 旅行日志

`GET /api/memories`

返回当前用户自己的日志。

`POST /api/memories`

创建日志。`status` 可为 `private` 或 `public`，默认 `private`。

`GET /api/memories/:id`

读取自己的单篇日志。

`PATCH /api/memories/:id`

编辑自己的日志。

`DELETE /api/memories/:id`

软删除自己的日志。

## 媒体上传

`POST /api/memories/:id/photos`

请求：

```json
{
  "fileName": "kyoto.png",
  "mimeType": "image/png",
  "dataUrl": "data:image/png;base64,...",
  "alt": "京都照片"
}
```

当前实现支持 `image/png`、`image/jpeg`、`image/webp`、`image/gif`。生产待替换项：对象存储、CDN、图片压缩与病毒扫描。

## 公开内容

`GET /api/public/memories`

读取公开日志列表。

`GET /api/public/memories/:id`

读取公开日志详情。

`GET /api/profile/:username`

读取公开主页资料与公开日志。

## 备份恢复

`GET /api/export`

导出当前用户档案 JSON。

`POST /api/import`

导入档案 JSON 并合并到当前账号。
# Final public travel community API

The production community API includes: `GET /api/discover/memories`, `GET /api/tags`, `GET /api/destinations`, `POST /api/memories/:id/like`, `POST /api/memories/:id/bookmark`, `GET/POST /api/memories/:id/comments`, `POST /api/profile/:username/follow`, `GET /api/notifications`, `GET /api/creator/stats`, `POST /api/reports`, `GET /api/admin/reports`, and `PATCH /api/admin/reports/:id`.

Public discovery accepts `q`, `tag`, `city`, `country`, `destinationId`, and `sort=latest|popular`. Public memories appear in discovery, unlisted memories are directly readable by link, private memories are not public, and admin `remove_memory` moderation removes content from discovery. Admin users are configured through `SHANHAI_ADMIN_EMAILS`.

## Production Health Contract

`GET /api/health` returns structured dependency probes in addition to the legacy `database`, `mediaStore`, and `uploads` fields. Production should return HTTP `200`, `status=ok`, `checks.database.status=ok`, and `checks.media.status=ok`.

If a database or media probe fails, the endpoint returns HTTP `503` with `status=degraded`; the failed dependency is marked with `status=error`. The R2 media probe performs a bucket access check, so invalid credentials, endpoint, or bucket names fail before launch. The response intentionally avoids exposing internal dependency error details.
