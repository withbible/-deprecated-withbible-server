exports.selectUsername = async function (connection, username) {
  const query = `
    SELECT 
      username
    FROM user
    WHERE username = ?;
  `;

  const [rows] = await connection.query(query, username);
  return rows;
}