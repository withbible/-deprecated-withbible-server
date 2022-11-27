const { StatusCodes } = require('http-status-codes');
const { logger } = require('../../config/logger');
const { errResponse, response } = require('../modules/response');
const service = require('./service');

exports.postUser = async function (req, res) {
  const { userID, password, userName } = req.body;

  try {
    const result = await service.postUser(userID, password, userName);

    const message = `추가된 회원 : ${result.userID}`;
    logger.info(message);
    res.status(StatusCodes.CREATED);
    res.json(response(message, result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.login = async function (req, res) {
  const { userID, password } = req.body;

  try {
    const result = await service.login(userID, password);

    req.session.user = {
      ...result,
      isLogined: true
    };

    const message = `${userID} 로그인`;
    logger.info(message);
    res.json(response(message, result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.loginCheck = async function (req, res) {
  if (req.session.user.isLogined) {
    // TODO: 세션 만료 시간 업데이트
    res.json(response("세션이 유효합니다."));

  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json(errResponse("세션이 만료되었습니다."));
  }
};

exports.logout = async function (req, res) {
  if (!req.session.user.isLogined) {
    return res.json(response("세션이 존재하지 않습니다."));
  }

  req.session.destroy((err) => {
    if (err) {
      logger.error(err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(errResponse(err.message));

    } else {
      res.clearCookie('loginData');
      res.json(response("로그아웃 되었습니다."));
    }
  })
};