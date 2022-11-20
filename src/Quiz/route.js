module.exports = function (app) {
  const quiz = require('./controller');

  // 카테고리 조회 API
  app.get('/quizzes/category', quiz.getCategory);

  // 카테고리별 챕터수 조회 API
  // TODO: quiz_qusetion 자동채번 트리거 수정
  // TODO: FLOOR함수 리턴값 문자열 이슈
  app.get('/quizzes/chapter', quiz.getChapter);
};