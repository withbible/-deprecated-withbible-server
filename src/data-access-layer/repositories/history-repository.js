module.exports = (database) => {
  return Object.freeze({
    selectUserOption,
    insertUserOption,
    updateUserOption,
    deleteUserOption,
    selectScore,
    selectActiveQuestionCount,
    selectActiveChapterCount,
    selectActiveChapter,
    selectActiveChapterPage,
    selectActiveChapterByCategorySeq,
    selectTotalCount,
    selectHitCountByChapterNum,
    selectHitCountByChapterSeq,
    selectAvgHitCount,
    insertChapterUserState,
    updateChapterUserState,
    deleteChapterUserState,
  });

  async function selectUserOption(categorySeq, chapterNum, userSeq) {
    const pool = await database.get();
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
      WHERE	qc.category_seq = ${categorySeq}
        AND qc.chapter_num = ${chapterNum}
        AND uo.user_seq = ${userSeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertUserOption(connection, userOption, userSeq, chapterSeq) {
    let query = `
      INSERT INTO quiz_user_option
        (question_seq, question_option_seq, user_seq, chapter_seq)
      VALUES
    `;

    const values = Object.entries(userOption).map(
      ([key, value]) => `(${key}, ${value}, ${userSeq}, ${chapterSeq})`
    );

    query += values.join();
    query += ";";

    await connection.query(query);
  }

  async function updateUserOption(connection, userOption, userSeq, chapterSeq) {
    let query = `
      INSERT INTO quiz_user_option
        (question_seq, question_option_seq, user_seq, chapter_seq)
      VALUES
    `;

    const values = Object.entries(userOption).map(
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
  }

  async function deleteUserOption(userSeq, chapterSeq) {
    const pool = await database.get();
    const query = `
      DELETE 
      FROM quiz_user_option
      WHERE user_seq = ${userSeq}
        AND chapter_seq = ${chapterSeq};
    `;

    await pool.query(query);
  }

  async function selectScore(connection, userSeq) {
    const query = `
      SELECT
        (SUM(hit_question_count)) * 100 AS quizScore
      FROM quiz_chapter_user_state
      WHERE user_seq = ${userSeq};
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function selectActiveQuestionCount(connection, chapterSeq, userSeq) {
    const query = `
      SELECT 			
        COUNT(uo.question_option_seq) AS activeQuestionCount
      FROM quiz_user_option AS uo		
      GROUP BY 
        uo.chapter_seq,
        uo.user_seq
      HAVING uo.chapter_seq = ${chapterSeq}
        AND uo.user_seq = ${userSeq};
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function selectActiveChapterCount(userSeq, categorySeq) {
    const pool = await database.get();
    const query = `
      SELECT
        COUNT(us.chapter_seq) AS activeChapterCount,
        MAX(qc.chapter_num) AS maxChapter
      FROM quiz_chapter AS qc      
      LEFT JOIN quiz_chapter_user_state AS us
        ON qc.chapter_seq = us.chapter_seq 
      WHERE 
        us.user_seq = ${userSeq}
      GROUP BY
        qc.category_seq
      HAVING 
        qc.category_seq = ${categorySeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectActiveChapter(userSeq) {
    const pool = await database.get();
    const query = `
      SELECT
        c.category,
        qc.category_seq AS categorySeq,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "chapterNum", qc.chapter_num,
            "hitQuestionCount", us.hit_question_count,
            "questionCount", qc.question_count
          )            
        ) AS chapterNumArray
      FROM quiz_category AS c
      LEFT JOIN quiz_chapter AS qc
        ON c.category_seq = qc.category_seq
      LEFT JOIN quiz_chapter_user_state AS us
        ON qc.chapter_seq = us.chapter_seq 
      WHERE 
        us.user_seq = ${userSeq}
      GROUP BY
        qc.category_seq;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectActiveChapterPage(userSeq, limit, offset) {
    const pool = await database.get();
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
      WHERE 
        us.user_seq = ${userSeq}
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectActiveChapterByCategorySeq(userSeq, categorySeq) {
    const pool = await database.get();
    const query = `
      SELECT
        c.category,
        qc.category_seq AS categorySeq, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "chapterNum", qc.chapter_num,
            "hitQuestionCount", us.hit_question_count,
            "questionCount", qc.question_count
          )            
        ) AS chapterNumArray
      FROM quiz_category AS c
      LEFT JOIN quiz_chapter AS qc
        ON c.category_seq = qc.category_seq
      LEFT JOIN quiz_chapter_user_state AS us
        ON qc.chapter_seq = us.chapter_seq 
      WHERE us.user_seq = ${userSeq}
      GROUP BY
        qc.category_seq
      HAVING 
        qc.category_seq = ${categorySeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectTotalCount(userSeq) {
    const pool = await database.get();
    const query = `
      SELECT
        COUNT(*) AS totalCount
      FROM quiz_chapter_user_state 
      WHERE	
        user_seq = ${userSeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectHitCountByChapterNum(categorySeq, chapterNum, userSeq) {
    const pool = await database.get();
    const query = `
      SELECT
        us.hit_question_count AS hitQuestionCount,
        qc.question_count AS questionCount
      FROM quiz_chapter AS qc
      LEFT JOIN quiz_chapter_user_state AS us
        ON qc.chapter_seq = us.chapter_seq
      WHERE qc.category_seq = ${categorySeq}
        AND qc.chapter_num = ${chapterNum}
        AND us.user_seq = ${userSeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectHitCountByChapterSeq(connection, chapterSeq, userSeq) {
    const query = `
      SELECT	
        COUNT(uo.question_option_seq) AS hitQuestionCount
      FROM quiz_question_option AS qo	
      INNER JOIN quiz_user_option AS uo	
        ON qo.question_option_seq = uo.question_option_seq 
      WHERE qo.answer_yn = 1
      GROUP BY
        uo.chapter_seq,
        uo.user_seq
      HAVING uo.chapter_seq = ${chapterSeq}
        AND uo.user_seq = ${userSeq};
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function selectAvgHitCount() {
    const pool = await database.get();
    const query = `
      SELECT
        qc.category_seq AS categorySeq,
        qc.chapter_num AS chapterNum,
        ROUND(AVG(us.hit_question_count), 2) AS avgHitQuestionCount,
        qc.question_count AS questionCount
      FROM quiz_chapter AS qc
      LEFT JOIN quiz_chapter_user_state AS us
        ON qc.chapter_seq = us.chapter_seq
      GROUP BY
        qc.category_seq,
        qc.chapter_num,
        qc.question_count;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertChapterUserState(
    connection,
    chapterSeq,
    userSeq,
    activeQuestionCount,
    hitQuestionCount
  ) {
    const query = `
      INSERT INTO quiz_chapter_user_state
        (chapter_seq, user_seq, active_question_count, hit_question_count)
      VALUES(
        ${chapterSeq},
        ${userSeq},
        ${activeQuestionCount},
        ${hitQuestionCount}
      ) ON DUPLICATE KEY UPDATE
        chapter_seq = VALUES(chapter_seq),
        user_seq = VALUES(user_seq);
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function updateChapterUserState(
    connection,
    activeQuestionCount,
    hitQuestionCount,
    chapterSeq,
    userSeq
  ) {
    const query = `
      UPDATE quiz_chapter_user_state
      SET active_question_count = ${activeQuestionCount},
          hit_question_count = ${hitQuestionCount}
      WHERE chapter_seq = ${chapterSeq}
      AND user_seq = ${userSeq};
    `;

    const [rows] = await connection.query(query);
    return rows;
  }

  async function deleteChapterUserState(userSeq, chapterSeq) {
    const pool = await database.get();
    const query = `
      DELETE 
      FROM quiz_chapter_user_state
      WHERE user_seq = ${userSeq}
        AND chapter_seq = ${chapterSeq};
    `;

    await pool.query(query);
  }
};
