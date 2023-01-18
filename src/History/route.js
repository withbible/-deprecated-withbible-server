const { quiz: validator } = require("../middlewares/validator");

module.exports = function (app) {
  const history = require("./controller");

  // 한 챕터의 맞힌갯수 조회 API
  app.get("/history/chapter/hit-count", validator, history.getHitCount);

  // 한 챕터의 선택기록 전체조회 API
  app.get("/history/chapter/user-option", validator, history.getUserOptions);

  // 한 챕터의 선택기록 생성 API
  app.post("/history/chapter/user-option", validator, history.postUserOption);

  // 한 챕터의 선택기록 수정 API
  app.put("/history/chapter/user-option", validator, history.putUserOption);

  // 한 카테고리의 활성화된 챕터갯수 조회 API
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
};
