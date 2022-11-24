module.exports = function (app) {
  const history = require('./controller');

  /**
   * Dev API
   */
  // 한 질문의 선택기록 조회 API
  app.get('/history/question/user-option', history.getUserOption);

  // 한 질문의 선택기록 생성 API
  app.post('/history/question/user-option', history.postUserOption);

  // 한 질문의 선택기록 수정 API
  app.put('/history/question/user-option', history.putUserOption);

  /**
   * End user API
   */
  // 한 질문의 선택기록 전체조회 API

  // 한 챕터의 맞힌갯수 조회 API
  app.get('/history/chapter/hit-count', history.getHitCount);

  // 한 챕터의 맞힌갯수 생성 API  
  
  // 한 챕터의 맞힌점수 수정 API  
};