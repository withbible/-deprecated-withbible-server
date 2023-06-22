module.exports = (database) => {
  return Object.freeze({
    selectCreatedCountByPrevMonth,
    selectQuiz,
    selectChapter,
    selectChapterByKeyword,
    selectChapterByNumber,
    selectMaxChapterByCategory,
    selectChapterSeq,
    insertChapterSeq,
    selectQuestionSeqByText,
    selectQuestionSeqByNumber,
    insertQuestionCount,
    updateQuestionCount,
    insertQuestion,
    updateQuestion,
    deleteQuestion,
    insertOptionArray,
    updateOptionArray,
    deleteOptionArray,
  });

  async function selectCreatedCountByPrevMonth() {
    const pool = await database.get();
    const query = `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS date,  
        COUNT(question_seq) AS createdCount
      FROM quiz_question
      WHERE 
        DATE_FORMAT(created_at, '%Y-%m')
          = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m')
      GROUP BY 
        DATE_FORMAT(created_at, '%Y-%m');
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectQuiz(categorySeq, chapterNum) {
    const pool = await database.get();
    const query = `
      SELECT	
        q.question_seq AS questionSeq,
        q.question,
        q.question_sub AS questionSub,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "questionOptionSeq", qo.question_option_seq,
            "questionOption", qo.question_option,
            "answerYN", qo.answer_yn
          )      
        ) AS optionArray
      FROM quiz_chapter AS qc
      LEFT JOIN quiz_question AS q
        ON qc.chapter_seq  = q.chapter_seq 
      INNER JOIN quiz_question_option AS qo
        ON q.question_seq = qo.question_seq
      WHERE qc.category_seq = ${categorySeq}
        AND qc.chapter_num = ${chapterNum}
      GROUP BY 
        q.question_seq;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectChapter() {
    const pool = await database.get();
    const query = `
      SELECT
        c.category,
        c.category_seq AS categorySeq,
        JSON_ARRAYAGG(qc.chapter_num) AS chapterNumArray
      FROM quiz_category AS c
      INNER JOIN quiz_chapter AS qc
        ON c.category_seq = qc.category_seq
      GROUP BY 
        c.category_seq
      ORDER BY
        c.category_seq;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectChapterByKeyword(keyword) {
    const pool = await database.get();
    const symbol = `%${keyword}%`;

    const query = `
      SELECT
        c.category,
        c.category_seq AS categorySeq,
        JSON_ARRAYAGG(qc.chapter_num) AS chapterNumArray
      FROM quiz_category AS c
      INNER JOIN quiz_chapter AS qc
        ON c.category_seq = qc.category_seq
      INNER JOIN quiz_question AS q
        ON qc.chapter_seq = q.chapter_seq 
      WHERE 
        q.question LIKE ?
      GROUP BY 
        c.category_seq
      ORDER BY
        c.category_seq;
    `;

    const [rows] = await pool.query(query, symbol);
    return rows;
  }

  async function selectChapterByNumber(questionSeq) {
    const pool = await database.get();
    const query = `
      SELECT
        qc.category_seq AS categorySeq,
        qc.chapter_num AS chapterNum,
        q.chapter_seq AS chapterSeq,
        qc.question_count AS questionCount
      FROM quiz_question AS q
      INNER JOIN quiz_chapter AS qc
        ON q.chapter_seq = qc.chapter_seq
      WHERE question_seq = ${questionSeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectMaxChapterByCategory(categorySeq) {
    const pool = await database.get();
    const query = `
      SELECT
        chapter_seq AS chapterSeq,
        MAX(chapter_num) AS maxChapterNum,
        question_count AS questionCount
      FROM quiz_chapter
      WHERE 
        category_seq = ${categorySeq}
      GROUP BY
        chapter_seq
      ORDER BY
        maxChapterNum DESC
      LIMIT 1;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectChapterSeq(categorySeq, chapterNum) {
    const pool = await database.get();
    const query = `
      SELECT
        chapter_seq AS chapterSeq
      FROM 
        quiz_chapter
      WHERE category_seq = ${categorySeq}
        AND chapter_num = ${chapterNum};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertChapterSeq(categorySeq, maxChapterNum) {
    const pool = await database.get();
    const query = `
      INSERT INTO quiz_chapter
        (category_seq, chapter_num)
      VALUES
        (${categorySeq}, ${maxChapterNum});
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectQuestionSeqByText(question) {
    const pool = await database.get();
    const query = `
      SELECT 
        question_seq AS questionSeq
      FROM quiz_question
      WHERE question = "${question}";
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectQuestionSeqByNumber(questionSeq) {
    const pool = await database.get();
    const query = `
      SELECT
        question_seq AS questionSeq
      FROM quiz_question
      WHERE question_seq = ${questionSeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertQuestionCount(connection, chapterSeq, categorySeq) {
    const query = `
      INSERT INTO quiz_chapter
        (chapter_seq, category_seq)
      VALUES
        (${chapterSeq}, ${categorySeq});
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function updateQuestionCount(connection, questionCount, chapterSeq) {
    const query = `
      UPDATE quiz_chapter
        SET question_count = ${questionCount}
      WHERE
        chapter_seq = ${chapterSeq};
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function insertQuestion(connection, question, questionSub, chapterSeq) {
    const query = `
      INSERT INTO quiz_question
        (question, question_sub, chapter_seq)
      VALUES
        ("${question}", "${questionSub}", ${chapterSeq});
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function updateQuestion(
    connection,
    question,
    questionSub,
    questionSeq
  ) {
    const query = `
      UPDATE quiz_question
        SET question = "${question}",
            question_sub = "${questionSub}"
      WHERE question_seq = ${questionSeq};
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function deleteQuestion(questionSeq) {
    const pool = await database.get();
    const query = `
      DELETE 
      FROM quiz_question
      WHERE 
        question_seq = "${questionSeq}";      
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertOptionArray(connection, optionArray, questionSeq) {
    let query = `
      INSERT INTO quiz_question_option
        (question_seq, question_option, answer_yn)
      VALUES
    `;

    const values = optionArray.map(
      (each) => `(
        ${questionSeq}, 
        "${each.questionOption}", 
        ${each.answerYN}
      )`
    );

    query += values.join();
    query += ";";

    const [rows] = await connection.query(query);
    return rows;
  }

  async function updateOptionArray(connection, optionArray, questionSeq) {
    let query = `
      INSERT INTO quiz_question_option
        (question_option_seq, question_seq, question_option, answer_yn)
      VALUES
    `;

    const values = optionArray.map(
      (each) => `(        
          ${each.questionOptionSeq},
          ${questionSeq},
          "${each.questionOption}",
          ${each.answerYN}
        )`
    );

    query += values.join();
    query += `
      ON DUPLICATE KEY UPDATE      
        question_option_seq = VALUES(question_option_seq),
        question_seq = VALUES(question_seq),
        question_option = VALUES(question_option),
        answer_yn = VALUES(answer_yn);
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function deleteOptionArray(questionSeq) {
    const pool = await database.get();
    const query = `
      DELETE 
      FROM quiz_question_option
      WHERE 
        question_seq = "${questionSeq}";      
    `;

    const [rows] = await pool.query(query);
    return rows;
  }
};
