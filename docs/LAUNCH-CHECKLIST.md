# 上线检查清单

## 功能

- [ ] 注册、登录、恢复会话
- [ ] 创建、编辑、删除旅行日志
- [ ] 私密/公开发布状态
- [ ] 上传照片
- [ ] 公开日志列表和详情
- [ ] 档案导出和导入

## 验证

- [ ] `npm test`
- [ ] `GET /api/health`
- [ ] 手机浏览器安装 PWA
- [ ] 刷新后登录状态恢复
- [ ] 上传图片可访问

## 安全

- [ ] HTTPS
- [ ] HSTS
- [ ] 生产域名和 CORS/Origin 策略
- [ ] 备份加密
- [ ] 管理密钥不入库

## 运维

- [ ] 数据备份策略
- [ ] 恢复演练
- [ ] 监控和告警
- [ ] 错误日志位置
- [ ] 回滚步骤

## 生产待替换项

- [ ] JSON 文件数据库替换为生产数据库
- [ ] 本地上传目录替换为对象存储/CDN
- [ ] 单进程限流替换为网关或共享限流
- [ ] 隐私政策、服务条款、支持邮箱落地
# Final community launch checks

- [ ] Verify `npm test` passes after community API, browser, and launch-readiness tests.
- [ ] Register an admin email from `SHANHAI_ADMIN_EMAILS` and confirm non-admin users receive 403 for `/api/admin/reports`.

## Production beta readiness

- [ ] Render web service is deployed from `render.yaml`.
- [ ] `/api/health` returns `database=postgres`, `mediaStore=r2`, `checks.database.status=ok`, and `checks.media.status=ok`.
- [ ] Cloudflare R2 upload, public media URL rendering, and object deletion are verified.
- [ ] Upstash Redis rate limiting is enabled with `SHANHAI_RATE_LIMIT_STORE=upstash`.
- [ ] `NODE_ENV=production` fails fast when required production variables are missing.
- [ ] Admin first registration, public post creation, photo upload, report, moderation removal, backup export, and rollback drill are complete.
- [ ] Create public, unlisted, and private memories; confirm only public appears in discovery, unlisted opens by direct link, and private remains hidden.
- [ ] Confirm likes, bookmarks, comments, follows, reports, creator stats, notifications, and admin removal all persist after service restart.
- [ ] Confirm moderation removal hides content from `/api/discover/memories`.
- [ ] Confirm the production migration plan covers users, sessions, memories, photos, likes, bookmarks, comments, follows, reports, notifications, moderation actions, and views.
