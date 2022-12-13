module.exports = function (app) {
  const quiz = require("./controller");

  // 카테고리 전체조회 API
  app.get("/quiz/categories", quiz.getCategories);

  // 카테고리별 챕터수 조회 API
  // TODO: FLOOR함수 리턴값 문자열 이슈
  app.get("/quiz/categories/max-chapter", quiz.getMaxChapter);

  // 카테고리별 검색어를 포함한 챕터수 조회 API
  app.get("/quiz/categories/chapter", quiz.getChapter);

  // 한 챕터의 질문-선택지 전체조회 API
  app.get("/quiz/chapter", quiz.getQuiz);
};
