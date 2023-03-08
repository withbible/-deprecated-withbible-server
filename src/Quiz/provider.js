const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const pool = require("../configs/database");
const dao = require("./dao");

exports.getChapter = async function (keyword) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = keyword
    ? await dao.searchChapter(connection, keyword)
    : await dao.selectChapter(connection);

  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  /**
   * @todo mariaDB 10.6에서 개선됨. 현 클라우드 제공되는 버전은 10.5
   */
  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.chapterNumArray = [...new Set(JSON.parse(each.chapterNumArray))];
  });

  return Promise.resolve(result);
};

exports.getQuiz = async function (categorySeq, chapterNum) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectQuiz(connection, [categorySeq, chapterNum]);
  connection.release();

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.optionArray = JSON.parse(each.optionArray);
  });

  return Promise.resolve(result);
};

exports.getQuestionSeqByText = async function (question) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectQuestionSeqByText(connection, question);
  connection.release();

  return result;
};

exports.getQuestionSeqByNumber = async function (questionSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectQuestionSeqByNumber(connection, questionSeq);
  connection.release();

  return result;
};

exports.getChapterByNumber = async function (questionSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectChapterByNumber(connection, questionSeq);
  connection.release();

  return result;
};

exports.getChapterSeq = async function (categorySeq, chapterNum) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectChapterSeq(connection, [
    categorySeq,
    chapterNum,
  ]);
  connection.release();

  return result;
};

exports.getMaxChapterByCategory = async function (categorySeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectMaxChapterByCategory(
    connection,
    categorySeq
  );
  connection.release();

  return result;
};
