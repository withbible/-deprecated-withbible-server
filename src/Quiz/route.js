module.exports = function (app) {
  const quiz = require("./controller");

  // 카테고리별 검색어를 포함한 챕터수 조회 API
  app.get("/quiz/categories/chapter", quiz.getChapter);

  // 한 챕터의 질문-선택지 전체조회 API
  app.get("/quiz/chapter", quiz.getQuiz);

  // (관리자) 질문-선택지 생성 API
  app.post("/quiz", quiz.postQuiz);

  // (관리자) 질문-선택지-정답여부 수정 API
  app.put("/quiz", quiz.putQuiz);
};
