const express = require("express");
const { StatusCodes } = require("http-status-codes");
const Sentry = require("@sentry/node");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const { errResponse } = require("../../utils/response");

// CONSTANT
const fileName = path.basename(__filename, ".js");

module.exports = () => {
  const app = express();

  // CONFIG
  // +++ Trust the nth hop from the front-facing proxy server as the client.
  app.set("trust proxy", 1);
  require("../external-services/monitoring").init(app);
  require("../external-services/session-storage").init();
  require("../external-services/realtime-statistic").init();
  require("../external-services/push-notification").init();
  require("../external-services/database").init();

  // MIDDLEWARE
  app.use(
    Sentry.Handlers.requestHandler(),
    Sentry.Handlers.tracingHandler(),
    require("../../presentation-layer/middlewares/authenticator").session,
    require("../../presentation-layer/middlewares/authorizer"),
    require("../../presentation-layer/middlewares/parser").queryParser,
    require("../../presentation-layer/middlewares/parser").bodyParser,
    require("../../presentation-layer/middlewares/http-request-logger")
  );

  // ROUTING
  require("../../presentation-layer/routes")(app);

  // ERROR HANDLEING
  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND);
    res.json(
      errResponse({
        message: `${req.method} ${req.url} API는 존재하지 않습니다.`,
      })
    );
  });

  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(err) {
        if (err.status === 404 || err.status === 500) {
          return true;
        }
        return false;
      },
    })
  );

  app.use((err, req, res) => {
    logger.error(`[${fileName}]_${err.message}`);

    res.status(err.status);
    res.json(errResponse({ message: err.message }));
  });

  return app;
};
