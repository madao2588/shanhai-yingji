# 山海映记本地优先 MVP 实现计划

日期：2026-04-28

设计来源：`docs/superpowers/specs/2026-04-28-local-first-mvp-design.md`

## 总原则

1. 每次只迁移一个边界，保持现有 UI 行为不变。
2. 先补测试，再改实现。
3. 不引入后端、账号、云同步或框架。
4. 不把视觉重做当作当前阶段目标。
5. 每一阶段结束都跑语法、静态结构和浏览器流程测试。

## 阶段 1：建立模块入口

目标：把当前根目录 `app.js` 迁移为 `src/main.js`。入口先保持经典脚本加载，确保 `file://` 直接打开仍可用；等后续引入本地服务器或标准测试脚本后，再切换到 ES module。

步骤：

1. 新增测试断言：
   - `index.html` 使用 `<script src="src/main.js">`。
   - `src/main.js` 存在并包含现有启动逻辑。
   - 根目录不再作为主要脚本入口。
2. 创建 `src/main.js`，从现有 `app.js` 迁移内容。
3. 更新 `index.html` 脚本引用。
4. 更新 README 的测试命令。
5. 删除或停用旧 `app.js`，避免双入口漂移。

验收：

- `node --check src/main.js`
- `node tests/prototype.test.mjs`
- `node tests/browser-flow.test.mjs`
- 浏览器能打开 `index.html`。

## 阶段 2：抽出种子数据

目标：把静态数据从入口文件移到 `src/data/`。

步骤：

1. 新增测试断言：
   - `src/data/seed-destinations.js` 导出 `destinationData`。
   - `src/data/seed-memories.js` 导出 `seedMemories`。
2. 移动目的地数据和种子映记数据。
3. 在 `src/main.js` 中 import 数据。
4. 保持现有页面渲染和交互不变。

验收：

- 数据导入后目的地详情仍可打开。
- 首页、全部映记、映记详情仍能渲染种子数据。
- 所有测试通过。

## 阶段 3：抽出存储层

目标：把 `localStorage` 读写封装到 `src/storage/local-store.js`。

步骤：

1. 为存储层写纯函数测试：
   - 正常读取目的地状态。
   - 正常读取已保存映记。
   - JSON 损坏时返回默认值。
   - 写入失败时向调用方返回可处理结果。
2. 移动 `loadDestinationState`、`saveDestinationState`、`loadSavedMemories`、`persistSavedMemories`。
3. 入口文件只调用存储 API，不直接操作 storage key。

验收：

- 损坏 localStorage 时应用不白屏。
- 保存映记和目的地状态仍能持久化。
- 所有测试通过。

## 阶段 4：版本化档案数据

目标：把用户档案升级为版本化对象，为导入导出打基础。

步骤：

1. 新增 `src/domain/memory.js`：
   - `createMemory`
   - `normalizeMemory`
   - `normalizeArchive`
2. 支持读取旧数组格式并迁移为 `{ version, memories, destinationState }`。
3. 保存时写入版本化对象。
4. 保持旧数据可读。

验收：

- 旧格式 `savedMemories` 不丢。
- 新保存映记包含 `createdAt`、`updatedAt`、`tags`、`favorite`。
- 所有测试通过。

## 阶段 5：档案管理 UI

目标：让全部映记页成为真正的本地档案管理中心。

步骤：

1. 增加收藏和标签显示。
2. 增加编辑入口。
3. 增加删除入口和二次确认。
4. 扩展筛选：收藏、城市、标签。
5. 补浏览器流程测试。

验收：

- 可以编辑、删除、收藏、标签筛选用户保存的映记。
- 删除不会影响种子映记。
- 所有测试通过。

## 阶段 6：导入导出

目标：让用户能备份和恢复本地档案。

步骤：

1. 新增 `src/storage/archive-export.js`：
   - `buildArchiveExport`
   - `parseArchiveImport`
   - `mergeArchive`
2. 在 profile 或 archive 页增加导出/导入入口。
3. 导入前展示摘要。
4. 默认合并，不覆盖。
5. 补浏览器流程测试。

验收：

- 导出 JSON 后清空 localStorage，再导入能恢复映记。
- 无效 JSON 不改变现有数据。
- 重复数据不会重复写入。
- 所有测试通过。

## 阶段 7：发布整理

目标：让公开仓库更容易运行和理解。

步骤：

1. 更新 README。
2. 视情况增加 `package.json` 测试脚本。
3. 增加截图或 GitHub Pages 部署说明。

验收：

- 新读者能按 README 运行项目和测试。
- GitHub Pages 可选开启。
