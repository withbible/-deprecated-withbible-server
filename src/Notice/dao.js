exports.searchToken = async (connection, userID) => {
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

exports.selectToken = async (connection) => {
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

exports.updateToken = async (connection, params) => {
  const query = `
    UPDATE user
      SET fcm_token = ?
    WHERE 
      user_id = ?;
  `;

  const [rows] = await connection.query(query, params);
  return rows;
};

exports.selectCreatedCountByPrevMonth = async (connection) => {
  const query = `
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS date,  
      COUNT(question_seq) AS createdCount
    FROM quiz_question
    WHERE 
      DATE_FORMAT(created_at, '%Y-%m')
        = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m')
    GROUP BY 
      DATE_FORMAT(created_at, '%Y-%m');
  `;

  const [rows] = await connection.query(query);
  return rows;
};
