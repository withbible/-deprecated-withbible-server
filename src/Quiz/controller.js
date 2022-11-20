const { response } = require('../modules/response');
const provider = require('./provider');

exports.getCategory = async function (req, res) {
  const result = await provider.getCategory();
  res.json(response(null, result));
};

exports.getChapter = async function (req, res) {
  const { categoryID } = req.query;

  const result = await provider.getChapter(categoryID);
  res.json(response(null, result));
};

exports.getQuestion = async function (req, res) {
  const { categoryID, chapter } = req.query;

  const result = await provider.getQuestion(categoryID, parseInt(chapter));
  res.json(response(null, result));
};

exports.getOption = async function (req, res) {
  const { questionID } = req.query;

  const result = await provider.getOption(questionID);
  res.json(response(null, result));
};