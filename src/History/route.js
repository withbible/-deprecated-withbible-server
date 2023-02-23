const { quiz: validator } = require("../middlewares/validator");

module.exports = function (app) {
  const history = require("./controller");

  // 한 챕터의 선택기록 조회 API
  app.get("/history/chapter/user-option", validator, history.getUserOption);

  // 한 챕터의 선택기록 생성 API
  app.post("/history/chapter/user-option", validator, history.postUserOption);

  // 한 챕터의 선택기록 수정 API
  app.put("/history/chapter/user-option", validator, history.putUserOption);

  // 한 챕터의 선택기록 삭제 API
  app.delete(
    "/history/chapter/user-option",
    validator,
    history.deleteUserOption
  );

  // 한 챕터의 맞힌개수 조회 API
  app.get("/history/chapter/hit-count", validator, history.getHitCount);

  // 카테고리별 평균 맞힌개수 챕터 전체조회 API
  app.get("/history/categories/avg-hit-count", history.getAvgHitCount);

  // 한 카테고리의 활성화된 챕터개수 조회 API
  app.get(
    "/history/category/active-chapter-count",
    history.getActiveChapterCount
  );

  // 카테고리별 활성화된 챕터 전체조회 API (+ 카테고리 검색지원)
  app.get("/history/categories/active-chapter", history.getActiveChapter);

  // 카테고리별 활성화된 챕터 부분조회 API
  app.get(
    "/history/categories/active-chapter/page",
    history.getActiveChapterPage
  );

  // (테스트) 카테고리별 활성화된 챕터 부분조회 마지막 페이징값 조회 API
  app.get(
    "/history/categories/active-chapter/last-page",
    history.getActiveChapterLastPage
  );
};
