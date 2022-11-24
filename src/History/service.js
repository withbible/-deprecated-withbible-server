const { StatusCodes } = require("http-status-codes");
const { pool } = require("../../config/database");
const quizProvider = require('../Quiz/provider');
const provider = require('./provider');
const dao = require('./dao');

exports.postUserOption = async function (questionSeq, selectOptionSeq, userID) {
  const historyRows = await provider.getUserOption(questionSeq, userID);

  if (historyRows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const optionRows = await provider.optionCheck(questionSeq, selectOptionSeq);

  if (!optionRows.length) {
    const err = new Error("선택한 옵션이 적절하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const insertUserOptionParams = [questionSeq, selectOptionSeq, userID];
  await dao.insertUserOption(connection, insertUserOptionParams);
  connection.release();

  return Promise.resolve();
};

exports.putUserOption = async function (questionSeq, selectOptionSeq, userID) {
  const historyRows = await provider.getUserOption(questionSeq, userID);

  if (!historyRows.length) {
    const err = new Error("해당 퀴즈가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const optionRows = await provider.optionCheck(questionSeq, selectOptionSeq);

  if (!optionRows.length) {
    const err = new Error("선택한 옵션이 적절하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const updateUserOptionParams = [selectOptionSeq, questionSeq, userID];
  await dao.updateUserOption(connection, updateUserOptionParams);
  connection.release();

  return Promise.resolve();
};