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

exports.getHitCount = async function (categorySeq, maxChapterNum) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectHitCountParams = [categorySeq, maxChapterNum];
  const result = await dao.selectHitCount(connection, selectHitCountParams);
  connection.release();

  return result;
};