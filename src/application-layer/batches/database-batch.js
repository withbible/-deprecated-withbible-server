module.exports = (database) => {
  return Object.freeze({
    checkConnection,
  });

  async function checkConnection() {
    const pool = await database.get();
    const connection = await pool.getConnection();

    try {
      await connection.ping();
    } catch (err) {
      await database.retry();
    } finally {
      connection.release();
    }
  }
};
