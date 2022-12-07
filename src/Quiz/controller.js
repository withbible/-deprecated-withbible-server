const { logger } = require("../../config/logger");
const { response, errResponse } = require("../modules/response");
const provider = require("./provider");

exports.getCategories = async function (req, res) {
  const result = await provider.getCategories();
  res.json(response(null, result));
};

exports.getMaxChapter = async function (req, res) {
  const { categorySeq } = req.query;

  const result = await provider.getMaxChapter(categorySeq);
  res.json(response(null, result));
};

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
  const { categorySeq, chapterSeq } = req.query;

  try {
    const result = await provider.getQuiz(categorySeq, chapterSeq);
    res.json(response(null, result));
  } catch (err) {
    logger.error(err.message);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};
