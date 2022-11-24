const { StatusCodes } = require('http-status-codes');
const { logger } = require('../../config/logger');
const { response, errResponse } = require('../modules/response');
const provider = require('./provider');
const service = require('./service');

exports.getUserOption = async function (req, res) {
  const { questionSeq, userID } = req.body;

  const result = await provider.getUserOption(questionSeq, userID);
  res.json(response(null, result));
};

exports.postUserOption = async function (req, res) {
  const { questionSeq, selectOptionID, userID } = req.body;

  try {
    const result = await service.postUserOption(questionSeq, selectOptionID, userID);

    res.status(StatusCodes.CREATED);
    res.json(response("퀴즈기록 생성 완료", result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.putUserOption = async function (req, res) {
  const { questionSeq, userID } = req.params;
  const { selectOptionID } = req.body;

  try {
    const result = await service.putUserOption(questionSeq, selectOptionID, userID);
    res.json(response("퀴즈기록 수정 완료", result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);

    res.json(errResponse(err.message));
  }
};

exports.getHitCount = async function (req, res) {
  const { categorySeq } = req.query;

  try {
    const result = await service.getHitCount(categorySeq);
    res.json(response(null, result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);

    res.json(errResponse(err.message));
  }
};