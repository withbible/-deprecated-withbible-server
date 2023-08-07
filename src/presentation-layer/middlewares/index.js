const RedisStore = require("connect-redis").default;
const makeSessionMiddleware = require("express-session");
const makeCorsMiddleware = require("cors");
const express = require("express");
const {
  queryParser: makeQueryParserMiddleware,
} = require("express-query-parser");
const makeMorganMiddleware = require("morgan");
const makeRateLimitMiddleware = require("express-rate-limit");
const { StatusCodes: statusCodes } = require("http-status-codes");

const makeHandleErrorMiddleware = require("./handle-error");
const makeAuthenticatorMiddleware = require("./authenticator");
const makeAuthorizerMiddleware = require("./authorizer");
const makeParserMiddleware = require("./parser");
const makeHttpRequestLoggerMiddleware = require("./http-request-logger");
const makeHttpRequestLimiterMiddleware = require("./http-request-limiter");
const makeQuizMiddleware = require("./quiz");
const { quizRepository } = require("../../data-access-layer/repositories");
const sessionStorage = require("../../infrastructure-layer/external-services/session-storage");
const logger = require("../../infrastructure-layer/configs/logger");
const { CATEGORY } = require("../../infrastructure-layer/constants");
const { response, errResponse } = require("../../utils/response");

const handleErrorMiddleware = makeHandleErrorMiddleware({
  statusCodes,
  errResponse,
  logger,
});
const authenticatorMiddleware = makeAuthenticatorMiddleware({
  RedisStore,
  makeSessionMiddleware,
  sessionStorage,
  statusCodes,
  errResponse,
});
const authorizerMiddleware = makeAuthorizerMiddleware(makeCorsMiddleware);
const parserMiddleware = makeParserMiddleware({
  express,
  makeQueryParserMiddleware,
});
const httpRequestLoggerMiddleware = makeHttpRequestLoggerMiddleware({
  makeMorganMiddleware,
  logger,
});
const httpRequestLimiterMiddleware = makeHttpRequestLimiterMiddleware({
  makeRateLimitMiddleware,
  statusCodes,
  errResponse,
});
const quizMiddleware = makeQuizMiddleware({
  quizRepository,
  sessionStorage,
  CATEGORY,
  statusCodes,
  response,
  errResponse,
});

module.exports = Object.freeze({
  handleErrorMiddleware,
  authenticatorMiddleware,
  authorizerMiddleware,
  parserMiddleware,
  httpRequestLoggerMiddleware,
  httpRequestLimiterMiddleware,
  quizMiddleware,
});
