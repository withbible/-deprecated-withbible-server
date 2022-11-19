const { StatusCodes } = require('http-status-codes');
const { logger } = require('../../config/logger');
const { errResponse, response } = require('../modules/response');
const service = require('./service');

exports.postUsers = async function (req, res) {
  const { userID, password, name } = req.body;

  try {
    const result = await service.postUser(userID, password, name);

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

    const message = `${userID} 로그인`;
    logger.info(message);
    res.json(response(message, result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};