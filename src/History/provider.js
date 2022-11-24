const { pool } = require('../../config/database');
const dao = require('./dao');

exports.getUserOption = async function (questionSeq, userID) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectHistoryParams = [questionSeq, userID];
  const result = await dao.selectUserOption(connection, selectHistoryParams);
  connection.release();

  return result;
};

exports.optionCheck = async function (questionSeq, optionSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectOptionSeqParams = [questionSeq, optionSeq];
  const result = await dao.selectOptionSeq(connection, selectOptionSeqParams);
  connection.release();

  return result;
};

exports.getHitCount = async function (userID) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectHitCount(connection, userID);
  connection.release();

  return result;
};