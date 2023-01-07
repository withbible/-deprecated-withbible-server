const express = require("express");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("./logger");
const { errResponse } = require("../modules/response");
const authenticate = require("../middlewares/authentication");

// CONSTANT
const fileName = path.basename(__filename, ".js");

module.exports = function () {
  const app = express();

  // MIDDLEWARE
  app.use(
    require("../middlewares/session"),
    require("../middlewares/cors"),
    express.urlencoded({ extended: false }),
    express.json(),
    require("../middlewares/morgan")
  );

  // ROUTING
  require("../User/route")(app);
  require("../Quiz/route")(app);
  require("../LeaderBoard/route")(app);
  app.use(authenticate);
  require("../History/route")(app);

  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND);
    res.json(errResponse(`${req.method} ${req.url} API는 존재하지 않습니다.`));
  });

  // ERROR HANDLEING
  app.use((err, req, res) => {
    logger.error(`[${fileName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  });

  process.on("uncaughtException", (err) => {
    logger.error(`[${fileName}]_${err.message}`);
  });

  return app;
};
