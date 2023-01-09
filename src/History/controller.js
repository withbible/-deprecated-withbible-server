const { StatusCodes } = require("http-status-codes");

// INTERNAL IMPORT
const path = require("path");
const { logger } = require("../configs/logger");
const { response, errResponse } = require("../modules/response");
const { CATEGORY } = require("../constants/enum");
const provider = require("./provider");
const service = require("./service");

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
    res.json(errResponse(err.message));
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
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

/**
 * @example
 * @link https://documenter.getpostman.com/view/11900791/2s8YswQrkS#9ccf3ae7-46ed-4424-bedd-506ef083795e
 */
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
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

/**
 * @example
 * @link https://documenter.getpostman.com/view/11900791/2s8YswQrkS#4073cc67-8a41-4b4e-9314-4cd65aa8d0d5
 */
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
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
  }
};

exports.getActiveChapterCount = async function (req, res) {
  const { categorySeq } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getActiveChapterCount(categorySeq, userSeq);

    res.json(
      response({
        message: `${CATEGORY[categorySeq]} 활성화된 챕터갯수 조회 완료`,
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
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
          ? `${CATEGORY[categorySeq]} 활성화된 챕터 검색 완료`
          : "카테고리별 활성화된 챕터 전체조회 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    res.status(err.status);
    res.json(errResponse(err.message));
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
    res.json(errResponse(err.message));
  }
};
