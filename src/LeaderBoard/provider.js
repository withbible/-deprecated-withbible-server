const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const poolPromise = require("../configs/database");
const dao = require("./dao");

exports.getLeaderBoard = async () => {
  const pool = await poolPromise;
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

  const pool = await poolPromise;
  const offset = (page - 1) * limit;
  const selectLeaderBoardParams = [limit, offset];

  const result = await dao.selectLeaderBoardPage(pool, selectLeaderBoardParams);

  return Promise.resolve(result);
};

exports.getTotalCount = async () => {
  const pool = await poolPromise;
  const rows = await dao.selectTotalCount(pool);
  const result = rows[0].totalCount;

  return Promise.resolve(result);
};
