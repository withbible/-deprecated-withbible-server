const { StatusCodes } = require("http-status-codes");
const { pool } = require("../../config/database");
const provider = require('./provider');
const dao = require('./dao');

exports.postHistory = async function (questionID, selectOptionID, userID) {
  const historyRows = await provider.getHistory(questionID, userID);

  if (historyRows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const insertHistoryParams = [questionID, selectOptionID, userID];
  await dao.insertHistory(connection, insertHistoryParams);
  connection.release();

  return Promise.resolve();
};