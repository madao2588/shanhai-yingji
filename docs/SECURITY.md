# 安全与隐私说明

## 当前已实现

- 密码使用 PBKDF2 哈希保存。
- API 使用 Bearer token 鉴权。
- 基础安全响应头：`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`、CSP。
- 请求体大小限制。
- 图片 MIME 类型白名单和上传大小限制。
- 注册邮箱、密码、日志字段、发布状态校验。
- 基础内存限流。

## 生产必须配置

- HTTPS 和 HSTS。
- 真实域名和 `SHANHAI_ALLOWED_ORIGIN`。
- 数据库备份和加密。
- 对象存储私有桶、签名上传或后端转存。
- 日志脱敏、审计日志和异常告警。
- 法律主体、隐私政策 URL、服务条款 URL、支持邮箱。

## 数据分类

- 账号数据：昵称、邮箱、密码哈希。
- 内容数据：旅行日志正文、地点、标签、公开状态。
- 媒体数据：用户上传图片。
- 会话数据：Bearer token 与过期时间。

## 用户权利

当前 API 支持导出和删除日志。生产上线前应补充账号注销、全量删除和隐私政策入口。
# Community security update

Community write actions require Bearer authentication: likes, bookmarks, comments, follows, reports, creator stats, and notifications. Public discovery remains readable without authentication, with optional viewer state when a valid token is supplied.

Admin moderation endpoints require `role=admin`; the role is assigned only to registration emails listed in `SHANHAI_ADMIN_EMAILS`. Report handling records status, reviewer, notes, and a moderation action. `remove_memory` keeps the underlying content for audit/export boundaries but removes it from public discovery.

Before production traffic, replace the JSON adapter with a managed database, add durable audit logging, add abuse detection for repeated reports/comments, and place uploads behind object storage scanning and CDN delivery.
