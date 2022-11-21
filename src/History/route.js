module.exports = function (app) {
  const history = require('./controller');

  // 사용자별 퀴즈기록 조회 API
  app.get('/histories', history.getHistory);

  // 사용자별 퀴즈기록 생성 API
  app.post('/histories', history.postHistory);

  // 사용자별 퀴즈기록 수정 API
  app.put('/histories', history.putHistory);  
};