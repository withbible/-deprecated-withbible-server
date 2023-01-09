const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const provider = require("./provider");
const dao = require("./dao");

const MAX_QUESTION_COUNT = 3;

exports.postQuiz = async function (categorySeq, question, bulk) {
  const questionRow = await provider.getQuestionSeqByText(question);

  if (questionRow) {
    const err = new Error("중복된 데이터입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  // 챕터일련번호 조회
  const maxChapterRow = await provider.getMaxChapterSeq(categorySeq);
  let { chapterSeq, maxChapterNum } = maxChapterRow;

  try {
    await connection.beginTransaction();

    // 질문갯수가 초과될 시 +1 채번
    if (maxChapterRow.questionCount === MAX_QUESTION_COUNT) {
      maxChapterNum += 1;

      const newChapterRow = await dao.insertChapterSeq(connection, [
        categorySeq,
        maxChapterNum,
      ]);
      chapterSeq = newChapterRow.insertId;
    }

    const newQuestionRow = await dao.insertQuestion(connection, [
      question,
      chapterSeq,
    ]);

    await dao.insertOptionBulk(connection, bulk, newQuestionRow.insertId);
    await connection.commit();

    return Promise.resolve({
      categorySeq,
      chapterNum: maxChapterNum,
    });
  } catch (err) {
    await connection.rollback();

    return Promise.reject(err);
  } finally {
    connection.release();
  }
};

exports.putQuiz = async function (questionSeq, newQuestion, bulk) {
  const [questionRow, chapterRow] = await Promise.all([
    await provider.getQuestionSeqByNumber(questionSeq),
    await provider.getChapterByNumber(questionSeq),
  ]);

  if (!questionRow) {
    const err = new Error("데이터가 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  await Promise.all([
    dao.updateQuestion(connection, [newQuestion, questionSeq]),
    dao.updateOption(connection, bulk, questionSeq),
  ]);

  connection.release();

  return Promise.resolve({
    categorySeq: chapterRow.categorySeq,
    chapterNum: chapterRow.chapterNum,
  });
};
