const { StatusCodes } = require("http-status-codes");

//INTERNAL IMPORT
const { pool } = require("../../config/database");
const provider = require("./provider");

const MAX_QUESTION_COUNT = 3;

exports.postQuiz = async function (categorySeq, question, bulk) {
  // 중복된 질문여부
  const questionRow = await provider.getQuestion(question);  

  if (questionRow) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  // 챕터일련번호 조회. 질문갯수가 초과될 시 +1 채번
  const maxChapterRow = await provider.getMaxChapterSeq(categorySeq);  
  let chapterSeq = maxChapterRow["chapter_seq"];

  const connection = await pool.getConnection(async (conn) => conn);

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

    // 질문 생성
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

    // 선택지 생성
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
          "${each["question_option"]}", 
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
