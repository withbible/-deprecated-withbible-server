const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const dao = require("./dao");

exports.getHitCount = async function (categorySeq, chapterNum, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectHitCountParams = [categorySeq, chapterNum, userSeq];
  const [result] = await dao.selectHitCount(connection, selectHitCountParams);
  connection.release();

  return result;
};

exports.getUserOptionBulk = async function (categorySeq, chapterNum, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectUserOptionBulkParams = [categorySeq, chapterNum, userSeq];
  const result = await dao.selectUserOptionBulk(
    connection,
    selectUserOptionBulkParams
  );
  connection.release();

  return result;
};

exports.getActiveChapterCount = async function (categorySeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectActiveChapterCountParams = [userSeq, categorySeq];
  const [result] = await dao.selectActiveChapterCount(
    connection,
    selectActiveChapterCountParams
  );
  connection.release();

  return result;
};

exports.getActiveChapter = async function (categorySeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  if (!categorySeq) {
    result = await dao.selectActiveChapter(connection, userSeq);
  } else {
    const selectActiveChapterParams = [userSeq, categorySeq];
    result = await dao.searchActiveChapter(
      connection,
      selectActiveChapterParams
    );
  }

  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getActiveChapterPage = async function (limit, page, userSeq) {
  if (!limit || !page) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const offset = (page - 1) * limit;
  const selectActiveChapterPageParams = [userSeq, parseInt(limit), offset];

  const result = await dao.selectActiveChapterPage(
    connection,
    selectActiveChapterPageParams
  );

  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getActiveCategory = async function (userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectActiveCategory(connection, userSeq);
  connection.release();

  return Promise.resolve(result);
};
