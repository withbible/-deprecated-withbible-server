const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const pool = require("../configs/database");
const dao = require("./dao");

exports.getLeaderBoard = async function () {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectLeaderBoard(connection);
  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getLeaderBoardPage = async function (limit, page, lastPage) {
  if (!limit || !page || page > lastPage) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const offset = (page - 1) * limit;
  const selectLeaderBoardParams = [limit, offset];

  const result = await dao.selectLeaderBoardPage(
    connection,
    selectLeaderBoardParams
  );
  connection.release();

  return Promise.resolve(result);
};

exports.getTotalCount = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const rows = await dao.selectTotalCount(connection);
  connection.release();

  const result = rows[0].totalCount;
  return Promise.resolve(result);
};
