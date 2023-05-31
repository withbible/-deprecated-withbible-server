const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const provider = require("./provider");
const quizProvider = require("../Quiz/provider");
const dao = require("./dao");
const leaderBoardDao = require("../LeaderBoard/dao");

exports.getUserOption = async (categorySeq, chapterNum, userSeq) => {
  const rows = await provider.getUserOption(categorySeq, chapterNum, userSeq);

  if (!rows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return rows;
};

exports.postUserOption = async (
  categorySeq,
  chapterNum,
  userSeq,
  userOption
) => {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    provider.getUserOption(categorySeq, chapterNum, userSeq),
    quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  if (userOptionRows.length > 0) {
    const err = new Error("중복된 기록입니다.");
    err.status = StatusCodes.METHOD_NOT_ALLOWED;
    return Promise.reject(err);
  }

  const pool = await require("../configs/database").get();
  const connection = await pool.getConnection();
  const { chapterSeq } = chapterSeqRow;

  try {
    await connection.beginTransaction();
    await dao.insertUserOption(connection, userOption, userSeq, chapterSeq);

    const [[activeCountRow], [hitCountRow]] = await Promise.all([
      dao.selectActiveQuestionCount(connection, [chapterSeq, userSeq]),
      dao.selectHitCountByChapterSeq(connection, [chapterSeq, userSeq]),
    ]);

    await dao.insertChapterUserState(connection, [
      chapterSeq,
      userSeq,
      activeCountRow.activeQuestionCount,
      hitCountRow?.hitQuestionCount,
    ]);

    const [{ quizScore }] = await dao.selectScore(connection, userSeq);
    await leaderBoardDao.updateLeaderBoard(connection, userSeq, quizScore);
    await connection.commit();

    return Promise.resolve();
  } catch (err) {
    await connection.rollback();

    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }
};

exports.putUserOption = async (
  categorySeq,
  chapterNum,
  userSeq,
  userOption
) => {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    provider.getUserOption(categorySeq, chapterNum, userSeq),
    quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  if (!userOptionRows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const isModified = userOptionRows.some(
    (each) => each.questionOptionSeq !== userOption[each.questionSeq]
  );

  if (!isModified) {
    const status = StatusCodes.NO_CONTENT;
    return Promise.resolve(status);
  }

  const pool = await require("../configs/database").get();
  const connection = await pool.getConnection();
  const { chapterSeq } = chapterSeqRow;

  try {
    await connection.beginTransaction();
    await dao.updateUserOption(connection, userOption, userSeq, chapterSeq);

    const [[activeCountRow], [hitCountRow]] = await Promise.all([
      dao.selectActiveQuestionCount(connection, [chapterSeq, userSeq]),
      dao.selectHitCountByChapterSeq(connection, [chapterSeq, userSeq]),
    ]);

    await dao.updateChapterUserState(connection, [
      activeCountRow.activeQuestionCount,
      hitCountRow?.hitQuestionCount,
      chapterSeq,
      userSeq,
    ]);

    const [{ quizScore }] = await dao.selectScore(connection, userSeq);
    await leaderBoardDao.updateLeaderBoard(connection, userSeq, quizScore);
    await connection.commit();

    return Promise.resolve(StatusCodes.CREATED);
  } catch (err) {
    await connection.rollback();

    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }
};

exports.deleteUserOption = async (categorySeq, chapterNum, userSeq) => {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    provider.getUserOption(categorySeq, chapterNum, userSeq),
    quizProvider.getChapterSeq(categorySeq, chapterNum),
  ]);

  if (!userOptionRows.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const pool = await require("../configs/database").get();
  const connection = await pool.getConnection();
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

    return Promise.resolve();
  } catch (err) {
    await connection.rollback();

    return Promise.reject(err);
  } finally {
    connection.release();
  }
};
