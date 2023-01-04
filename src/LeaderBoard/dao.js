exports.selectLeaderBoard = async function (connection) {
  /**
   * @todo created_at과 updated_at의 타입이 다른 이유 설명
   */
  const query = `
    SELECT
      u.user_id,
      u.user_name,
      CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
      ul.quiz_score,
      ul.updated_at
    FROM user_leaderboard AS ul
    INNER JOIN user AS u
      ON ul.user_seq = u.user_seq
    ORDER BY ul.quiz_score DESC;    
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.searchLeaderBoard = async function (
  connection,
  selectLeaderBoardParams
) {
  const query = `
    SELECT
      u.user_id,
      u.user_name,
      CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
      ul.quiz_score,
      ul.updated_at
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
