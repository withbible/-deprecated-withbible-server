exports.selectLeaderBoard = async function (connection) {
  // TODO: created_at과 updated_at의 타입이 다른 이유 설명
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
