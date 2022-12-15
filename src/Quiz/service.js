//INTERNAL IMPORT
const { pool } = require("../../config/database");
const provider = require("./provider");

const MAX_QUESTION_COUNT = 3;

exports.postQuiz = async function (categorySeq, question, bulk) {
  const connection = await pool.getConnection(async (conn) => conn);
  const maxChapterRow = await provider.getMaxChapterSeq(categorySeq);

  let chapterSeq = maxChapterRow["chapter_seq"];

  try {
    await connection.beginTransaction();

    if (maxChapterRow["question_count"] === MAX_QUESTION_COUNT) {
      const newChapterNum = maxChapterRow["max_chapter_num"] + 1;

      const chapterQuery = `
        INSERT INTO quiz_chapter
          (category_seq, chapter_num)
        VALUES
          (?, ?);
      `;

      const [newChapterRow] = await connection.query(chapterQuery, [
        categorySeq,
        newChapterNum,
      ]);
      chapterSeq = newChapterRow.insertId;
    }
        
    const questionQuery = `
      INSERT INTO quiz_question
        (question, chapter_seq)
      VALUES
        (?, ?);
    `;

    const [newQuestionRow] = await connection.query(questionQuery, [
      question,
      chapterSeq,
    ]);

    let optionQuery = `
      INSERT INTO quiz_question_option
        (question_seq, question_option, answer_yn)
      VALUES
    `;

    const arr = [];

    for (const each of bulk) {
      arr.push(
        `(
          ${newQuestionRow.insertId}, 
          ${each["question_option"]}, 
          ${each["answer_yn"]}
        )`
      );
    }

    optionQuery += arr.join();
    optionQuery += ";";

    await connection.query(optionQuery);
    await connection.commit();

    return Promise.resolve();
  } catch (err) {
    await connection.rollback();

    return Promise.reject(err);
  } finally {
    connection.release();
  }
};
