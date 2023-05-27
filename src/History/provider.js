const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const poolPromise = require("../configs/database");
const dao = require("./dao");

exports.getUserOption = async (categorySeq, chapterNum, userSeq) => {
  const pool = await poolPromise;
  const result = await dao.selectUserOption(pool, [
    categorySeq,
    chapterNum,
    userSeq,
  ]);

  return Promise.resolve(result);
};

exports.getActiveChapterCount = async (categorySeq, userSeq) => {
  const pool = await poolPromise;
  const [result] = await dao.selectActiveChapterCount(pool, [
    userSeq,
    categorySeq,
  ]);

  if (!result) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getActiveChapter = async (categorySeq, userSeq) => {
  const pool = await poolPromise;
  const result = categorySeq
    ? await dao.searchActiveChapter(pool, [userSeq, categorySeq])
    : await dao.selectActiveChapter(pool, userSeq);

  if (!result.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getActiveChapterPage = async (limit, page, lastPage, userSeq) => {
  if (!limit || !page || page > lastPage) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  const pool = await poolPromise;
  const offset = (page - 1) * limit;
  const result = await dao.selectActiveChapterPage(pool, [
    userSeq,
    limit,
    offset,
  ]);

  if (!result.length) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.NOT_FOUND;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getTotalCount = async (userSeq) => {
  const pool = await poolPromise;
  const [rows] = await dao.selectTotalCount(pool, userSeq);
  const result = rows.totalCount;

  return Promise.resolve(result);
};

exports.getHitCount = async (categorySeq, chapterNum, userSeq) => {
  const pool = await poolPromise;
  const [result] = await dao.selectHitCountByChapterNum(pool, [
    categorySeq,
    chapterNum,
    userSeq,
  ]);

  if (!result) {
    const err = new Error("해당 기록이 존재하지 않습니다.");
    err.status = StatusCodes.BAD_REQUEST;
    return Promise.reject(err);
  }

  return Promise.resolve(result);
};

exports.getAvgHitCount = async () => {
  const pool = await poolPromise;
  const rows = await dao.selectAvgHitCount(pool);
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
