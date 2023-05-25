const express = require("express");
const { StatusCodes } = require("http-status-codes");
const Sentry = require("@sentry/node");

// INTERNAL IMPORT
const path = require("path");
const logger = require("./logger");
const { errResponse } = require("../utils/response");
const { session, checkSessionCookie } = require("../middlewares/authenticator");
const cors = require("../middlewares/authorizer");
const HTTPrequestLogger = require("../middlewares/logger");
const queryParser = require("../middlewares/parser");

// CONSTANT
const fileName = path.basename(__filename, ".js");

module.exports = () => {
  const app = express();

  // CONFIG
  require("./monitoring")(app);
  app.set("trust proxy", 1);

  // MIDDLEWARE
  app.use(
    Sentry.Handlers.requestHandler(),
    Sentry.Handlers.tracingHandler(),
    session,
    cors,
    express.urlencoded({ extended: false }),
    express.json(),
    queryParser,
    HTTPrequestLogger
  );

  // ROUTING
  require("../User/route")(app);
  require("../Quiz/route")(app);
  require("../LeaderBoard/route")(app);
  app.use(checkSessionCookie);
  require("../History/route")(app);
  require("../Notice/route")(app);

  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND);
    res.json(
      errResponse({
        message: `${req.method} ${req.url} API는 존재하지 않습니다.`,
      })
    );
  });

  // ERROR HANDLEING
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
