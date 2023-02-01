const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const pusher = require("../configs/pusher-trigger");
const { response } = require("../modules/response");
const provider = require("./provider");
const quizProvider = require("../Quiz/provider");
const dao = require("./dao");

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
    await provider.getUserOptions(categorySeq, chapterNum, userSeq),
    await quizProvider.getChapterSeq(categorySeq, chapterNum),
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

    pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      response({
        message: "카테고리별 평균 맞힌갯수 챕터 전체조회 완료",
        result,
      })
    );
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }

  return Promise.resolve();
};

exports.putUserOption = async function (
  categorySeq,
  chapterNum,
  userSeq,
  bulk
) {
  const [userOptionRows, chapterSeqRow] = await Promise.all([
    await provider.getUserOptions(categorySeq, chapterNum, userSeq),
    await quizProvider.getChapterSeq(categorySeq, chapterNum),
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

    pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      response({
        message: "카테고리별 평균 맞힌갯수 챕터 전체조회 완료",
        result,
      })
    );
  } catch (err) {
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
    return Promise.reject(err);
  } finally {
    connection.release();
  }

  return Promise.resolve();
};
