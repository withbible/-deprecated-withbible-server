module.exports = (database) => {
  return Object.freeze({
    selectByUserID,
    insertUser,
    deleteUser,
  });

  async function selectByUserID(userID) {
    const pool = await database.get();
    const query = `
      SELECT 
        user_seq AS userSeq,
        user_id AS userID,
        hashed_password AS hahsedPassword
      FROM user
      WHERE 
        user_id = "${userID}";
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  async function insertUser(userID, hashedPassword, userEmail) {
    const pool = await database.get();
    const query = `
      INSERT INTO user 
        (user_id, hashed_password, user_email)
      VALUES 
        ("${userID}", "${hashedPassword}", "${userEmail}");
    `;

    const [result] = await pool.query(query);
    return result;
  }

  async function deleteUser(userSeq) {
    const pool = await database.get();
    const query = `
      DELETE
      FROM user
      WHERE 
        user_seq = ${userSeq};
    `;

    const [result] = await pool.query(query);
    return result;
  }
};
