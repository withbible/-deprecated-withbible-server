exports.searchToken = async function (connection, userID) {
  const query = `
    SELECT
      fcm_token AS token
    FROM user
    WHERE 
      user_id = "${userID}";
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.selectToken = async function (connection) {
  const query = `
    SELECT
      fcm_token AS token
    FROM user
    WHERE
      fcm_token IS NOT NULL;
  `;

  const [rows] = await connection.query(query);
  return rows;
};

exports.updateToken = async function (connection, params) {
  const query = `
    UPDATE user
      SET fcm_token = ?
    WHERE 
      user_id = ?;
  `;

  const [rows] = await connection.query(query, params);
  return rows;
};
