const env = require("./config/env");

const app = require("./app");
const logger = require("./utils/logger");

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`
==========================================
🚀 CreditMiners Backend Started
🌍 Environment : ${env.NODE_ENV}
📡 Server      : http://localhost:${PORT}
==========================================
`);
});