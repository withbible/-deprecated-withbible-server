const { quiz: validator } = require("../middlewares/validator");

module.exports = function (app) {
  const quiz = require("./controller");

  // 카테고리별 검색어를 포함한 챕터수 조회 API
  app.get("/quiz/categories/chapter", quiz.getChapter);

  // 한 챕터의 질문-선택지 전체조회 API
  app.get("/quiz/chapter", validator, quiz.getQuiz);

  // (관리자) 질문-선택지 생성 API
  app.post("/quiz", quiz.postQuiz);

  // (관리자) 질문-선택지-정답여부 수정 API
  app.put("/quiz", quiz.putQuiz);

  // (관리자) 월별 퀴즈 등록수 조회 API (+ 연 or 월 검색지원)
  app.get("/quiz/created-count/months", quiz.getCreatedCount);
};
