exports.selectLeaderBoard = async function (connection) {
  const query = `
    SELECT
      u.user_id,
      u.user_name,
      CONCAT('https://avatars.dicebear.com/api/micah/', u.user_id,'.svg') AS image,
      ul.quiz_score
    FROM user_leaderboard AS ul
    INNER JOIN user AS u
      ON ul.user_seq = u.user_seq
    ORDER BY ul.quiz_score DESC;
  `;

  const [rows] = await connection.query(query);
  return rows;
};