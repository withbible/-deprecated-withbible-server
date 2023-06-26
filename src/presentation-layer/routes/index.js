const makeLeaderBoardRoute = require("./leader-board-route");
const makeUserRoute = require("./user-route");
const makeHistoryRoute = require("./history-route");
const makeQuizRoute = require("./quiz-route");
const {
  leaderBoardController,
  userController,
  historyController,
  quizController,
} = require("../controllers");
const { checkSessionCookie } = require("../middlewares/authenticator");
const checkQuizQueryString = require("../middlewares/check-quiz-query-string");
const checkQuizCache = require("../middlewares/check-quiz-cache");
const httpRequestLimiter = require("../middlewares/http-request-limiter");

module.exports = (app) => {
  makeLeaderBoardRoute(app, leaderBoardController);
  makeQuizRoute(
    app,
    quizController,
    checkSessionCookie,
    checkQuizQueryString,
    checkQuizCache
  );
  makeUserRoute(app, userController, checkSessionCookie);
  makeHistoryRoute(
    app,
    historyController,
    checkSessionCookie,
    checkQuizQueryString,
    httpRequestLimiter
  );
};
