require("dotenv").config();
const cron = require("node-cron");

// INTERNAL IMPORT
const app = require("./src/configs/app");
const { logger } = require("./src/configs/logger");
const { sendQuizNotification } = require("./src/Notice/cron");

let server;

if (process.env.NODE_ENV === "development") {
  const https = require("https");
  const fs = require("fs");

  const options = {
    key: fs.readFileSync("./etc/certs/localhost-key.pem"),
    cert: fs.readFileSync("./etc/certs/localhost.pem"),
  };

  server = https.createServer(options, app());
} else {
  server = app();
}

server.listen(process.env.PORT, () => {
  console.log(`
##############################################
  🛡️  HTTPS Server listening on port: ${process.env.PORT} 🛡️
##############################################
  `);

  cron.schedule("0 9 1 * *", function () {
    logger.info("전월 퀴즈 등록수 알림 송신");
    sendQuizNotification();
  });
});
