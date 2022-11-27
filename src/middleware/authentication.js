const { StatusCodes } = require('http-status-codes');
const { errResponse } = require('../modules/response');

const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    res.status(StatusCodes.UNAUTHORIZED);
    return res.json(errResponse("권한이 없습니다."));
  }

  next();
}

module.exports = authenticate;