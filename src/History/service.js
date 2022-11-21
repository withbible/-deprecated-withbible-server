const { StatusCodes } = require("http-status-codes");
const { pool } = require("../../config/database");
const provider = require('./provider');
const dao = require('./dao');

exports.postHistory = async function (questionID, selectOptionID, userID) {
  const historyRows = await provider.getHistory(questionID, userID);

  if (historyRows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const optionRows = await provider.optionCheck(questionID, selectOptionID);

  if (!optionRows.length) {
    const err = new Error("선택한 옵션이 적절하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const insertHistoryParams = [questionID, selectOptionID, userID];
  await dao.insertHistory(connection, insertHistoryParams);
  connection.release();

  return Promise.resolve();
};

exports.putHistory = async function (questionID, selectOptionID, userID) {
  const historyRows = await provider.getHistory(questionID, userID);

  if (!historyRows.length) {
    const err = new Error("해당 퀴즈가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const optionRows = await provider.optionCheck(questionID, selectOptionID);

  if (!optionRows.length) {
    const err = new Error("선택한 옵션이 적절하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const updateHistoryParams = [selectOptionID, questionID, userID];
  await dao.updateHistory(connection, updateHistoryParams);
  connection.release();

  return Promise.resolve();
};