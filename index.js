require("dotenv").config();
const cron = require("node-cron");

// INTERNAL IMPORT
const app = require("./src/configs/app");
const { logger } = require("./src/configs/logger");
const { sendQuizNotification } = require("./src/Notice/cron");

// CONSTANT
const { PORT, NODE_ENV } = process.env;

function incomingMessage() {
  console.log(`
##############################################
  🛡️  HTTPS Server listening on port: ${PORT} 🛡️
##############################################
  `);
}

function listener() {
  incomingMessage();

  cron.schedule("0 1 9 * * *", function () {
    logger.info("금월 퀴즈 등록수 알림 송신");
    sendQuizNotification();
  });
}

if (NODE_ENV === "development") {
  const https = require("https");
  const fs = require("fs");

  const options = {
    key: fs.readFileSync("./certs/localhost-key.pem"),
    cert: fs.readFileSync("./certs/localhost.pem"),
  };

  const server = https.createServer(options, app());
  server.listen(PORT, listener);
} else {
  app().listen(PORT, listener);
}
