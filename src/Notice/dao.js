exports.searchToken = async function (connection, userSeq) {
  const query = `
    SELECT
      fcm_token AS token
    FROM user
    WHERE user_seq = ${userSeq};
  `;

  const [rows] = await connection.query(query, userSeq);
  return rows;
};

exports.selectToken = async function (connection) {
  const query = `
    SELECT      
      fcm_token AS token
    FROM user
    WHERE fcm_token != "";
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.updateToken = async function (connection, params) {
  const query = `
    UPDATE user
      SET fcm_token = ?
    WHERE user_seq = ?;
  `;

  const [rows] = await connection.query(query, params);
  return rows;
};
