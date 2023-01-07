const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const dao = require("./dao");

exports.getHitCount = async function (categorySeq, chapterNum, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectHitCount(connection, [
    categorySeq,
    chapterNum,
    userSeq,
  ]);
  connection.release();

  if (!result) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getUserOptionBulk = async function (categorySeq, chapterNum, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectUserOptionBulk(connection, [
    categorySeq,
    chapterNum,
    userSeq,
  ]);
  connection.release();

  return Promise.resolve(result);
};

exports.getActiveChapterCount = async function (categorySeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectActiveChapterCount(connection, [
    userSeq,
    categorySeq,
  ]);
  connection.release();

  if (!result) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getActiveChapter = async function (categorySeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = categorySeq
    ? await dao.searchActiveChapter(connection, [userSeq, categorySeq])
    : await dao.selectActiveChapter(connection, userSeq);

  connection.release();

  if (!result.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.chapterNumArray = JSON.parse(each.chapterNumArray);
  });

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
  const result = await dao.selectActiveChapterPage(connection, [
    userSeq,
    parseInt(limit, 10),
    offset,
  ]);

  connection.release();

  if (!result.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.chapterDetail = JSON.parse(each.chapterDetail);
  });

  result.sort((a, b) => {
    return (
      a.categorySeq - b.categorySeq ||
      a.chapterDetail.chapterNum - b.chapterDetail.chapterNum
    );
  });

  return Promise.resolve(result);
};
