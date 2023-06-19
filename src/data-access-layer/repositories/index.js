const makeLeaderBoardRepository = require("./leader-board-repository");
const makeHistoryRepository = require("./history-repository");
const makeUserRepository = require("./user-repository");
const makeQuizRepository = require("./quiz-repository");
const database = require("../../infrastructure-layer/external-services/database");

const leaderBoardRepository = makeLeaderBoardRepository(database);
const historyRepository = makeHistoryRepository(database);
const userRepository = makeUserRepository(database);
const quizRepository = makeQuizRepository(database);

module.exports = Object.freeze({
  leaderBoardRepository,
  historyRepository,
  userRepository,
  quizRepository,
});
