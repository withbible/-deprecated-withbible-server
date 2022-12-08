const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const dao = require("./dao");

exports.getHitCount = async function (categorySeq, chapterSeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectHitCountParams = [
    categorySeq,
    chapterSeq,
    categorySeq,
    chapterSeq,
    userSeq,
  ];
  const [result] = await dao.selectHitCount(connection, selectHitCountParams);
  connection.release();

  return result;
};

exports.getUserOptionBulk = async function (categorySeq, chapterSeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectUserOptionBulkParams = [categorySeq, chapterSeq, userSeq];
  const result = await dao.selectUserOptionBulk(
    connection,
    selectUserOptionBulkParams
  );
  connection.release();

  return result;
};
