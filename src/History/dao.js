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

exports.selectHitCount = async function (connection, userSeq) {
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
    WHERE qo.answer_yn = 1
      AND uo.user_seq = ?
    GROUP BY 
      q.category_seq,	
      q.chapter_seq;
  `;

  const [rows] = await connection.query(query, userSeq);
  return rows;
};

exports.selectUserOptionBulk = async function (connection, selectUserOptionBulkParams) {
  const query = `
    SELECT 
      q.category_seq,
      q.chapter_seq,
      q.question_seq,
      uo.question_option_seq,
      qo.question_option,
      qo.answer_yn
    FROM quiz_question AS q
    INNER JOIN quiz_question_option AS qo
      ON q.question_seq = qo.question_seq
    INNER JOIN quiz_user_option AS uo
      ON qo.question_option_seq = uo.question_option_seq    
    WHERE	q.category_seq = ?
      AND q.chapter_seq = ?
      AND uo.user_seq = ?;
  `;

  const [rows] = await connection.query(query, selectUserOptionBulkParams);
  return rows;
};

exports.insertUserOptionBulk = async function (connection, bulk, userSeq) {
  let query = `
    INSERT INTO quiz_user_option
      (question_seq, user_seq, question_option_seq)
    VALUES  
  `;

  const arr = [];

  for (const [key, value] of Object.entries(bulk))
    arr.push(`(${key}, ${userSeq}, ${value})`);

  query += arr.join();
  query += ';';

  return await connection.query(query, bulk);
};

exports.updateUserOptionBulk = async function (connection, bulk, userSeq) {
  let query = `
    INSERT INTO quiz_user_option
      (question_seq, user_seq, question_option_seq)
    VALUES
  `;

  const arr = [];

  for (const [key, value] of Object.entries(bulk))
    arr.push(`(${key}, ${userSeq}, ${value})`);

  query += arr.join();
  query += `
    ON DUPLICATE KEY UPDATE
      question_seq = VALUES(question_seq),
      user_seq = VALUES(user_seq),
      question_option_seq = VALUES(question_option_seq);
  `;

  return await connection.query(query, bulk, userSeq);
};