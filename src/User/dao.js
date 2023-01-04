exports.selectUserID = async function (connection, userID) {
  const query = `
    SELECT 
      user_seq,
      user_id,
      hashed_password
    FROM user
    WHERE user_id = ?;
  `;

  const [rows] = await connection.query(query, userID);
  return rows;
};

exports.insertUser = async function (connection, insertUserParams) {
  const query = `
    INSERT INTO user 
      (user_id, hashed_password, user_name, user_email)
    VALUES 
      (?, ?, ?, ?);
  `;

  const [result] = await connection.query(query, insertUserParams);
  return result;
};
