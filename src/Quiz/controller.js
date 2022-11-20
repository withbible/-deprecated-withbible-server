const { response } = require('../modules/response');
const provider = require('./provider');

exports.getCategory = async function (req, res) {
  const result = await provider.getCategory();
  res.json(response(null, result));
};

exports.getChapter = async function (req, res) {
  const { id } = req.query;

  const result = await provider.getChapter(id);  
  res.json(response(null, result));
};