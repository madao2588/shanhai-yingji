# 备份与恢复

## 本地/单实例范围

- `.data/shanhai-db.json`
- `.data/uploads/`
- 部署版本号和 `.env` 配置快照

## 生产内测范围

- Render PostgreSQL 自动备份
- Cloudflare R2 bucket 对象
- Render 环境变量快照
- Upstash Redis 配置快照
- 当前部署版本和镜像/commit

## 频率与保留

- 生产建议：PostgreSQL 每日自动备份，发布前手动快照。
- RPO：内测阶段不超过 24 小时；正式扩大前降到 1 小时以内。
- RTO：内测阶段不超过 4 小时。

## 恢复步骤

1. 暂停新部署并记录当前 Render deploy id。
2. 恢复目标时间点的 PostgreSQL 备份。
3. 确认 R2 bucket 中目标对象仍存在；如对象误删，从 R2 备份/版本恢复。
4. 回滚 Render web service 到匹配代码版本。
5. 运行恢复验证。

## 恢复验证

- `GET /api/health` 返回 `status=ok`、`database=postgres`、`mediaStore=r2`。
- 登录测试账号。
- 打开我的云端档案。
- 打开公开日志。
- 抽查上传图片 URL。
- 导出管理员备份。
