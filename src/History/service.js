const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const provider = require("./provider");
const dao = require("./dao");

exports.getUserOptionBulk = async function (categorySeq, chapterSeq, userSeq) {
  const rows = await provider.getUserOptionBulk(
    categorySeq,
    chapterSeq,
    userSeq
  );

  if (!rows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return rows;
};

exports.postUserOptionBulk = async function (
  categorySeq,
  chapterSeq,
  userSeq,
  bulk
) {
  const rows = await provider.getUserOptionBulk(
    categorySeq,
    chapterSeq,
    userSeq
  );

  if (rows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  await dao.insertUserOptionBulk(connection, bulk, userSeq);
  connection.release();

  return Promise.resolve();
};

exports.putUserOptionBulk = async function (
  categorySeq,
  chapterSeq,
  userSeq,
  bulk
) {
  const rows = await provider.getUserOptionBulk(
    categorySeq,
    chapterSeq,
    userSeq
  );

  if (!rows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  await dao.updateUserOptionBulk(connection, bulk, userSeq);
  connection.release();

  return Promise.resolve();
};
