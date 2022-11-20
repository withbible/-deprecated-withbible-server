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
      FLOOR(COUNT(q.question_id) / 3) AS chpater_questions,
      COUNT(q.question_id) AS category_questions
    FROM
      quiz_question AS q
    INNER JOIN
      quiz_category AS c
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
      FLOOR(COUNT(q.question_id) / 3) AS chpater_questions,
      COUNT(q.question_id) AS category_questions
    FROM
      quiz_question AS q
    INNER JOIN
      quiz_category AS c
    ON q.category_id = c.category_id
    AND q.category_id = ?
    GROUP BY
      c.category_id;
  `;

  const [rows] = await connection.query(query, categoryID);
  return rows;
};