const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const poolPromise = require("../configs/database");
const dao = require("./dao");

exports.getChapter = async (keyword) => {
  const pool = await poolPromise;
  const result = keyword
    ? await dao.searchChapter(pool, keyword)
    : await dao.selectChapter(pool);

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getQuiz = async (categorySeq, chapterNum) => {
  const pool = await poolPromise;
  const result = await dao.selectQuiz(pool, [categorySeq, chapterNum]);

  if (!result.length) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getQuestionSeqByText = async (question) => {
  const pool = await poolPromise;
  const [result] = await dao.selectQuestionSeqByText(pool, question);

  return result;
};

exports.getQuestionSeqByNumber = async (questionSeq) => {
  const pool = await poolPromise;
  const [result] = await dao.selectQuestionSeqByNumber(pool, questionSeq);

  return result;
};

exports.getChapterByNumber = async (questionSeq) => {
  const pool = await poolPromise;
  const [result] = await dao.selectChapterByNumber(pool, questionSeq);

  return result;
};

exports.getChapterSeq = async (categorySeq, chapterNum) => {
  const pool = await poolPromise;
  const [result] = await dao.selectChapterSeq(pool, [categorySeq, chapterNum]);

  return result;
};

exports.getMaxChapterByCategory = async (categorySeq) => {
  const pool = await poolPromise;
  const [result] = await dao.selectMaxChapterByCategory(pool, categorySeq);

  return result;
};
