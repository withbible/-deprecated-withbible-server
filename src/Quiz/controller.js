const { StatusCodes } = require("http-status-codes");
const { logger } = require("../../config/logger");
const { response, errResponse } = require("../modules/response");
const provider = require("./provider");
const service = require("./service");

exports.getChapter = async function (req, res) {
  const { keyword } = req.query;

  try {
    const result = await provider.getChapter(keyword);
    res.json(response(null, result));
  } catch (err) {
    logger.error(err.message);
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
    logger.error(err.message);
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

  try{
    const result = await service.postQuiz(
      categorySeq,
      question,
      bulk
    );

    res.status(StatusCodes.CREATED);
    res.json(response("퀴즈 생성 완료", result));
  } catch(err){
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};