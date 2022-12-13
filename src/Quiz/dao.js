exports.selectCategories = async function (connection) {
  const query = `
    SELECT
      CONCAT('/images/category/', category_seq, '.svg') AS image,
      category
    FROM quiz_category;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectMaxChapter = async function (connection) {
  const query = `
    SELECT
      c.category,
      c.category_seq,    
      MAX(qc.chapter_num) AS max_chapter
    FROM quiz_category AS c
    INNER JOIN quiz_chapter AS qc
      ON c.category_seq = qc.category_seq
    GROUP BY
      c.category_seq;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectChapter = async function (connection) {
  const query = `
    SELECT
      c.category,
      c.category_seq,
      JSON_ARRAYAGG(qc.chapter_num) AS chapter_seq_array
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
      c.category_seq,
      JSON_ARRAYAGG(qc.chapter_num) AS chapter_seq_array
    FROM quiz_category AS c
    INNER JOIN quiz_chapter AS qc
      ON c.category_seq = qc.category_seq
    INNER JOIN quiz_question AS q
      ON qc.chapter_seq = q.chapter_seq 
    WHERE q.question LIKE ?
    GROUP BY 
      c.category_seq
    ORDER BY
      c.category_seq;
  `;

  const [rows] = await connection.query(query, symbol);
  return rows;
};

exports.selectQuiz = async function (connection, selectQuizParams) {
  const query = `
    SELECT	
      q.question_seq,
      q.question,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          "question_option_seq", qo.question_option_seq,
          "question_option", qo.question_option,
          "answer_yn", qo.answer_yn
        )
      ) option_array
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

  const [rows] = await connection.query(query, selectQuizParams);
  return rows;
};

exports.selectChapterSeq = async function(connection, selectChapterSeqParams){
  const query = `
    SELECT
      chapter_seq
    FROM 
      quiz_chapter
    WHERE category_seq = ?
      AND chapter_num = ?;
  `;
  const [rows] = await connection.query(query, selectChapterSeqParams);
  return rows;
};