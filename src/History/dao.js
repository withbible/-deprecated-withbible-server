exports.selectUserOption = async function (connection, selectUserOptionParams) {
  const query = `
    SELECT
      a.user_seq,
      o.question_seq,
      o.question_option,
      o.answer_yn
    FROM quiz_question_option AS o
    INNER JOIN quiz_user_option AS a
      ON o.question_option_seq = a.question_option_seq
    WHERE o.question_seq = ?
      AND a.user_seq = ?;
  `;

  const [rows] = await connection.query(query, selectUserOptionParams);
  return rows;
};

exports.selectOptionSeq = async function (connection, selectOptionParams) {
  const query = `
    SELECT
      question_option_seq,
      question_option
    FROM quiz_question_option
    WHERE question_seq = ?
      AND question_option_seq = ?;
  `;

  const [rows] = await connection.query(query, selectOptionParams);
  return rows;
};

exports.insertUserOption = async function (connection, insertUserOptionParams) {
  const query = `
    INSERT INTO quiz_user_option
      (question_seq, question_option_seq, user_seq)
    VALUES
      (?, ?, ?);
  `;
  return await connection.query(query, insertUserOptionParams);
};

exports.updateUserOption = async function (connection, updateUserOptionParams) {
  const query = `
    UPDATE quiz_user_option 
    SET 
      question_option_seq = ?
    WHERE question_seq = ?
      AND user_seq = ?;
  `;
  return await connection.query(query, updateUserOptionParams);
};

exports.selectHitCount = async function (connection, userID) {
  const query = `
    SELECT 
      q.category_seq,	
      q.chapter_seq,
      COUNT(q.question_seq) AS hit_count
    FROM quiz_question AS q
    INNER JOIN quiz_question_option AS qo
      ON q.question_seq = qo.question_seq
    INNER JOIN quiz_user_option AS uo
      ON qo.question_option_seq = uo.question_option_seq
    INNER JOIN user AS u
      ON u.user_seq = uo.user_seq
    WHERE qo.answer_yn = 1
      AND u.user_id = ?
    GROUP BY 
      q.category_seq,	
      q.chapter_seq;
  `;

  const [rows] = await connection.query(query, userID);
  return rows;
};