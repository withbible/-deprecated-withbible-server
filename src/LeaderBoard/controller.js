//INTERNAL IMPORT
const path = require("path");
const { logger } = require("../../config/logger");
const { response, errResponse } = require('../modules/response');
const provider = require('./provider');
const dirName = path.basename(__dirname);

exports.getLeaderBoard = async function (req, res) {
  const { limit, page } = req.query;

  try{
    const result = await provider.getLeaderBoard(limit, page);
    res.json(response(null, result));
  }catch(err){
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};