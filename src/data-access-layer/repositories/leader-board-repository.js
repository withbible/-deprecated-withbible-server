module.exports = (database) => {
  return Object.freeze({
    selectAll,
    selectPage,
    selectByUserSeq,
    selectTotalCount,
    insertLeaderBoard,
    updateLeaderBoard,
    deleteLeaderBoard,
  });

  async function selectAll() {
    const pool = await database.get();
    const query = `
      SELECT
        u.user_id AS userID,      
        CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
        ul.quiz_score AS quizScore,
        ul.updated_at AS updatedAt
      FROM user_leaderboard AS ul
      INNER JOIN user AS u
        ON ul.user_seq = u.user_seq
      ORDER BY ul.quiz_score DESC;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectPage(limit, offset) {
    const pool = await database.get();
    const query = `
      SELECT
        u.user_id AS userID,      
        CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
        ul.quiz_score AS quizScore,
        ul.updated_at AS updatedAt
      FROM user_leaderboard AS ul
      INNER JOIN user AS u
        ON ul.user_seq = u.user_seq
      ORDER BY ul.quiz_score DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectByUserSeq(userSeq) {
    const pool = await database.get();
    const query = `
      SELECT 
        user_seq
      FROM user_leaderboard
      WHERE user_seq = ${userSeq};
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function selectTotalCount() {
    const pool = await database.get();
    const query = `
      SELECT
        COUNT(*) AS totalCount
      FROM user_leaderboard;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertLeaderBoard(userSeq) {
    const pool = await database.get();
    const query = `
      INSERT INTO user_leaderboard
        (user_seq)
      VALUES
        (${userSeq});
    `;

    await pool.query(query);
  }

  async function updateLeaderBoard(connection, userSeq, quizScore) {
    const query = `
      UPDATE user_leaderboard
      SET quiz_score = ${quizScore}
      WHERE user_seq = ${userSeq};
    `;

    await connection.query(query);
  }

  async function deleteLeaderBoard(userSeq) {
    const pool = await database.get();
    const query = `
      DELETE
      FROM user_leaderboard
      WHERE user_seq = ${userSeq};
    `;

    await pool.query(query);
  }
};
