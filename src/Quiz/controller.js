const { response } = require('../modules/response');
const provider = require('./provider');

exports.getCategories = async function (req, res) {
  const result = await provider.getCategories();
  res.json(response(null, result));
};

exports.getMaxChapter = async function (req, res) {
  const { categorySeq } = req.query;

  const result = await provider.getMaxChapter(categorySeq);
  res.json(response(null, result));
};

exports.getQuestions = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;

  const result = await provider.getQuestions(categorySeq, chapterNum);
  res.json(response(null, result));
};

exports.getOptions = async function (req, res) {
  const { questionSeq } = req.query;

  const result = await provider.getOptions(questionSeq);
  res.json(response(null, result));
};