const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const dao = require("./dao");

exports.getLeaderBoard = async () => {
  const pool = await require("../configs/database").get();
  const result = await dao.selectLeaderBoard(pool);

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getLeaderBoardPage = async (limit, page, lastPage) => {
  if (!limit || !page || page > lastPage) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const pool = await require("../configs/database").get();
  const offset = (page - 1) * limit;
  const selectLeaderBoardParams = [limit, offset];

  const result = await dao.selectLeaderBoardPage(pool, selectLeaderBoardParams);

  return Promise.resolve(result);
};

exports.getTotalCount = async () => {
  const pool = await require("../configs/database").get();
  const [rows] = await dao.selectTotalCount(pool);
  const result = rows.totalCount;

  return Promise.resolve(result);
};
