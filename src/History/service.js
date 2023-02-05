const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const pool = require("../configs/database");
const provider = require("./provider");
const quizProvider = require("../Quiz/provider");
const dao = require("./dao");
const leaderBoardDao = require("../LeaderBoard/dao");

/**
 * @description
 * Provider 계층의 Read의 데이터가 존재하지 않을시
 * Service 계층의 Read와 Create는 다르게 처리되기 때문에
 * Service 계층에 Read를 두었습니다.
 */
exports.getUserOptions = async function (categorySeq, chapterNum, userSeq) {
  const rows = await provider.getUserOptions(categorySeq, chapterNum, userSeq);

  if (!rows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return rows;
};

exports.postUserOption = async function (
  categorySeq,
  chapterNum,
  userSeq,
  bulk
) {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    provider.getUserOptions(categorySeq, chapterNum, userSeq),
    quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  if (userOptionRows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const { chapterSeq } = chapterSeqRow;

  try {
    await dao.insertUserOption(connection, bulk, userSeq, chapterSeq);
    const result = await provider.getAvgHitCount();

    return Promise.resolve(result);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }
};

exports.putUserOption = async function (
  categorySeq,
  chapterNum,
  userSeq,
  bulk
) {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    provider.getUserOptions(categorySeq, chapterNum, userSeq),
    quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  /**
   * @todo 변경 유무를 검증하여 없을시, 204 반환
   */
  if (!userOptionRows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const { chapterSeq } = chapterSeqRow;

  try {
    await dao.updateUserOption(connection, bulk, userSeq, chapterSeq);
    const result = await provider.getAvgHitCount();

    return Promise.resolve(result);
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }
};

exports.deleteUserOption = async function (categorySeq, chapterNum, userSeq) {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    provider.getUserOptions(categorySeq, chapterNum, userSeq),
    quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  if (!userOptionRows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const { chapterSeq } = chapterSeqRow;

  try {
    await connection.beginTransaction();
    await Promise.all([
      dao.deleteUserOption(connection, userSeq, chapterSeq),
      dao.deleteChapterUserState(connection, userSeq, chapterSeq),
    ]);

    const [{ quizScore }] = await dao.selectScore(connection, userSeq);
    await leaderBoardDao.updateLeaderBoard(connection, userSeq, quizScore);
    await connection.commit();

    const result = await provider.getAvgHitCount();

    return Promise.resolve(result);
  } catch (err) {
    await connection.rollback();

    return Promise.reject(err);
  } finally {
    connection.release();
  }
};
