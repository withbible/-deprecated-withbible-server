const { pool } = require("../../config/database");
const dao = require('./dao');

exports.getCategories = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectCategories(connection);
  connection.release();

  return result;
};

exports.getMaxChapter = async function (categorySeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  if (categorySeq)
    result = await dao.searchMaxChapter(connection, categorySeq);
  else
    result = await dao.selectMaxChapter(connection);

  connection.release();

  return result;
};

exports.getChapter = async function (keyword) {
  const connection = await pool.getConnection(async (conn) => conn);

  if(keyword)
    result = await dao.searchChapter(connection, keyword);
  else
    result = await dao.selectChapter(connection);

  connection.release();

  return result;
};

exports.getQuestions = async function (categorySeq, chapterNum) {
  const connection = await pool.getConnection(async (conn) => conn);

  const offset = chapterNum * 3;
  const selectQuestionParams = [categorySeq, offset];
  const result = await dao.selectQuestions(connection, selectQuestionParams);
  connection.release();

  return result;
};

exports.getOptions = async function (questionSeq) {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await dao.selectQptions(connection, questionSeq);
  connection.release();

  return result;
};