const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const path = require("path");
const { logger } = require("../../config/logger");
const { response, errResponse } = require("../modules/response");
const provider = require("./provider");
const service = require("./service");
const dirName = path.basename(__dirname);

exports.getChapter = async function (req, res) {
  const { keyword } = req.query;

  try {
    const result = await provider.getChapter(keyword);
    res.json(response(null, result));
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
    res.json(response(null, result));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

/**
 *  "bulk": [
      {
        "question_option": "",
        "answer_yn": 1
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
 *  "bulk": [
      {
        "question_option_seq": 1,
        "question_option": "",
        "answer_yn": 1
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
