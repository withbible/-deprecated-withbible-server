module.exports = function (app) {
  const user = require('./controller');

  // 유저 생성 (회원가입) API
  app.post('/users', user.postUsers);

  // 로그인 API
  app.patch('/users/login', user.login);
};