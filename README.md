# 山海映记

山海映记是一个移动端旅行影像档案原型。它把旅行地图、日记、目的地点评、照片导入、长图生成和个人档案串在一个静态前端页面里，适合作为小程序或移动应用的交互概念稿。

## 功能概览

- 我的山海档案：查看年度旅行摘要、最近映记和个人旅行轨迹。
- 全部映记：按国家、年份、保存状态筛选本地档案，并支持关键词搜索。
- 映记详情：展示封面、正文、图库和路线回看。
- 社区点评：浏览目的地评分、推荐理由、优缺点、评价维度和真实短评。
- 创建映记：编辑标题、时间地点和正文，选择或导入照片，自动生成时间线。
- 分享长图：将当前映记绘制到 Canvas，并导出 PNG。
- 本地保存：使用 `localStorage` 保存想去、计划和个人映记。

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
node tests\prototype.test.mjs
node tests\browser-flow.test.mjs
```

`prototype.test.mjs` 检查关键页面结构、样式选择器和核心函数是否存在。

`browser-flow.test.mjs` 使用 Playwright 跑真实浏览器流程，覆盖创建表单回车不刷新、本地图片导入后转成可持久保存的 data URL。

> 浏览器测试依赖 Codex 桌面运行时里自带的 Playwright 包；如果在普通环境运行，需要自行安装 Playwright。

## 项目结构

```text
.
├── assets/
│   └── app-icon.svg
├── tests/
│   ├── browser-flow.test.mjs
│   └── prototype.test.mjs
├── src/
│   ├── data/
│   │   ├── seed-destinations.js
│   │   └── seed-memories.js
│   └── main.js
├── index.html
├── styles.css
└── README.md
```

## 技术说明

- 纯 HTML/CSS/JavaScript，无框架、无打包器。
- 视觉风格面向移动端，桌面视图中以手机壳容器呈现。
- 远程示例图片来自 Unsplash。
- 本地导入图片通过 `FileReader.readAsDataURL()` 转为 data URL，避免保存后依赖临时 `blob:` 地址。
- 分享长图通过隐藏 Canvas 绘制，再导出为 PNG。

## 当前边界

- 数据只保存在当前浏览器的 `localStorage`，没有账号、云同步或后端。
- 目的地和种子映记数据仍是静态样例。
- 分享长图在部分远程图片跨域失败时会降级为渐变背景。
- 尚未做 GitHub Pages 部署和完整移动端真机回归。
