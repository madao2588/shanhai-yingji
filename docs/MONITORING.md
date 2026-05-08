# 监控与告警

## 指标

- `/api/health` 可用性
- 5xx 错误率
- 401/429 比例
- 注册和登录成功率
- 图片上传失败率
- PostgreSQL 连接数和备份状态
- R2 对象数量、存储增长和上传/删除错误
- Upstash Redis REST 命令使用量和失败率

## 告警建议

- 健康检查连续 3 次失败。
- 5xx 错误率超过 1%。
- 上传失败率突然升高。
- `rate limiter unavailable` 出现在运行日志中。
- PostgreSQL 连接数接近套餐上限或自动备份缺失。
- Upstash 命令量接近套餐上限。

## Production beta checks

- Render health check: `/api/health` must return `status=ok`, `database=postgres`, and `mediaStore=r2`.
- Render logs: alert on repeated startup failures, 5xx responses, and `rate limiter unavailable`.
- Upstash: alert when command usage approaches the plan limit or REST failures appear.
- Cloudflare R2: watch object count, storage growth, and upload/delete errors.
- PostgreSQL: confirm automated backups and monitor connection usage.
