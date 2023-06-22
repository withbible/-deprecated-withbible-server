module.exports = (app, controller, checkSessionCookie, checkQuizDomain) => {
  app.use(checkSessionCookie);

  // 한 챕터의 선택기록 조회 API
  app.get(
    "/history/chapter/user-option",
    checkQuizDomain,
    controller.getUserOption
  );

  // 한 챕터의 선택기록 생성 API
  app.post(
    "/history/chapter/user-option",
    checkQuizDomain,
    controller.postUserOption
  );

  // 한 챕터의 선택기록 수정 API
  app.put(
    "/history/chapter/user-option",
    checkQuizDomain,
    controller.putUserOption
  );

  // 한 챕터의 선택기록 삭제 API
  app.delete(
    "/history/chapter/user-option",
    checkQuizDomain,
    controller.deleteUserOption
  );

  // 한 챕터의 맞힌개수 조회 API
  app.get(
    "/history/chapter/hit-count",
    checkQuizDomain,
    controller.getHitCount
  );

  // 카테고리별 평균 맞힌개수 챕터 전체조회 API
  app.get("/history/categories/avg-hit-count", controller.getAvgHitCount);

  // 한 카테고리의 활성화된 챕터개수 조회 API
  app.get(
    "/history/category/active-chapter-count",
    controller.getActiveChapterCount
  );

  // 카테고리별 활성화된 챕터 전체조회 API (+ 카테고리 검색지원)
  app.get("/history/categories/active-chapter", controller.getActiveChapter);

  // 카테고리별 활성화된 챕터 부분조회 API
  app.get(
    "/history/categories/active-chapter/page",
    controller.getActiveChapterPage
  );

  // (관리자) 카테고리별 활성화된 챕터 부분조회 마지막 페이징값 조회 API
  app.get(
    "/history/categories/active-chapter/last-page",
    controller.getActiveChapterLastPage
  );
};