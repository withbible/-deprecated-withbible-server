module.exports = function (app) {
  const quiz = require('./controller');

  // 카테고리 전체조회 API
  app.get('/quiz/categories', quiz.getCategories);

  // 한 카테고리의 챕터수 조회 API (+ 카테고리별 전체조회)
  // TODO: FLOOR함수 리턴값 문자열 이슈
  app.get('/quiz/category/max-chapter', quiz.getMaxChapter);

  // 카테고리별 검색어를 포함한 챕터수 검색 API
  app.get('/quiz/categories/chapter', quiz.getChapter);

  // 한 챕터의 질문 전체조회 API
  app.get('/quiz/chapter/questions', quiz.getQuestions);

  // 한 질문의 선택지 전체조회 API
  app.get('/quiz/question/options', quiz.getOptions);
};