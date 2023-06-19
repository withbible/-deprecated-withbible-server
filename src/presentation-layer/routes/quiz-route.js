module.exports = (app, controller, checkQuizDomain, checkCache) => {
  // 카테고리별 검색어를 포함한 챕터수 조회 API
  app.get("/quiz/categories/chapter", controller.getChapter);

  // 한 챕터의 질문-선택지 전체조회 API
  app.get("/quiz/chapter", [checkQuizDomain, checkCache], controller.getQuiz);

  // (관리자) 질문-선택지-정답여부 생성 API
  app.post("/quiz", controller.postQuiz);

  // (관리자) 질문-선택지-정답여부 수정 API
  app.put("/quiz", controller.putQuiz);
};
