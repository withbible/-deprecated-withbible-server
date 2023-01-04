const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../../config/database");
const dao = require("./dao");

exports.getChapter = async function (keyword) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = keyword
    ? await dao.searchChapter(connection, keyword)
    : await dao.selectChapter(connection);

  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  /**
   * @todo mariaDB 10.6에서 개선됨. 현 클라우드 제공되는 버전은 10.5
   */
  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.chapter_num_array = JSON.parse(each.chapter_num_array);
  });

  return Promise.resolve(result);
};

exports.getQuiz = async function (categorySeq, chapterNum) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectQuizParams = [categorySeq, chapterNum];
  const result = await dao.selectQuiz(connection, selectQuizParams);
  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.option_array = JSON.parse(each.option_array);
  });

  return Promise.resolve(result);
};

exports.getQuestion = async function (question) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectQuestion(connection, question);
  connection.release();

  return result;
};

exports.getQuestionSeq = async function (questionSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectQuestionSeq(connection, questionSeq);
  connection.release();

  return result;
};

exports.getChapterSeq = async function (categorySeq, chapterNum) {
  const connection = await pool.getConnection(async (conn) => conn);

  const selectChapterSeqParams = [categorySeq, chapterNum];
  const [result] = await dao.selectChapterSeq(
    connection,
    selectChapterSeqParams
  );
  connection.release();

  return result;
};

exports.getMaxChapterSeq = async function (categorySeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectMaxChapterSeq(connection, categorySeq);
  connection.release();

  return result;
};
