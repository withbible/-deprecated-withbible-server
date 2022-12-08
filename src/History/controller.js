const { StatusCodes } = require("http-status-codes");
const { logger } = require("../../config/logger");
const { response, errResponse } = require("../modules/response");
const provider = require("./provider");
const service = require("./service");

// TODO: 화면단에서 인증구현 이후 접근시 해제
const userSeq = 1;

exports.getHitCount = async function (req, res) {
  const { categorySeq, chapterSeq } = req.query;
  // const { userSeq } = req.session.user;

  try {
    const result = await provider.getHitCount(categorySeq, chapterSeq, userSeq);
    res.json(response("맞힌갯수 조회 완료", result));
  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.getUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterSeq } = req.query;
  // const { userSeq } = req.session.user;

  try {
    const result = await service.getUserOptionBulk(
      categorySeq,
      chapterSeq,
      userSeq
    );
    res.json(response("선택기록 조회 완료", result));
  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.postUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterSeq, bulk } = req.body;
  // const { userSeq } = req.session.user;

  try {
    const result = await service.postUserOptionBulk(
      categorySeq,
      chapterSeq,
      userSeq,
      bulk
    );

    res.status(StatusCodes.CREATED);
    res.json(response("선택기록 생성 완료", result));
  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.putUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterSeq, bulk } = req.body;
  // const { userSeq } = req.session.user;

  try {
    const result = await service.putUserOptionBulk(
      categorySeq,
      chapterSeq,
      userSeq,
      bulk
    );
    res.json(response("선택기록 수정 완료", result));
  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};
