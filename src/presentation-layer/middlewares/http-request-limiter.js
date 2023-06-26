const rateLimit = require("express-rate-limit");
const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { errResponse } = require("../../utils/response");

// CONSTANT
const { MAX_REQUESTS } = process.env;

const option = {
  windowMs: 60 * 1000,
  max: MAX_REQUESTS,
  handler: (req, res) => {
    res.status(StatusCodes.TOO_MANY_REQUESTS);
    res.json(
      errResponse({
        message: `1분에 ${MAX_REQUESTS}번만 요청 할 수 있습니다.`,
      })
    );
  },
};

module.exports = rateLimit(option);
