require("dotenv").config();

// INTERNAL IMPORT
const app = require("./src/infrastructure-layer/configs/app");
const logger = require("./src/infrastructure-layer/configs/logger");
const getSSLConfigLocal = require("./src/infrastructure-layer/configs/ssl-config-local");
const batch = require("./src/application-layer/batches");

// CONSTANT
const { PORT, NODE_ENV } = process.env;

if (!PORT) {
  logger.error("포트번호가 존재하지 않습니다.");
  process.exit();
}

// MAIN
const server = (() => {
  // +++ production 환경(cloudtype)에서 HTTPS 인증서 자동발급
  if (NODE_ENV === "production") {
    return app();
  }

  const https = require("https");
  return https.createServer(getSSLConfigLocal(), app());
})();

batch.run();

server.listen(PORT, () => {
  console.log(`
##############################################
  🛡️  HTTPS Server listening on port: ${PORT} 🛡️
##############################################
  `);
});
