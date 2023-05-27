const { StatusCodes } = require("http-status-codes");
const Sentry = require("@sentry/node");

// INTERNAL IMPORT
const path = require("path");
const logger = require("../configs/logger");
const pusherChannelsPromise = require("../configs/pusher-channels");
const docs = require("../constants/docs");
const { CATEGORY, HISTORY_API_DOCS } = require("../constants");
const { response, errResponse } = require("../utils/response");
const { filterReferenceOther } = require("../utils");
const provider = require("./provider");
const service = require("./service");

// CONSTANT
const dirName = path.basename(__dirname);

exports.getUserOption = async (req, res) => {
  const { categorySeq, chapterNum } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await service.getUserOption(
      categorySeq,
      chapterNum,
      userSeq
    );

    res.json(
      response({
        message: "한 챕터의 선택기록 전체조회 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
          chapterNum,
          links: filterReferenceOther(HISTORY_API_DOCS, req.method),
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
        link: docs["GET.USER-OPTION"],
      })
    );
  }
};

exports.postUserOption = async (req, res) => {
  const { categorySeq, chapterNum } = req.query;
  const { userOption } = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.postUserOption(
      categorySeq,
      chapterNum,
      userSeq,
      userOption
    );

    const pusher = await pusherChannelsPromise;
    const pusherResponse = await pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      response({
        message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
        result,
      }),
      { info: "subscription_count.user_count" }
    );
    const pusherResult = await pusherResponse.json();
    logger.info(
      `Pusher Channels 이용자 현황: ${JSON.stringify(pusherResult.channels)}`
    );

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "한 챕터의 선택기록 생성 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
          chapterNum,
          links: filterReferenceOther(HISTORY_API_DOCS, req.method),
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    Sentry.captureException(err);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["POST.USER-OPTION"],
      })
    );
  }
};

exports.putUserOption = async (req, res) => {
  const { categorySeq, chapterNum } = req.query;
  const { userOption } = req.body;
  const { userSeq } = req.session.user;

  try {
    const result = await service.putUserOption(
      categorySeq,
      chapterNum,
      userSeq,
      userOption
    );

    const pusher = await pusherChannelsPromise;
    const pusherResponse = await pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      response({
        message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
        result,
      }),
      { info: "subscription_count.user_count" }
    );
    const pusherResult = await pusherResponse.json();
    logger.info(
      `Pusher Channels 이용자 현황: ${JSON.stringify(pusherResult.channels)}`
    );

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "한 챕터의 선택기록 수정 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
          chapterNum,
          links: filterReferenceOther(HISTORY_API_DOCS, req.method),
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    Sentry.captureException(err);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["PUT.USER-OPTION"],
      })
    );
  }
};

exports.deleteUserOption = async (req, res) => {
  const { categorySeq, chapterNum } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await service.deleteUserOption(
      categorySeq,
      chapterNum,
      userSeq
    );

    const pusher = await pusherChannelsPromise;
    const pusherResponse = await pusher.trigger(
      "quiz-interaction-channel",
      "quiz-interaction-event",
      response({
        message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
        result,
      }),
      { info: "subscription_count.user_count" }
    );
    const pusherResult = await pusherResponse.json();
    logger.info(
      `Pusher Channels 이용자 현황: ${JSON.stringify(pusherResult.channels)}`
    );

    res.status(StatusCodes.CREATED);
    res.json(
      response({
        message: "한 챕터의 선택기록 삭제 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
          chapterNum,
          links: filterReferenceOther(HISTORY_API_DOCS, req.method),
        },
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);
    Sentry.captureException(err);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["DELETE.USER-OPTION"],
      })
    );
  }
};

exports.getHitCount = async (req, res) => {
  const { categorySeq, chapterNum } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getHitCount(categorySeq, chapterNum, userSeq);

    res.json(
      response({
        message: "한 챕터의 맞힌개수 조회 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
          chapterNum,
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
        link: docs["GET.HIT-COUNT"],
      })
    );
  }
};

exports.getAvgHitCount = async (req, res) => {
  try {
    const result = await provider.getAvgHitCount();

    res.json(
      response({
        message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
        link: docs["GET.AVG-HIT-COUNT"],
      })
    );
  }
};

exports.getActiveChapterCount = async (req, res) => {
  const { categorySeq } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getActiveChapterCount(categorySeq, userSeq);

    res.json(
      response({
        message: "한 카테고리의 활성화된 챕터개수 조회 완료",
        meta: {
          category: CATEGORY[categorySeq],
          categorySeq,
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
        link: docs["GET.ACTIVE-CHAPTER-COUNT"],
      })
    );
  }
};

exports.getActiveChapter = async (req, res) => {
  const { categorySeq } = req.query;
  const { userSeq } = req.session.user;

  try {
    const result = await provider.getActiveChapter(categorySeq, userSeq);

    res.json(
      response({
        message: categorySeq
          ? "한 카테고리의 활성화된 챕터 검색 완료"
          : "카테고리별 활성화된 챕터 전체조회 완료",
        meta: categorySeq && {
          category: CATEGORY[categorySeq],
          categorySeq,
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
        link: docs["GET.ACTIVE-CHAPTER"],
      })
    );
  }
};

exports.getActiveChapterPage = async (req, res) => {
  const { limit, page } = req.query;
  const { userSeq } = req.session.user;

  try {
    const totalCount = await provider.getTotalCount(userSeq);
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
        link: docs["GET.ACTIVE-CHAPTER-PAGE"],
      })
    );
  }
};

exports.getActiveChapterLastPage = async (req, res) => {
  const { limit } = req.query;
  const { userSeq } = req.session.user;

  try {
    const totalCount = await provider.getTotalCount(userSeq);
    const result = Math.ceil(totalCount / limit);

    res.json(
      response({
        message: "카테고리별 활성화된 챕터 부분조회 마지막 페이징값 조회 완료",
        result,
      })
    );
  } catch (err) {
    logger.warn(`[${dirName}]_${err.message}`);

    res.status(err.status);
    res.json(
      errResponse({
        message: err.message,
      })
    );
  }
};
