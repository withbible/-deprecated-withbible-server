const { pool } = require('../../config/database');
const dao = require('./dao');

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

exports.getUserOptionBulk = async function (categorySeq, chapterSeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectUserOptionBulkParams = [categorySeq, chapterSeq, userSeq];
  const result = await dao.selectUserOptionBulk(connection, selectUserOptionBulkParams);
  connection.release();

  return result;
};