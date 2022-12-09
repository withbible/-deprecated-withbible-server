exports.selectHitCount = async function (connection, selectHitCountParams) {
  const query = `
    SELECT
      S1.category_seq,
      S1.chapter_seq,	
      S2.hit_count,
      S1.question_count
    FROM(
      SELECT
        category_seq,
        chapter_seq,
        COUNT(question_seq) AS question_count  
      FROM quiz_question
      WHERE category_seq = ?
        AND chapter_seq = ?
      GROUP BY
        category_seq,	
        chapter_seq
      ) AS S1
    JOIN(
      SELECT 
        q.category_seq,	
        q.chapter_seq,  
        COUNT(q.question_seq) AS hit_count
      FROM quiz_question AS q
      LEFT JOIN quiz_question_option AS qo
        ON q.question_seq = qo.question_seq
      INNER JOIN quiz_user_option AS uo
        ON qo.question_option_seq = uo.question_option_seq    
      WHERE qo.answer_yn = 1
        AND q.category_seq = ?
        AND q.chapter_seq = ?
        AND uo.user_seq = ?
      GROUP BY 
        q.category_seq,	
        q.chapter_seq
      ) AS S2;
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
      q.question_seq,
      uo.question_option_seq,      
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
  query += ";";

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

exports.selectActiveChapterCount = async function (
  connection,
  selectActiveChapterCountParams
) {
  const query = `
    SELECT 
      S1.category_seq,
      S2.active_chapter_count,
      S1.max_chapter
    FROM(
      SELECT
        c.category_seq,  
        CAST(CEIL(COUNT(q.question_seq) / 3) AS SIGNED) AS max_chapter
      FROM quiz_category AS c
      LEFT JOIN quiz_question AS q
        ON c.category_seq = q.category_seq
      GROUP BY
        c.category_seq  
      HAVING c.category_seq = ?
      ) AS S1
    JOIN(
      SELECT
        c.category_seq,
        COUNT(DISTINCT q.chapter_seq) AS active_chapter_count
      FROM quiz_category AS c
      LEFT JOIN quiz_question AS q
        ON c.category_seq = q.category_seq
      INNER JOIN quiz_user_option AS uo
        ON q.question_seq = uo.question_seq
      WHERE uo.user_seq = ?
        AND c.category_seq = ?
      ) AS S2;
  `;

  const [rows] = await connection.query(query, selectActiveChapterCountParams);
  return rows;
};

exports.selectActiveChapter = async function (
  connection,
  userSeq
) {
  const query = `
    SELECT
      c.category,
      q.category_seq,  
      JSON_ARRAYAGG(q.chapter_seq) AS chapter_seq_array
    FROM quiz_category AS c
    LEFT JOIN quiz_question AS q
      ON c.category_seq = q.category_seq
    INNER JOIN quiz_user_option AS uo
      ON q.question_seq = uo.question_seq
    WHERE uo.user_seq = ?
    GROUP BY 
      q.category_seq;
  `;

  const [rows] = await connection.query(query, userSeq);
  return rows;
};
