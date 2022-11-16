const service = require('./service');
const { StatusCodes } = require('http-status-codes');

const { errResponse, response } = require('../../config/response');
const { logger } = require('../../config/logger');

exports.login = async function (req, res) {
  const { username, password } = req.body;
  try {
    const result = await service.login(username, password);

    const message = `${username} 로그인`;
    logger.info(message);
    res.json(response(message, result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};