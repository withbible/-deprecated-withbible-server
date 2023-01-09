const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { errResponse } = require("../modules/response");

const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.status(StatusCodes.UNAUTHORIZED);
    return res.json(errResponse({ message: "권한이 없습니다." }));
  }

  return next();
};

module.exports = authenticate;
