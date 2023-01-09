const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../configs/logger");
const { response, errResponse } = require("../modules/response");
const { CATEGORY, QUIZ_API_REFERENCE } = require("../constants/enum");
const provider = require("./provider");
const service = require("./service");
const { filterReferenceOther, filterReferenceMe } = require("../utils/util");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getChapter = async function (req, res) {
  const { keyword } = req.query;

  try {
    const result = await provider.getChapter(keyword);

    res.json(
      response({
        message: "카테고리별 검색어를 포함한 챕터수 조회 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#8e8515a0-c9f8-49c4-b629-42e623bdf151",
      })
    );
  }
};

exports.getQuiz = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;

  try {
    const result = await provider.getQuiz(categorySeq, chapterNum);

    res.json(
      response({
        message: `${CATEGORY[categorySeq]} ch.${chapterNum} 질문-선택지 전체조회 완료`,
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: filterReferenceMe(QUIZ_API_REFERENCE, req.method)[0],
      })
    );
  }
};

exports.postQuiz = async function (req, res) {
  const { categorySeq, question, bulk } = req.body;

  try {
    const result = await service.postQuiz(categorySeq, question, bulk);

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "퀴즈 생성 완료",
        meta: {
          links: filterReferenceOther(QUIZ_API_REFERENCE, req.method),
          ...result,
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: filterReferenceMe(QUIZ_API_REFERENCE, req.method)[0],
      })
    );
  }
};

exports.putQuiz = async function (req, res) {
  const { questionSeq, question, bulk } = req.body;

  try {
    const result = await service.putQuiz(questionSeq, question, bulk);

    res.json(
      response({
        message: "퀴즈 수정 완료",
        meta: {
          links: filterReferenceOther(QUIZ_API_REFERENCE, req.method),
          ...result,
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: filterReferenceMe(QUIZ_API_REFERENCE, req.method)[0],
      })
    );
  }
};
