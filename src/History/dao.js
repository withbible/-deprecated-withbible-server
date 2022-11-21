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

exports.selectOptionID = async function (connection, selectOptionParams) {
  const query = `
    SELECT
      question_option_id,
      question_option
    FROM quiz_question_option
    WHERE question_id = ?
      AND question_option_id = ?;
  `;

  const [rows] = await connection.query(query, selectOptionParams);
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

exports.updateHistory = async function (connection, updateHistoryParams) {
  const query = `
    UPDATE quiz_user_answer 
    SET question_option_id = ?
    WHERE question_id = ?
      AND user_id = ?;
  `;
  return await connection.query(query, updateHistoryParams);
};