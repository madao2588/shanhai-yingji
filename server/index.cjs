const path = require("node:path");
const { createApp } = require("./app.cjs");
const { loadConfig } = require("./config.cjs");

const publicDir = path.resolve(__dirname, "..");
const config = loadConfig({ publicDir });
const app = createApp(config);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`山海映记后端已启动：http://127.0.0.1:${config.port}`);
  console.log(`数据目录：${config.dataDir}`);
});
