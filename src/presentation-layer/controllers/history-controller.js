module.exports = ({
  usecase,
  realtimeStatistic,
  CATEGORY,
  Sentry,
  StatusCodes,
  logger,
  path,
  filterReferenceOther,
  docs,
  response,
  errResponse,
}) => {
  const fileName = path.basename(__filename, ".js");

  return Object.freeze({
    getUserOption,
    postUserOption,
    putUserOption,
    deleteUserOption,
    getHitCount,
    getAvgHitCount,
    getActiveChapterCount,
    getActiveChapter,
    getActiveChapterPage,
    getActiveChapterLastPage,
  });

  async function getUserOption(req, res) {
    const { categorySeq, chapterNum } = req.query;
    const { userSeq } = req.session.user;

    try {
      const result = await usecase.getUserOption(
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
            links: filterReferenceOther(docs.HISTORY_API_DOCS, req.method),
          },
          result,
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.USER-OPTION"],
        })
      );
    }
  }

  async function postUserOption(req, res) {
    const { categorySeq, chapterNum } = req.query;
    const { userOption } = req.body;
    const { userSeq } = req.session.user;

    try {
      await usecase.postUserOption(
        categorySeq,
        chapterNum,
        userSeq,
        userOption
      );

      const [pusher, avgHitCount] = await Promise.all([
        realtimeStatistic.get(),
        usecase.getAvgHitCount(),
      ]);

      const pusherResponse = await pusher.trigger(
        "quiz-interaction-channel",
        "quiz-interaction-event",
        response({
          message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
          result: avgHitCount,
        }),
        { info: "subscription_count,user_count" }
      );
      const pusherResult = await pusherResponse.json();
      const subscriptionCount = JSON.stringify(
        pusherResult.channels["quiz-interaction-channel"].subscription_count
      );

      logger.info(`Pusher Channels ${subscriptionCount}명 연결되어있습니다.`);

      res.status(StatusCodes.CREATED);
      res.json(
        response({
          message: "한 챕터의 선택기록 생성 완료",
          meta: {
            category: CATEGORY[categorySeq],
            categorySeq,
            chapterNum,
            links: filterReferenceOther(docs.HISTORY_API_DOCS, req.method),
          },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);
      Sentry.captureException(err);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["POST.USER-OPTION"],
        })
      );
    }
  }

  async function putUserOption(req, res) {
    const { categorySeq, chapterNum } = req.query;
    const { userOption } = req.body;
    const { userSeq } = req.session.user;

    try {
      const status = await usecase.putUserOption(
        categorySeq,
        chapterNum,
        userSeq,
        userOption
      );

      const [pusher, avgHitCount] = await Promise.all([
        realtimeStatistic.get(),
        usecase.getAvgHitCount(),
      ]);

      const pusherResponse = await pusher.trigger(
        "quiz-interaction-channel",
        "quiz-interaction-event",
        response({
          message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
          result: avgHitCount,
        }),
        { info: "subscription_count,user_count" }
      );
      const pusherResult = await pusherResponse.json();
      const subscriptionCount =
        pusherResult.channels["quiz-interaction-channel"].subscription_count;

      logger.info(`Pusher Channels ${subscriptionCount}명 연결되어있습니다.`);

      res.status(status);
      res.json(
        response({
          message: "한 챕터의 선택기록 수정 완료",
          meta: {
            category: CATEGORY[categorySeq],
            categorySeq,
            chapterNum,
            links: filterReferenceOther(docs.HISTORY_API_DOCS, req.method),
          },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);
      Sentry.captureException(err);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["PUT.USER-OPTION"],
        })
      );
    }
  }

  async function deleteUserOption(req, res) {
    const { categorySeq, chapterNum } = req.query;
    const { userSeq } = req.session.user;

    try {
      await usecase.deleteUserOption(categorySeq, chapterNum, userSeq);

      const [pusher, avgHitCount] = await Promise.all([
        realtimeStatistic.get(),
        usecase.getAvgHitCount(),
      ]);

      const pusherResponse = await pusher.trigger(
        "quiz-interaction-channel",
        "quiz-interaction-event",
        response({
          message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
          result: avgHitCount,
        }),
        { info: "subscription_count,user_count" }
      );
      const pusherResult = await pusherResponse.json();
      const subscriptionCount = JSON.stringify(
        pusherResult.channels["quiz-interaction-channel"].subscription_count
      );

      logger.info(`Pusher Channels ${subscriptionCount}명 연결되어있습니다.`);

      res.status(StatusCodes.NO_CONTENT);
      res.json(
        response({
          message: "한 챕터의 선택기록 삭제 완료",
          meta: {
            category: CATEGORY[categorySeq],
            categorySeq,
            chapterNum,
            links: filterReferenceOther(docs.HISTORY_API_DOCS, req.method),
          },
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);
      Sentry.captureException(err);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["DELETE.USER-OPTION"],
        })
      );
    }
  }

  async function getHitCount(req, res) {
    const { categorySeq, chapterNum } = req.query;
    const { userSeq } = req.session.user;

    try {
      const result = await usecase.getHitCount(
        categorySeq,
        chapterNum,
        userSeq
      );

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
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.HIT-COUNT"],
        })
      );
    }
  }

  async function getAvgHitCount(req, res) {
    try {
      const result = await usecase.getAvgHitCount();

      res.json(
        response({
          message: "카테고리별 평균 맞힌개수 챕터 전체조회 완료",
          result,
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.AVG-HIT-COUNT"],
        })
      );
    }
  }

  async function getActiveChapterCount(req, res) {
    const { categorySeq } = req.query;
    const { userSeq } = req.session.user;

    try {
      const result = await usecase.getActiveChapterCount(categorySeq, userSeq);

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
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.ACTIVE-CHAPTER-COUNT"],
        })
      );
    }
  }

  async function getActiveChapter(req, res) {
    const { categorySeq } = req.query;
    const { userSeq } = req.session.user;

    try {
      const result = await usecase.getActiveChapter(categorySeq, userSeq);

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
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.ACTIVE-CHAPTER"],
        })
      );
    }
  }

  async function getActiveChapterPage(req, res) {
    const { limit, page } = req.query;
    const { userSeq } = req.session.user;

    try {
      const totalCount = await usecase.getTotalCount(userSeq);
      const lastPage = Math.ceil(totalCount / limit);
      const result = await usecase.getActiveChapterPage(
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
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
          link: docs["GET.ACTIVE-CHAPTER-PAGE"],
        })
      );
    }
  }

  async function getActiveChapterLastPage(req, res) {
    const { limit } = req.query;
    const { userSeq } = req.session.user;

    try {
      const totalCount = await usecase.getTotalCount(userSeq);
      const result = Math.ceil(totalCount / limit);

      res.json(
        response({
          message:
            "카테고리별 활성화된 챕터 부분조회 마지막 페이징값 조회 완료",
          result,
        })
      );
    } catch (err) {
      logger.warn(`[${fileName}]_${err.message}`);

      res.status(err.status);
      res.json(
        errResponse({
          message: err.message,
        })
      );
    }
  }
};
