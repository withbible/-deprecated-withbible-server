require("dotenv").config();
const express = require("express");
const Sentry = require("@sentry/node");
const { StatusCodes: statusCodes } = require("http-status-codes");

require("../external-services/session-storage").init();
require("../external-services/realtime-statistic").init();
require("../external-services/push-notification").init();
require("../external-services/database").init();
const {
  handleErrorMiddleware,
  authenticatorMiddleware,
  authorizerMiddleware,
  parserMiddleware,
  httpRequestLoggerMiddleware,
} = require("../../presentation-layer/middlewares");
const {
  leaderBoardRoute,
  userRoute,
  historyRoute,
  quizRoute,
} = require("../../presentation-layer/routes");

const app = express();
require("../external-services/monitoring").init(app);

app.use(
  Sentry.Handlers.requestHandler(),
  Sentry.Handlers.tracingHandler(),
  authenticatorMiddleware.session,
  authorizerMiddleware.cors,
  parserMiddleware.queryParser,
  parserMiddleware.bodyParser,
  httpRequestLoggerMiddleware.morgan
);

app.use("/leader-board", leaderBoardRoute);
app.use("/user", userRoute);
app.use("/history", historyRoute);
app.use("/quiz", quizRoute);

app.use(handleErrorMiddleware.handleErrorRoute);
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError: (err) =>
      !!(
        err.status === statusCodes.NOT_FOUND ||
        err.status === statusCodes.INTERNAL_SERVER_ERROR
      ),
  })
);
app.use(handleErrorMiddleware.handleErrorModule);

module.exports = app;
