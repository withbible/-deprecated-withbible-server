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
