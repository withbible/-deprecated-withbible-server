const { StatusCodes } = require('http-status-codes');
const { logger } = require('../../config/logger');
const { response, errResponse } = require('../modules/response');
const provider = require('./provider');
const service = require('./service');

exports.getHistory = async function (req, res) {
  const { questionID, userID } = req.body;

  const result = await provider.getHistory(questionID, userID);
  res.json(response(null, result));
};

exports.postHistory = async function (req, res) {
  const { questionID, selectOptionID, userID } = req.body;

  try{
    const result = await service.postHistory(questionID, selectOptionID, userID);
    res.status(StatusCodes.CREATED);
    res.json(response(null, result));

  }catch(err){
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};