exports.selectLeaderBoard = async function (connection) {
  const query = `
    SELECT
      u.user_id AS userID,
      u.user_name AS userName,
      CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
      ul.quiz_score AS quizScore,
      ul.updated_at AS updatedAt
    FROM user_leaderboard AS ul
    INNER JOIN user AS u
      ON ul.user_seq = u.user_seq
    ORDER BY ul.quiz_score DESC;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectLeaderBoardPage = async function (
  connection,
  selectLeaderBoardParams
) {
  const query = `
    SELECT
      u.user_id AS userID,
      u.user_name AS userName,
      CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
      ul.quiz_score AS quizScore,
      ul.updated_at AS updatedAt
    FROM user_leaderboard AS ul
    INNER JOIN user AS u
      ON ul.user_seq = u.user_seq
    ORDER BY ul.quiz_score DESC
    LIMIT ? OFFSET ?;
  `;

  const [rows] = await connection.query(query, selectLeaderBoardParams);
  return rows;
};

exports.insertLeaderBoard = async function (connection, userSeq) {
  const query = `
    INSERT INTO user_leaderboard
      (user_seq)
    VALUES
      (?);
  `;

  const [rows] = await connection.query(query, userSeq);
  return rows;
};

exports.updateLeaderBoard = async function (connection, userSeq, quizScore) {
  const query = `
    UPDATE user_leaderboard
      SET quiz_score = ${quizScore}
    WHERE 
      user_seq = ${userSeq};
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectTotalCount = async function (connection) {
  const query = `
    SELECT
      COUNT(*) AS totalCount
    FROM user_leaderboard;
  `;

  const [rows] = await connection.query(query);
  return rows;
};
