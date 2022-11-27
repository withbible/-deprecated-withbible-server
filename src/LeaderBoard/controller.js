const { response } = require('../modules/response');
const provider = require('./provider');

exports.getLeaderBoard = async function (req, res) {
  const result = await provider.getLeaderBoard();
  res.json(response(null, result));
};