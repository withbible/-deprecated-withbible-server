const { pool } = require('../../config/database');
const dao = require('./dao');

exports.getHistory = async function (questionID, userID) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectHistoryParams = [questionID, userID];
  const result = await dao.selectHistory(connection, selectHistoryParams);
  connection.release();

  return result;
};

exports.optionCheck = async function (questionID, optionID) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectOptionParams = [questionID, optionID];
  const result = await dao.selectOptionID(connection, selectOptionParams);
  connection.release();

  return result;
};