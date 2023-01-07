const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../configs/logger");
const { response, errResponse } = require("../modules/response");
const { CATEGORY } = require("../constants/enum");
const provider = require("./provider");
const service = require("./service");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getChapter = async function (req, res) {
  const { keyword } = req.query;

  try {
    const result = await provider.getChapter(keyword);

    res.json(response("카테고리별 검색어를 포함한 챕터수 조회 완료", result));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.getQuiz = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;

  try {
    const result = await provider.getQuiz(categorySeq, chapterNum);

    res.json(
      response(
        `${CATEGORY[categorySeq]} ch.${chapterNum} 질문-선택지 전체조회 완료`,
        result
      )
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

/**
 * @example
 * "bulk": [
      {
        "questionOption": "",
        "answerYN": 1
      },
    ]
 */
exports.postQuiz = async function (req, res) {
  const { categorySeq, question, bulk } = req.body;

  try {
    const result = await service.postQuiz(categorySeq, question, bulk);

    res.status(StatusCodes.CREATED);
    res.json(response("퀴즈 생성 완료", result));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

/**
 * @example
 * "bulk": [
      {
        "questionOptionSeq": 1,
        "questionOption": "",
        "answerYN": 1
      },
    ]
 */
exports.putQuiz = async function (req, res) {
  const { questionSeq, question, bulk } = req.body;

  try {
    const result = await service.putQuiz(questionSeq, question, bulk);

    res.json(response("퀴즈 수정 완료", result));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};
