exports.selectUserID = async function (connection, userID) {
  const query = `
    SELECT 
      user_id,
      hashed_password
    FROM user
    WHERE userID = ?;
  `;

  const [rows] = await connection.query(query, userID);
  return rows;
}

exports.insertUser = async function (connection, insertUserParams) {
  const query = `
    INSERT INTO user 
      (user_id, hashed_password, user_name)
    VALUES 
      (?, ?, ?);
  `;

  return await connection.query(query, insertUserParams);
}