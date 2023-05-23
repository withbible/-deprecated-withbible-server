require("dotenv").config();

// INTERNAL IMPORT
const app = require("./src/configs/app");
const logger = require("./src/configs/logger");
const batch = require("./src/Notice/batch");
const { getSSLConfigLocal } = require("./src/configs/ssl");

// CONSTANT
const { PORT, NODE_ENV } = process.env;

if (!PORT) {
  logger.error("포트번호가 존재하지 않습니다.");
  process.exit();
}

// MAIN
const server = (() => {
  // +++ production 환경에서 https 지원
  if (NODE_ENV === "production") {
    return app();
  }

  const https = require("https");
  return https.createServer(getSSLConfigLocal(), app());
})();

server.listen(PORT, () => {
  const cron = require("node-cron");
  console.log(`
##############################################
  🛡️  HTTPS Server listening on port: ${PORT} 🛡️
##############################################
  `);

  cron.schedule("0 9 1 * *", () => {
    batch.sendQuizNotification();
  });
});
