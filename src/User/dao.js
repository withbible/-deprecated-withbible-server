exports.selectUserID = async function (connection, userID) {
  const query = `
    SELECT 
      user_seq AS userSeq,
      user_id AS userID,
      hashed_password AS hahsedPassword
    FROM user
    WHERE 
      user_id = "${userID}";
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.insertUser = async function (connection, params) {
  const query = `
    INSERT INTO user 
      (user_id, hashed_password, user_email, fcm_token)
    VALUES 
      (?, ?, ?, ?);
  `;

  const [result] = await connection.query(query, params);
  return result;
};
