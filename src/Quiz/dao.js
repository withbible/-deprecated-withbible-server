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
    c.category_seq,
      c.category,
      COUNT(q.question_seq) AS question_count,
      CAST(CEIL(COUNT(q.question_seq) / 3) AS SIGNED) AS max_chapter
    FROM quiz_category AS c
    INNER JOIN quiz_question AS q
      ON c.category_seq = q.category_seq
    GROUP BY
      c.category_seq;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.searchMaxChapter = async function (connection, categorySeq) {
  const query = `    
    SELECT
      c.category_seq,
      c.category,
      COUNT(q.question_seq) AS question_count,
      CAST(CEIL(COUNT(q.question_seq) / 3) AS SIGNED) AS max_chapter
    FROM quiz_category AS c
    INNER JOIN quiz_question AS q
      ON c.category_seq = q.category_seq
    GROUP BY
      c.category_seq
    HAVING c.category_seq = ?;
  `;

  const [rows] = await connection.query(query, categorySeq);
  return rows;
};

exports.selectChapter = async function (connection) {
  const query = `
    SELECT 
      q.category_seq,	
      q.chapter_seq,
      COUNT(q.question_seq) AS question_count
    FROM quiz_question AS q
    GROUP BY 
      q.category_seq,	
      q.chapter_seq
    ORDER BY
      q.category_seq;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.searchChapter = async function (connection, keyword) {
  const symbol = `%${keyword}%`;

  const query = `
    SELECT
      c.category,
      q.category_seq,
      JSON_ARRAYAGG(q.chapter_seq) AS chapter_seq_array
    FROM quiz_question AS q
    INNER JOIN quiz_category as c
      ON q.category_seq = c.category_seq
    WHERE q.question LIKE ?
    GROUP BY 
      q.category_seq;
  `;

  const [rows] = await connection.query(query, symbol);
  return rows;
};

exports.selectQuestions = async function (connection, selectQuestionsParams) {
  const query = `
    SELECT
      category_seq,
      question_seq      
    FROM quiz_question
    WHERE category_seq = ?
    LIMIT ?, 3;
  `;

  const [rows] = await connection.query(query, selectQuestionsParams);
  return rows;
};

exports.selectQptions = async function (connection, questionSeq) {
  const query = `
    SELECT
      q.question,
      o.question_option,
      o.answer_yn 
    FROM quiz_question AS q
    INNER JOIN quiz_question_option AS o
      ON q.question_seq = o.question_seq
    WHERE q.question_seq = ?;
  `;

  const [rows] = await connection.query(query, questionSeq);
  return rows;
};
