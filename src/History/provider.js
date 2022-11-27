const { StatusCodes } = require("http-status-codes");
const { pool } = require('../../config/database');
const dao = require('./dao');

exports.optionCheck = async function (questionSeq, optionSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectOptionSeqParams = [questionSeq, optionSeq];
  const result = await dao.selectOptionSeq(connection, selectOptionSeqParams);
  connection.release();

  return result;
};

exports.getHitCount = async function (userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectHitCount(connection, userSeq);
  connection.release();

  return result;
};

exports.getUserOptionBulk = async function (categorySeq, chapterSeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectUserOptionBulkParams = [categorySeq, chapterSeq, userSeq];
  const rows = await dao.selectUserOptionBulk(connection, selectUserOptionBulkParams);

  if (!rows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  connection.release();

  return result;
};