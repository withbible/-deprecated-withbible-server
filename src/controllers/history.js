const { StatusCodes } = require('http-status-codes');
const logger = require('../log');
const History = require('../models/History');
const LeaderBoard = require('../models/LeaderBoard');

const options = {
  new: true
}

const makeTotalScore = (scoreList) => {
  const scoreMap = new Map();
  let totalScore = 0;

  scoreList.forEach(history => {
    const { categoryId, status } = history;

    if (!scoreMap.has(categoryId))
      scoreMap.set(categoryId, 0);

    if (status === "Score") {
      const prevScore = scoreMap.get(categoryId);
      scoreMap.set(categoryId, prevScore + 100);

      totalScore += 100;
    }
  });

  return { scoreMap, totalScore };
}


const putHistory = async (req, res) => {
  try {
    // +++ Need validate multiple username, unique title
    const data = await History.create(
      req.body
    );

    res.status(StatusCodes.OK).json({
      message: `기록 등록 완료`,      
      data
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message
    });
  }
}

const getHistory = async (req, res) => {
  const { name, title } = req.query;

  try {
    const data = title
      ? await History.find().and([{ name }, { title }])
      : await History.find().where({ name });

    if (!data.length)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid query"
      });

    res.status(StatusCodes.OK).json({
      message: `기록 조회 완료`,
      size: data.length,
      data
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message
    });
  }
}

const updateHistory = async (req, res) => {
  const {
    name, title,
    answerSheet, score, timeTaken, date, status
  } = req.body;

  try {
    const updatedHistory = await History.findOneAndUpdate(
      { $and: [{ name }, { title }] },
      { $set: { answerSheet, score, timeTaken, date, status, } },
      options
    ).select(
      'name title answerSheet score timeTaken date status'
    );

    const historyList = await History.find({ name })
      .select(
        'name categoryId status'
      );

    if (!updatedHistory || !historyList.length)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid query"
      });

    const { _, totalScore } = makeTotalScore(historyList);
    const leaderBoard = await LeaderBoard.findOneAndUpdate(
      { name },     // +++ Need change username
      { $set: { score, } },
    ).select(
      'username score'
    );

    res.status(StatusCodes.OK).json({
      message: `기록 및 순위표 업데이트 완료`,
      data: {
        updatedHistory,
        prevTotalScore: leaderBoard.score,
        totalScore
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message
    });
  }
}

const getTotalScore = async (req, res) => {
  const { name } = req.query;

  try {
    const data = await History.find({ name })
      .select(
        'name categoryId status'
      );

    if (!data.length)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid query"
      });

    const { scoreMap, totalScore } = makeTotalScore(data);

    res.status(StatusCodes.OK).json({
      message: `점수 조회 완료`,
      size: scoreMap.size,
      data: {
        totalScore,
        scoreByCategory: Object.fromEntries(scoreMap)
      }
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message
    });
  }
}

module.exports = {
  putHistory,
  getHistory,
  updateHistory,
  getTotalScore,
}