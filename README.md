# 山海映记

山海映记是一个本地优先的移动端旅行影像档案原型。它把旅行地图、日记、目的地点评、照片导入、长图生成、个人档案管理，以及本地 JSON 导入/导出放在一个静态前端页面里。

## 功能概览

- 我的山海档案：查看年度旅行摘要、最近映记和个人旅行轨迹。
- 全部映记：搜索、筛选、收藏、编辑、删除本地保存的映记；种子映记保持只读。
- 映记详情：展示封面、正文、图册和路线回看。
- 目的地点评：浏览目的地评分、推荐理由、优缺点、评价维度和真实短评。
- 创建映记：编辑标题、地点和正文，选择或导入照片，自动生成时间线。
- 分享长图：将当前映记绘制到 Canvas，并导出 PNG。
- 本地档案：使用版本化 `localStorage` 对象保存映记、想去、计划、标签和收藏状态。
- 导入/导出：把本地档案导出为 JSON，也可以从 JSON 合并恢复，默认不覆盖已有映记。

## 快速开始

这个项目没有构建步骤，直接打开即可：

```powershell
start .\index.html
```

也可以用浏览器打开仓库里的 `index.html`。

## 测试

项目使用 Node 脚本做轻量验证：

```powershell
node --check src\main.js
node --check src\data\seed-destinations.js
node --check src\data\seed-memories.js
node --check src\domain\memory.js
node --check src\storage\archive-export.js
node --check src\storage\local-store.js
node tests\archive-export.test.mjs
node tests\domain-memory.test.mjs
node tests\prototype.test.mjs
node tests\storage.test.mjs
node tests\browser-flow.test.mjs
```

`prototype.test.mjs` 检查关键页面结构、样式选择器和核心函数是否存在。

`storage.test.mjs`、`domain-memory.test.mjs` 和 `archive-export.test.mjs` 覆盖本地档案读写、旧数据迁移、版本化映记、导入导出和合并逻辑。

`browser-flow.test.mjs` 使用 Playwright 跑真实浏览器流程，覆盖创建表单回车不刷新、本地图片导入保存为 data URL、保存映记、收藏筛选、删除确认和 JSON 导入。

> 浏览器测试依赖 Codex 桌面运行时里自带的 Playwright 包；如果在普通环境运行，需要自行安装 Playwright。

## 项目结构

```text
.
|-- assets/
|   `-- app-icon.svg
|-- docs/
|   `-- superpowers/
|-- src/
|   |-- data/
|   |   |-- seed-destinations.js
|   |   `-- seed-memories.js
|   |-- domain/
|   |   `-- memory.js
|   |-- storage/
|   |   |-- archive-export.js
|   |   `-- local-store.js
|   `-- main.js
|-- tests/
|   |-- archive-export.test.mjs
|   |-- browser-flow.test.mjs
|   |-- domain-memory.test.mjs
|   |-- prototype.test.mjs
|   `-- storage.test.mjs
|-- index.html
|-- styles.css
`-- README.md
```

## 技术说明

- 纯 HTML/CSS/JavaScript，无框架、无打包器、无后端。
- 保留经典脚本加载方式，确保 `index.html` 可以通过 `file://` 直接打开。
- 目的地和种子映记数据拆在 `src/data/` 下，通过 `window` 暴露给入口脚本。
- 映记模型在 `src/domain/memory.js` 中规范化，保证新旧数据都有 `createdAt`、`updatedAt`、`tags` 和 `favorite`。
- 本地存储在 `src/storage/local-store.js` 中封装，兼容旧的分离 key，并写入新的版本化 `shanhai-archive`。
- 导入导出逻辑在 `src/storage/archive-export.js` 中封装，导入时按 `id` 合并去重。
- 本地导入图片通过 `FileReader.readAsDataURL()` 转为 data URL，避免保存后依赖临时 `blob:` 地址。
- 分享长图通过隐藏 Canvas 绘制，再导出 PNG。

## GitHub Pages

这是静态站点，可以直接用 GitHub Pages 发布：

1. 打开仓库 `Settings -> Pages`。
2. Source 选择 `Deploy from a branch`。
3. Branch 选择 `main`，目录选择 `/root`。
4. 保存后等待 Pages 生成访问地址。

## 当前边界

- 数据只保存在当前浏览器的 `localStorage`，没有账号、云同步或后端。
- 目的地和种子映记仍是静态样例数据。
- 编辑映记使用浏览器原生 `prompt`，后续可以换成更完整的表单 UI。
- 分享长图在部分远程图片跨域失败时会降级为渐变背景。
