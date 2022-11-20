exports.selectCategory = async function (connection) {
  const query = `
    SELECT
      CONCAT('/images/category/', category_id, '.svg') AS image,
      category
    FROM quiz_category;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectChapter = async function (connection) {
  const query = `
    SELECT
      c.category,
      COUNT(q.question_id) AS category_questions,
      FLOOR(COUNT(q.question_id) / 3) AS max_chapter
    FROM quiz_question AS q
    INNER JOIN quiz_category AS c
      ON q.category_id = c.category_id    
    GROUP BY
      c.category_id;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.searchChapter = async function (connection, categoryID) {
  const query = `
    SELECT
      c.category,
      COUNT(q.question_id) AS category_questions,
      FLOOR(COUNT(q.question_id) / 3) AS max_chapter
    FROM quiz_question AS q
    INNER JOIN quiz_category AS c
      ON q.category_id = c.category_id
      AND q.category_id = ?
    GROUP BY
      c.category_id;
  `;

  const [rows] = await connection.query(query, categoryID);
  return rows;
};

exports.selectQuestion = async function (connection, selectQuestionParams) {
  const query = `
    SELECT
      category_id,
      question_id 
    FROM
      quiz_question
    WHERE category_id = ?
    LIMIT ?, 3;
  `;

  const [rows] = await connection.query(query, selectQuestionParams);
  return rows;
};

exports.selectQption = async function (connection, questionID) {
  const query = `
    SELECT
      q.question,
      o.question_option,
      o.is_correct 
    FROM quiz_question AS q
    INNER JOIN quiz_question_option AS o
      ON q.question_id = o.question_id
      AND q.question_id = ?;
  `;

  const [rows] = await connection.query(query, questionID);
  return rows;
};