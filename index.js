require("dotenv").config();
const cron = require("node-cron");
const https = require("https");

// INTERNAL IMPORT
const app = require("./src/configs/app");
const logger = require("./src/configs/logger");
const { sendQuizNotification } = require("./src/Notice/cron");
const { getSSLConfigLocal } = require("./src/configs/ssl");

// CONSTANT
const { PORT, NODE_ENV } = process.env;

// MAIN
const server =
  NODE_ENV === "development"
    ? https.createServer(getSSLConfigLocal(), app())
    : app(); // +++ production 환경에서 https 지원

if (!PORT) {
  logger.error("포트번호가 존재하지 않습니다.");
  process.exit();
}

server.listen(PORT, () => {
  console.log(`
##############################################
  🛡️  HTTPS Server listening on port: ${PORT} 🛡️
##############################################
  `);

  cron.schedule("0 9 1 * *", () => {
    logger.info("전월 퀴즈 등록수 알림 송신");
    sendQuizNotification();
  });
});
