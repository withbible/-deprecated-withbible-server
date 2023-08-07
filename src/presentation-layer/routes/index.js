const express = require("express");
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
const {
  authenticatorMiddleware,
  httpRequestLimiterMiddleware,
  quizMiddleware,
} = require("../middlewares");

const leaderBoardRoute = makeLeaderBoardRoute({
  express,
  leaderBoardController,
});
const userRoute = makeUserRoute({
  express,
  userController,
  checkSessionCookie: authenticatorMiddleware.checkSessionCookie,
});
const historyRoute = makeHistoryRoute({
  express,
  historyController,
  checkSessionCookie: authenticatorMiddleware.checkSessionCookie,
  checkQuizQueryString: quizMiddleware.checkQuizQueryString,
  httpRequestLimiter: httpRequestLimiterMiddleware.rateLimit,
});
const quizRoute = makeQuizRoute({
  express,
  quizController,
  checkSessionCookie: authenticatorMiddleware.checkSessionCookie,
  checkQuizQueryString: quizMiddleware.checkQuizQueryString,
  checkQuizCache: quizMiddleware.checkQuizCache,
});

module.exports = Object.freeze({
  leaderBoardRoute,
  userRoute,
  historyRoute,
  quizRoute,
});
