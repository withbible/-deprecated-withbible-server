const path = require("path");

const fileName = path.basename(__filename, ".js");

module.exports = ({ statusCodes, errResponse, logger }) => {
  return Object.freeze({
    handleErrorRoute,
    handleErrorModule,
  });

  function handleErrorRoute(req, res) {
    res.status(statusCodes.NOT_FOUND);
    return res.json(
      errResponse({
        message: `${req.method} ${req.url} API는 존재하지 않습니다.`,
      })
    );
  }

  function handleErrorModule(err, req, res) {
    logger.error(`[${fileName}]_${err.message}`);

    res.status(err.status);
    return res.json(errResponse({ message: err.message }));
  }
};
