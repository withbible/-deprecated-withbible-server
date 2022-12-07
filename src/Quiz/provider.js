const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const dao = require("./dao");

exports.getCategories = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectCategories(connection);
  connection.release();

  return result;
};

exports.getMaxChapter = async function (categorySeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  if (categorySeq) {
    result = await dao.searchMaxChapter(connection, categorySeq);
  } else {
    result = await dao.selectMaxChapter(connection);
  }

  connection.release();

  return result;
};

exports.getChapter = async function (keyword) {
  const connection = await pool.getConnection(async (conn) => conn);

  if (keyword) {
    result = await dao.searchChapter(connection, keyword);
  } else {
    result = await dao.selectChapter(connection);
  }

  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  // TODO: JSON_ARRAYAGG 집계시 중복 제거도 해온다면 best
  for (const each of result)
    each["chapter_seq_array"] = [...new Set(each["chapter_seq_array"])];

  return result;
};

exports.getQuiz = async function (categorySeq, chapterSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectQuizParams = [categorySeq, chapterSeq];
  const result = await dao.selectQuiz(connection, selectQuizParams);
  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  return result;
};
