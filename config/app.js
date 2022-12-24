const express = require("express");
const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const path = require("path");
const { logger } = require("./logger");
const { errResponse } = require("../src/modules/response");
const authenticate = require("../src/middleware/authentication");
const fileName = path.basename(__filename, ".js");

module.exports = function () {
  const app = express();

  app.use(
    require("../src/middleware/session"),
    require("../src/middleware/cors"),
    express.urlencoded({ extended: false }),
    express.json(),
    require("../src/middleware/morgan")
  );

  require("../src/User/route")(app);
  require("../src/Quiz/route")(app);
  require("../src/LeaderBoard/route")(app);
  app.use(authenticate);
  require("../src/History/route")(app);

  app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    err.status = StatusCodes.NOT_FOUND;
    next(err);
  });

  app.use((err, req, res, next) => {
    logger.error(`[${fileName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  });

  return app;
};
