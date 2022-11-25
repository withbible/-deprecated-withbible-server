const { StatusCodes } = require('http-status-codes');
const { logger } = require('../../config/logger');
const { response, errResponse } = require('../modules/response');
const provider = require('./provider');
const service = require('./service');

exports.getHitCount = async function (req, res) {
  // TODO: 세션에서 추출
  const userID = req.get('userID');  

  try {
    const result = await provider.getHitCount(userID);
    res.json(response(null, result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.getUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterSeq } = req.body;
  const { userSeq } = req.session.user;

  const result = await provider.getUserOptionBulk(categorySeq, chapterSeq, userSeq);
  res.json(response(null, result));
};

exports.postUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterSeq, bulk} = req.body;
  const { userSeq } = req.session.user;

  try {    
    const result = await service.postUserOptionBulk(categorySeq, chapterSeq, userSeq, bulk);

    res.status(StatusCodes.CREATED);
    res.json(response("퀴즈기록 생성 완료", result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.putUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterSeq, bulk} = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.putUserOptionBulk(categorySeq, chapterSeq, userSeq, bulk);
    res.json(response("퀴즈기록 수정 완료", result));

  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};