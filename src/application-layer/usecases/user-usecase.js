const bcypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

module.exports = (userRepository, leaderBoardRepository, database) => {
  return Object.freeze({
    post,
    patch,
  });

  async function post(userID, password, userEmail) {
    const userIDRow = await userRepository.selectByUserID(userID);

    if (userIDRow.length > 0) {
      const err = new Error("중복된 아이디입니다.");
      err.status = StatusCodes.UNAUTHORIZED;
      return Promise.reject(err);
    }

    const saltRounds = 10;
    const hashedPassword = await bcypt.hash(password, saltRounds);

    const pool = await database.get();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const newUserRow = await userRepository.insertUser(
        userID,
        hashedPassword,
        userEmail
      );
      const userSeq = newUserRow.insertId;

      await leaderBoardRepository.insertLeaderBoard(userSeq);
      await connection.commit();

      return Promise.resolve({
        userSeq,
        userID,
      });
    } catch (err) {
      await connection.rollback();

      return Promise.reject(err);
    } finally {
      connection.release();
    }
  }

  async function patch(userID, password) {
    const [userIDRow] = await userRepository.selectByUserID(userID);

    if (!userIDRow) {
      const err = new Error("가입되지 않은 아이디입니다.");
      err.status = StatusCodes.UNAUTHORIZED;
      return Promise.reject(err);
    }

    const isValidPassword = await bcypt.compare(
      password,
      userIDRow.hahsedPassword
    );

    if (!isValidPassword) {
      const err = new Error("비밀번호가 잘못 되었습니다.");
      err.status = StatusCodes.UNAUTHORIZED;
      return Promise.reject(err);
    }

    return Promise.resolve({
      userSeq: userIDRow.userSeq,
      userID: userIDRow.userID,
    });
  }
};
