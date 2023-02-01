const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const { pool } = require("../configs/database");
const dao = require("./dao");

exports.getHitCount = async function (categorySeq, chapterNum, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectHitCount(connection, [
    categorySeq,
    chapterNum,
    userSeq,
  ]);
  connection.release();

  if (!result) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getUserOptions = async function (categorySeq, chapterNum, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = await dao.selectUserOptions(connection, [
    categorySeq,
    chapterNum,
    userSeq,
  ]);
  connection.release();

  return Promise.resolve(result);
};

exports.getActiveChapterCount = async function (categorySeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const [result] = await dao.selectActiveChapterCount(connection, [
    userSeq,
    categorySeq,
  ]);
  connection.release();

  if (!result) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getActiveChapter = async function (categorySeq, userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const result = categorySeq
    ? await dao.searchActiveChapter(connection, [userSeq, categorySeq])
    : await dao.selectActiveChapter(connection, userSeq);

  connection.release();

  if (!result.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.chapterNumArray = JSON.parse(each.chapterNumArray);
  });

  return Promise.resolve(result);
};

exports.getActiveChapterPage = async function (limit, page, lastPage, userSeq) {
  if (!limit || !page || page > lastPage) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const connection = await pool.getConnection(async (conn) => conn);

  const offset = (page - 1) * limit;
  const result = await dao.selectActiveChapterPage(connection, [
    userSeq,
    limit,
    offset,
  ]);
  connection.release();

  if (!result.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    each.chapterDetail = JSON.parse(each.chapterDetail);
  });

  result.sort((a, b) => {
    return (
      a.categorySeq - b.categorySeq ||
      a.chapterDetail.chapterNum - b.chapterDetail.chapterNum
    );
  });

  return Promise.resolve(result);
};

exports.getTotalCountByUser = async function (userSeq) {
  const connection = await pool.getConnection(async (conn) => conn);

  const rows = await dao.selectTotalCountByUser(connection, userSeq);
  connection.release();

  const result = rows[0].totalCount;
  return Promise.resolve(result);
};

exports.getAvgHitCount = async function () {
  const connection = await pool.getConnection(async (conn) => conn);

  const rows = await dao.selectAvgHitCount(connection);
  connection.release();

  const result = [];

  rows.forEach((each) => {
    const index = result.findIndex(
      (exist) => exist.categorySeq === each.categorySeq
    );

    if (index > -1) {
      result[index].chapterNumArray = result[index].chapterNumArray.concat({
        chapterNum: each.chapterNum,
        avgHitQuestionCount: each.avgHitQuestionCount,
        questionCount: each.questionCount,
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      each.chapterNumArray = [
        {
          chapterNum: each.chapterNum,
          avgHitQuestionCount: each.avgHitQuestionCount,
          questionCount: each.questionCount,
        },
      ];
      result.push(each);
    }
  });

  result.forEach((each) => {
    // eslint-disable-next-line no-param-reassign
    delete each.chapterNum;
    // eslint-disable-next-line no-param-reassign
    delete each.avgHitQuestionCount;
    // eslint-disable-next-line no-param-reassign
    delete each.questionCount;
  });

  return Promise.resolve(result);
};
