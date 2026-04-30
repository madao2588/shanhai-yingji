# 故障排查 FAQ

## 无法登录

- 确认邮箱格式正确。
- 确认密码不少于 10 个字符。
- 如果返回 429，等待限流窗口结束。

## 无法上传图片

- 仅支持 PNG、JPEG、WebP、GIF。
- 检查图片大小是否超过 `SHANHAI_MAX_UPLOAD_BYTES`。

## 页面更新后还是旧版本

- 清除浏览器站点数据。
- 确认 service worker cache name 已随发布更新。

## `file://` 与 `http://` 差异

`file://` 可以使用本地档案原型能力，但云端账号、API、上传和公开发布必须通过 `npm run serve` 或部署后的 HTTP/HTTPS 服务访问。
