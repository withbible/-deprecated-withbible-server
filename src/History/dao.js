exports.selectHistory = async function (connection, selectHistoryParams) {
  const query = `
    SELECT
      a.user_id,
      a.question_id,
      o.question_option,
      o.is_correct 
    FROM quiz_user_answer AS a
    INNER JOIN quiz_question_option AS o
      ON a.question_option_id = o.question_option_id
    WHERE a.question_id = ?
      AND a.user_id = ?;
  `;

  const [rows] = await connection.query(query, selectHistoryParams);
  return rows;
};

exports.insertHistory = async function (connection, insertHistoryParams) {
  const query = `
    INSERT INTO quiz_user_answer
      (question_id, question_option_id, user_id)
    VALUES
      (?, ?, ?);
  `;
  return await connection.query(query, insertHistoryParams);
};