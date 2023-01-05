exports.selectHitCount = async function (connection, selectHitCountParams) {
  const query = `
    SELECT
      us.hit_question_count AS hitQuestionCount,
      qc.question_count AS questionCount
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
      q.question_seq AS questionSeq,
      uo.question_option_seq AS questionOptionSeq,
      qo.answer_yn AS answerYN
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

  const values = Object.entries(bulk).map(
    ([key, value]) => `(${key}, ${value}, ${userSeq}, ${chapterSeq})`
  );

  query += values.join();
  query += ";";

  await connection.query(query);
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

  const values = Object.entries(bulk).map(
    ([key, value]) => `(${key}, ${value}, ${userSeq}, ${chapterSeq})`
  );

  query += values.join();
  query += `
    ON DUPLICATE KEY UPDATE
      question_seq = VALUES(question_seq),
      question_option_seq = VALUES(question_option_seq),
      user_seq = VALUES(user_seq),
      chapter_seq = VALUES(chapter_seq);
  `;

  await connection.query(query);
};

exports.selectActiveChapterCount = async function (
  connection,
  selectActiveChapterCountParams
) {
  const query = `
    SELECT
      COUNT(us.chapter_seq) AS activeChapterCount,
      MAX(qc.chapter_num) AS maxChapter
    FROM quiz_chapter AS qc      
    LEFT JOIN quiz_chapter_user_state AS us
      ON qc.chapter_seq = us.chapter_seq 
    WHERE 
      us.user_seq = ?
    GROUP BY
      qc.category_seq
    HAVING 
      qc.category_seq = ?;
  `;

  const [rows] = await connection.query(query, selectActiveChapterCountParams);
  return rows;
};

exports.selectActiveChapter = async function (connection, userSeq) {
  const query = `
    SELECT
      c.category,
      qc.category_seq AS categorySeq,
      CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            "chapterNum", qc.chapter_num,
            "hitQuestionCount", us.hit_question_count,
            "questionCount", qc.question_count
          )
        ),
        ']'
      ) AS chapterNumArray
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

exports.searchActiveChapter = async function (
  connection,
  selectActiveChapterParams
) {
  const query = `
    SELECT
      c.category,
      qc.category_seq AS categorySeq, 
      CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            "chapterNum", qc.chapter_num,
            "hitQuestionCount", us.hit_question_count,
            "questionCount", qc.question_count
          )
        ),
        ']'
      ) AS chapterNumArray
    FROM quiz_category AS c
    LEFT JOIN quiz_chapter AS qc
      ON c.category_seq = qc.category_seq
    LEFT JOIN quiz_chapter_user_state AS us
      ON qc.chapter_seq = us.chapter_seq 
    WHERE us.user_seq = ?
    GROUP BY
      qc.category_seq
    HAVING 
      qc.category_seq = ?;
  `;

  const [rows] = await connection.query(query, selectActiveChapterParams);
  return rows;
};

exports.selectActiveChapterPage = async function (
  connection,
  selectActiveChapterPageParams
) {
  const query = `
    SELECT
      qc.category_seq AS categorySeq,  
      JSON_OBJECT(
        "chapterNum", qc.chapter_num,  		
        "hitQuestionCount", us.hit_question_count,
        "questionCount", qc.question_count
      ) AS chapterDetail
    FROM quiz_chapter AS qc      
    LEFT JOIN quiz_chapter_user_state AS us
      ON qc.chapter_seq = us.chapter_seq
    WHERE us.user_seq = ?
    LIMIT ? OFFSET ?;
  `;

  const [rows] = await connection.query(query, selectActiveChapterPageParams);
  return rows;
};
