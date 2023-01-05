// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../../config/logger");
const { response, errResponse } = require("../modules/response");
const provider = require("./provider");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getLeaderBoard = async function (req, res) {
  try {
    const result = await provider.getLeaderBoard();
    const meta = {
      count: result.length,
    };

    res.json(response("사용자별 순위 전체조회 완료", result, meta));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.getLeaderBoardPage = async function (req, res) {
  const { limit, page } = req.query;

  try {
    const result = await provider.getLeaderBoardPage(limit, page);
    const meta = {
      count: result.length,
    };

    res.json(response("사용자별 순위 부분조회 완료", result, meta));
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};
