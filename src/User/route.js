module.exports = function (app) {
  const user = require('./controller');

  // 유저 생성 (회원가입) API
  app.post('/user', user.postUser);

  // 로그인 API
  app.patch('/user/login', user.login);

  // 자동로그인 API
  app.get('/user/loginCheck', user.loginCheck);

  // 로그아웃 API
  app.patch('/user/logout', user.logout);
};