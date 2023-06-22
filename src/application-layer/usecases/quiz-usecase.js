const { StatusCodes } = require("http-status-codes");

// CONSTNAT
const MAX_QUESTION_COUNT = 3;

module.exports = (repository, database) => {
  return Object.freeze({
    getChapter,
    getQuiz,
    postQuiz,
    putQuiz,
  });

  async function getChapter(keyword) {
    const result = keyword
      ? await repository.selectChapterByKeyword(keyword)
      : await repository.selectChapter();

    if (!result.length) {
      const err = new Error("데이터가 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function getQuiz(categorySeq, chapterNum) {
    const result = await repository.selectQuiz(categorySeq, chapterNum);

    if (!result.length) {
      const err = new Error("데이터가 존재하지 않습니다.");
      err.status = StatusCodes.NOT_FOUND;
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  async function postQuiz(categorySeq, question, questionSub, optionArray) {
    const [questionRow] = await repository.selectQuestionSeqByText(question);

    if (questionRow) {
      const err = new Error("중복된 데이터입니다.");
      err.status = StatusCodes.METHOD_NOT_ALLOWED;
      return Promise.reject(err);
    }

    const pool = await database.get();
    const connection = await pool.getConnection();

    // 챕터일련번호 조회
    const [maxChapterRow] = await repository.selectMaxChapterByCategory(
      categorySeq
    );
    let { chapterSeq, maxChapterNum } = maxChapterRow;
    const { questionCount } = maxChapterRow;

    try {
      await connection.beginTransaction();

      // 질문개수가 초과될 시 +1 채번
      if (questionCount === MAX_QUESTION_COUNT) {
        maxChapterNum += 1;

        const newChapterRow = await repository.insertChapterSeq(connection, [
          categorySeq,
          maxChapterNum,
        ]);
        chapterSeq = newChapterRow.insertId;

        await repository.insertQuestionCount(
          connection,
          chapterSeq,
          categorySeq
        );
      }

      const newQuestionRow = await repository.insertQuestion(connection, [
        question,
        questionSub,
        chapterSeq,
      ]);

      await Promise.all([
        repository.insertOptionArray(
          connection,
          optionArray,
          newQuestionRow.insertId
        ),
        repository.updateQuestionCount(connection, questionCount, chapterSeq),
      ]);

      await connection.commit();

      return Promise.resolve({
        categorySeq,
        chapterNum: maxChapterNum,
        questionSeq: newQuestionRow.insertId,
        questionCount,
      });
    } catch (err) {
      await connection.rollback();

      return Promise.reject(err);
    } finally {
      connection.release();
    }
  }

  async function putQuiz(questionSeq, question, questionSub, optionArray) {
    const [[questionRow], [chapterRow]] = await Promise.all([
      repository.selectQuestionSeqByNumber(questionSeq),
      repository.selectChapterByNumber(questionSeq),
    ]);

    if (!questionRow) {
      const err = new Error("데이터가 존재하지 않습니다.");
      err.status = StatusCodes.BAD_REQUEST;
      return Promise.reject(err);
    }

    const pool = await database.get();
    const connection = await pool.getConnection();

    const { categorySeq, chapterNum, chapterSeq, questionCount } = chapterRow;

    try {
      await Promise.all([
        repository.updateQuestion(connection, [
          question,
          questionSub,
          questionSeq,
        ]),
        repository.updateOptionArray(connection, optionArray, questionSeq),
        repository.updateQuestionCount(connection, questionCount, chapterSeq),
      ]);

      return Promise.resolve({
        categorySeq,
        chapterNum,
      });
    } catch (err) {
      await connection.rollback();

      return Promise.reject(err);
    } finally {
      connection.release();
    }
  }
};
