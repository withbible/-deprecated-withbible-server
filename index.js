require("dotenv").config();
require("./src/infrastructure-layer/external-services/session-storage").init();
require("./src/infrastructure-layer/external-services/realtime-statistic").init();
require("./src/infrastructure-layer/external-services/push-notification").init();
require("./src/infrastructure-layer/external-services/database").init();

const app = require("./src/infrastructure-layer/configs/app");
require("./src/infrastructure-layer/external-services/monitoring").init(app);
const logger = require("./src/infrastructure-layer/configs/logger");

if (!process.env.PORT) {
  logger.error("포트번호가 존재하지 않습니다.");
  process.exit(2);
}

const server = (() => {
  // +++ production 환경(cloudtype)에서 HTTPS 인증서 자동발급
  if (process.env.NODE_ENV === "production") {
    return app();
  }

  const https = require("https");
  return https.createServer(
    require("./src/infrastructure-layer/configs/ssl-config-local")(),
    app()
  );
})();

require("./src/application-layer/batches").run();

server.listen(process.env.PORT, () => {
  console.log(`
##############################################
  🛡️  HTTPS Server listening on port: ${process.env.PORT} 🛡️
##############################################
  `);
});
