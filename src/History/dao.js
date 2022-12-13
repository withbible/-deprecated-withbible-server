exports.selectHitCount = async function (connection, selectHitCountParams) {
  const query = `
    SELECT	
      qc.category_seq,
      qc.chapter_num,
      us.hit_question_count, 
      qc.question_count  
    FROM quiz_chapter AS qc
    LEFT JOIN quiz_chapter_user_state AS us
      ON qc.chapter_seq = us.chapter_seq
    WHERE qc.category_seq = ?
      AND qc.chapter_num = ?
      AND us.user_seq = ?;
  `;

  const [rows] = await connection.query(query, selectHitCountParams);
  return rows;
};

exports.selectUserOptionBulk = async function (
  connection,
  selectUserOptionBulkParams
) {
  const query = `
    SELECT       
      qc.chapter_seq,
      q.question_seq,
      uo.question_option_seq,      
      qo.answer_yn
    FROM quiz_chapter AS qc
    LEFT JOIN quiz_question AS q
      ON qc.chapter_seq = q.chapter_seq 
    LEFT JOIN quiz_question_option AS qo
      ON q.question_seq = qo.question_seq
    INNER JOIN quiz_user_option AS uo
      ON qo.question_option_seq = uo.question_option_seq    
    WHERE	qc.category_seq = ?
      AND qc.chapter_num = ?
      AND uo.user_seq = ?;
  `;

  const [rows] = await connection.query(query, selectUserOptionBulkParams);
  return rows;
};

exports.insertUserOptionBulk = async function (
  connection,
  bulk,
  userSeq,
  chapterSeq
) {
  let query = `
    INSERT INTO quiz_user_option
      (question_seq, question_option_seq, user_seq, chapter_seq)
    VALUES  
  `;

  const arr = [];

  for (const [key, value] of Object.entries(bulk))
    arr.push(`(${key}, ${value}, ${userSeq}, ${chapterSeq})`);

  query += arr.join();
  query += ";";

  return await connection.query(query, bulk);
};

exports.updateUserOptionBulk = async function (
  connection,
  bulk,
  userSeq,
  chapterSeq
) {
  let query = `
    INSERT INTO quiz_user_option
      (question_seq, question_option_seq, user_seq, chapter_seq)
    VALUES
  `;

  const arr = [];

  for (const [key, value] of Object.entries(bulk))
    arr.push(`(${key}, ${value}, ${userSeq}, ${chapterSeq})`);

  query += arr.join();
  query += `
    ON DUPLICATE KEY UPDATE
      question_seq = VALUES(question_seq),
      question_option_seq = VALUES(question_option_seq),
      user_seq = VALUES(user_seq),
      chapter_seq = VALUES(chapter_seq);
  `;

  return await connection.query(query, bulk, userSeq);
};

exports.selectActiveChapterCount = async function (
  connection,
  selectActiveChapterCountParams
) {
  const query = `
    SELECT       	
      qc.category_seq,
      COUNT(us.chapter_seq) AS active_chapter_count,
      MAX(qc.chapter_num) AS max_chapter
    FROM quiz_chapter AS qc
    LEFT JOIN quiz_chapter_user_state AS us
      ON qc.chapter_seq = us.chapter_seq 
    WHERE us.user_seq = ?
    GROUP BY
      qc.category_seq
    HAVING category_seq = ?;
  `;

  const [rows] = await connection.query(query, selectActiveChapterCountParams);
  return rows;
};

exports.selectActiveChapter = async function (connection, userSeq) {
  const query = `
    SELECT       	
      c.category,
      qc.category_seq,  
      JSON_ARRAYAGG(qc.chapter_num) AS chapter_seq_array
    FROM quiz_category AS c
    LEFT JOIN quiz_chapter AS qc
      ON c.category_seq = qc.category_seq 
    LEFT JOIN quiz_chapter_user_state AS us
      ON qc.chapter_seq = us.chapter_seq 
    WHERE us.user_seq = ?
    GROUP BY
      qc.category_seq;
  `;

  const [rows] = await connection.query(query, userSeq);
  return rows;
};
