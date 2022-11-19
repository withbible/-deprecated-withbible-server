exports.selectUserID = async function (connection, userID) {
  const query = `
    SELECT 
      userID,
      hashedPassword
    FROM user
    WHERE userID = ?;
  `;

  const [rows] = await connection.query(query, userID);
  return rows;
}

exports.insertUser = async function (connection, insertUserParams) {
  const query = `
    INSERT INTO user 
      (userID, hashedPassword, name)
    VALUES 
      (?, ?, ?);
  `;

  return await connection.query(query, insertUserParams);
}