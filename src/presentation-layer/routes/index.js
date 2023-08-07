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
const { checkSessionCookie } = require("../middlewares/authenticator");
const checkQuizQueryString = require("../middlewares/check-quiz-query-string");
const checkQuizCache = require("../middlewares/check-quiz-cache");
const httpRequestLimiter = require("../middlewares/http-request-limiter");

const leaderBoardRoute = makeLeaderBoardRoute({
  express,
  leaderBoardController,
});
const userRoute = makeUserRoute({
  express,
  userController,
  checkSessionCookie,
});
const historyRoute = makeHistoryRoute({
  express,
  historyController,
  checkSessionCookie,
  checkQuizQueryString,
  httpRequestLimiter,
});
const quizRoute = makeQuizRoute({
  express,
  quizController,
  checkSessionCookie,
  checkQuizQueryString,
  checkQuizCache,
});

module.exports = Object.freeze({
  leaderBoardRoute,
  userRoute,
  historyRoute,
  quizRoute,
});
