exports.selectChapter = async function (connection) {
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

  const [rows] = await connection.query(query);
  return rows;
};

exports.searchChapter = async function (connection, keyword) {
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

  const [rows] = await connection.query(query, symbol);
  return rows;
};

exports.selectQuiz = async function (connection, params) {
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
    WHERE qc.category_seq = ?
      AND qc.chapter_num = ?
    GROUP BY 
      q.question_seq;
  `;

  const [rows] = await connection.query(query, params);
  return rows;
};

exports.selectQuestionSeqByText = async function (connection, question) {
  const query = `
    SELECT 
      question_seq AS questionSeq
    FROM quiz_question
    WHERE question = "${question}";
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectQuestionSeqByNumber = async function (connection, questionSeq) {
  const query = `
    SELECT
      question_seq AS questionSeq
    FROM quiz_question
    WHERE question_seq = ${questionSeq};
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectChapterByNumber = async function (connection, questionSeq) {
  const query = `
    SELECT
      qc.category_seq AS categorySeq,
      qc.chapter_num AS chapterNum      
    FROM quiz_question AS q
    INNER JOIN quiz_chapter AS qc
      ON q.chapter_seq = qc.chapter_seq 
    WHERE question_seq = ${questionSeq};
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectChapterSeq = async function (connection, params) {
  const query = `
    SELECT
      chapter_seq AS chapterSeq
    FROM 
      quiz_chapter
    WHERE category_seq = ?
      AND chapter_num = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
};

exports.selectMaxChapterByCategory = async function (connection, categorySeq) {
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
  const [rows] = await connection.query(query);
  return rows;
};

exports.insertChapterSeq = async function (connection, params) {
  const query = `
    INSERT INTO quiz_chapter
      (category_seq, chapter_num)
    VALUES
      (?, ?);
  `;

  const [rows] = await connection.query(query, params);
  return rows;
};

exports.insertQuestion = async function (connection, params) {
  const query = `
      INSERT INTO quiz_question
        (question, question_sub, chapter_seq)
      VALUES
        (?, ?, ?);
    `;

  const [rows] = await connection.query(query, params);
  return rows;
};

exports.insertOptionArray = async function (
  connection,
  optionArray,
  questionSeq
) {
  let query = `
    INSERT INTO quiz_question_option
      (question_seq, question_option, answer_yn)
    VALUES
  `;

  const values = optionArray.map(
    (each) =>
      `(
      ${questionSeq}, 
      "${each.questionOption}", 
      ${each.answerYN}
    )`
  );

  query += values.join();
  query += ";";

  const [rows] = await connection.query(query);
  return rows;
};

exports.updateQuestion = async function (connection, params) {
  const query = `
    UPDATE quiz_question
      SET question = ?,
          question_sub = ?
    WHERE question_seq = ?;
  `;
  const [rows] = await connection.query(query, params);
  return rows;
};

exports.updateOption = async function (connection, optionArray, questionSeq) {
  let query = `
    INSERT INTO quiz_question_option
      (question_option_seq, question_seq, question_option, answer_yn)
    VALUES
  `;

  const values = optionArray.map(
    (each) =>
      `(        
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
};
