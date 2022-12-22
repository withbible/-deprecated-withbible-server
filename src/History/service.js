const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const provider = require("./provider");
const quizProvider = require("../Quiz/provider");
const dao = require("./dao");

/**
 * Provider 계층의 Read의 데이터가 존재하지 않을시
 * Service 계층의 Read와 Create는 다르게 처리되기 때문에
 * Service 계층에 Read를 두었습니다.
 */
exports.getUserOptionBulk = async function (categorySeq, chapterNum, userSeq) {
  const rows = await provider.getUserOptionBulk(
    categorySeq,
    chapterNum,
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
  chapterNum,
  userSeq,
  bulk
) {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    await provider.getUserOptionBulk(categorySeq, chapterNum, userSeq),
    await quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  if (userOptionRows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const chapterSeq = chapterSeqRow["chapter_seq"];

  try {
    await dao.insertUserOptionBulk(connection, bulk, userSeq, chapterSeq);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }

  return Promise.resolve();
};

exports.putUserOptionBulk = async function (
  categorySeq,
  chapterNum,
  userSeq,
  bulk
) {
  const rows = await provider.getUserOptionBulk(
    categorySeq,
    chapterNum,
    userSeq
  );

  if (!rows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const chapterSeq = rows[0]["chapter_seq"];

  await dao.updateUserOptionBulk(connection, bulk, userSeq, chapterSeq);
  connection.release();

  return Promise.resolve();
};
