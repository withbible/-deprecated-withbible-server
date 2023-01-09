const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../configs/logger");
const { response, errResponse } = require("../modules/response");
const { CATEGORY, HISTORY_API_REFERENCE } = require("../constants/enum");
const provider = require("./provider");
const service = require("./service");
const { filterReferenceOther, filterReferenceMe } = require("../utils/util");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getHitCount = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getHitCount(categorySeq, chapterNum, userSeq);

    res.json(
      response({
        message: `${CATEGORY[categorySeq]} ch.${chapterNum} 맞힌갯수 조회 완료`,
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#415a33d7-012e-45a7-bbcf-a669e90e2336",
      })
    );
  }
};

exports.getUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await service.getUserOptionBulk(
      categorySeq,
      chapterNum,
      userSeq
    );

    res.json(
      response({
        message: `${CATEGORY[categorySeq]} ch.${chapterNum} 선택기록 조회 완료`,
        meta: {
          links: filterReferenceOther(HISTORY_API_REFERENCE, req.method),
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: filterReferenceMe(HISTORY_API_REFERENCE, req.method)[0],
      })
    );
  }
};

exports.postUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;
  const { bulk } = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.postUserOptionBulk(
      categorySeq,
      chapterNum,
      userSeq,
      bulk
    );

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: `${CATEGORY[categorySeq]} ch.${chapterNum} 선택기록 생성 완료`,
        meta: {
          links: filterReferenceOther(HISTORY_API_REFERENCE, req.method),
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: filterReferenceMe(HISTORY_API_REFERENCE, req.method)[0],
      })
    );
  }
};

exports.putUserOptionBulk = async function (req, res) {
  const { categorySeq, chapterNum } = req.query;
  const { bulk } = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.putUserOptionBulk(
      categorySeq,
      chapterNum,
      userSeq,
      bulk
    );

    res.json(
      response({
        message: `${CATEGORY[categorySeq]} ch.${chapterNum} 선택기록 수정 완료`,
        meta: {
          links: filterReferenceOther(HISTORY_API_REFERENCE, req.method),
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: filterReferenceMe(HISTORY_API_REFERENCE, req.method)[0],
      })
    );
  }
};

exports.getActiveChapterCount = async function (req, res) {
  const { categorySeq } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getActiveChapterCount(categorySeq, userSeq);

    res.json(
      response({
        message: "활성화된 챕터갯수 조회 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq: parseInt(categorySeq, 10),
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#a61d2c21-ee0a-46c7-9fa2-513a1621c9c7",
      })
    );
  }
};

exports.getActiveChapter = async function (req, res) {
  const { categorySeq } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getActiveChapter(categorySeq, userSeq);

    res.json(
      response({
        message: categorySeq
          ? "활성화된 챕터 검색 완료"
          : "카테고리별 활성화된 챕터 전체조회 완료",
        meta: categorySeq && {
          category: CATEGORY[categorySeq],
          categorySeq: parseInt(categorySeq, 10),
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#1e62e850-3ea9-424c-ac4f-38c3081a2197",
      })
    );
  }
};

exports.getActiveChapterPage = async function (req, res) {
  const { limit, page } = req.query;
  const { userSeq } = req.session.user;

  try {
    const totalCount = await provider.getTotalCountByUser(userSeq);
    const lastPage = Math.ceil(totalCount / limit);
    const result = await provider.getActiveChapterPage(
      limit,
      page,
      lastPage,
      userSeq
    );

    res.json(
      response({
        message: "카테고리별 활성화된 챕터 부분조회 완료",
        meta: {
          links: [
            {
              rel: "self",
              link: req.url,
            },
            {
              rel: "last",
              link: req.url.replace(/\d$/, lastPage),
            },
          ],
        },
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: "https://documenter.getpostman.com/view/11900791/2s8YswQrkS#a9087555-cd29-4ad5-bdd2-b92051af353a",
      })
    );
  }
};
