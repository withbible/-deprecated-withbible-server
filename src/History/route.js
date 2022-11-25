const authenticate = require('../middleware/authentication');

module.exports = function (app) {
  const history = require('./controller');

  // 챕터별 맞힌갯수 조회 API
  app.get('/history/chapters/hit-count', history.getHitCount);

  // 한 챕터의 선택기록 전체조회 API
  app.get('/history/chapter/user-option', authenticate, history.getUserOptionBulk);

  // 한 챕터의 선택기록 생성 API  
  app.post('/history/chapter/user-option', authenticate, history.postUserOptionBulk);

  // 한 챕터의 선택기록 수정 API  
  app.put('/history/chapter/user-option', authenticate, history.putUserOptionBulk);
};