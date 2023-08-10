module.exports = ({
  express,
  controller,
  checkSessionCookie,
  checkQuizQueryString,
  httpRequestLimiter,
}) => {
  const router = express.Router();

  router.use(checkSessionCookie);

  // 한 챕터의 선택기록 조회 API
  router.get(
    "/chapter/user-option",
    [httpRequestLimiter, checkQuizQueryString],
    controller.getUserOption
  );

  // 한 챕터의 선택기록 생성 API
  router.post(
    "/chapter/user-option",
    checkQuizQueryString,
    controller.postUserOption
  );

  // 한 챕터의 선택기록 수정 API
  router.put(
    "/chapter/user-option",
    checkQuizQueryString,
    controller.putUserOption
  );

  // 한 챕터의 선택기록 삭제 API
  router.delete(
    "/chapter/user-option",
    checkQuizQueryString,
    controller.deleteUserOption
  );

  // 한 챕터의 맞힌개수 조회 API
  router.get(
    "/chapter/hit-count",
    checkQuizQueryString,
    controller.getHitCount
  );

  // 카테고리별 평균 맞힌개수 챕터 전체조회 API
  router.get("/categories/avg-hit-count", controller.getAvgHitCount);

  // 한 카테고리의 활성화된 챕터개수 조회 API
  router.get(
    "/category/active-chapter-count",
    controller.getActiveChapterCount
  );

  // 카테고리별 활성화된 챕터 전체조회 API (+ 카테고리 검색지원)
  router.get("/categories/active-chapter", controller.getActiveChapter);

  // 카테고리별 활성화된 챕터 부분조회 API
  router.get(
    "/categories/active-chapter/page",
    controller.getActiveChapterPage
  );

  // (관리자) 카테고리별 활성화된 챕터 부분조회 마지막 페이징값 조회 API
  router.get(
    "/categories/active-chapter/last-page",
    controller.getActiveChapterLastPage
  );

  return router;
};
