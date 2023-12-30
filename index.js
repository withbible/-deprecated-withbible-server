require("dotenv").config();
require("./src/infrastructure-layer/external-services/session-storage").init();
require("./src/infrastructure-layer/external-services/realtime-statistic").init();
require("./src/infrastructure-layer/external-services/push-notification").init();
require("./src/infrastructure-layer/external-services/database").init();

const app = require("./src/infrastructure-layer/configs/app");
require("./src/infrastructure-layer/external-services/monitoring").init(app);
const logger = require("./src/infrastructure-layer/configs/logger");
const { EXIT_CODE } = require("./src/infrastructure-layer/constants");

if (!process.env.PORT) {
  logger.error("포트번호가 존재하지 않습니다.");
  process.exit(EXIT_CODE.CMD_ARG_EXIT);
}

const server = (() => {
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
