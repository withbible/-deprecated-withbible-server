const logger = require('../log');
const History = require('../models/History');
const LeaderBoard = require('../models/LeaderBoard');

const options = {
  new: true
}

const putHistory = async (req, res) => {
  try {
    const data = await new History(req.body).save();

    if (!Object.keys(data).length)
      throw new Error("데이터가 존재하지 않습니다.")

    data
      ? res.json({
        message: `기록 등록 완료`,
        data
      })
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
}

const getHistory = async (req, res) => {
  try {
    const { name, title } = req.query;

    const data = await History.find(
      title
        ? {
          $and: [
            { name },
            { title }
          ]
        }
        : { name }
    );

    if (!data.length)
      throw new Error("데이터가 존재하지 않습니다.")

    data
      ? res.json({
        message: `기록 조회 완료`,
        data
      })
      : res.status(400).json({ message: "Invalid query" });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
}

const updateHistory = async (req, res) => {
  try {
    const { name, title, answerSheet, score, timeTaken, date } = req.body;

    const data = await History.findOneAndUpdate(
      { $and: [{ name }, { title }] },
      {
        $set: {
          answerSheet,
          score,
          timeTaken,
          date,
        }
      },
      options
    ).select(
      'name title answerSheet score timeTaken date status'
    );

    data
      ? res.json({
        message: `기록 업데이트 완료`,
        size: data.length,
        data
      })
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
}

const getScore = async (req, res) => {
  try {
    const { name } = req.query;
    const historyList = await History.find({ name });

    if (!historyList.length)
      throw new Error("데이터가 존재하지 않습니다.")

    const scoreMap = new Map();
    let totalScore = 0;

    historyList.forEach(history => {
      const { categoryId, status } = history;

      if (!scoreMap.has(categoryId))
        scoreMap.set(categoryId, 0);

      if (status === "score") {
        const prevScore = scoreMap.get(categoryId);
        scoreMap.set(categoryId, prevScore + 100);

        totalScore += 100;
      }
    });

    res.json({
      message: `점수 조회 완료`,
      size: scoreMap.size,
      data: {
        totalScore,
        scoreByCategory: Object.fromEntries(scoreMap)
      }
    })

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  putHistory,
  getHistory,
  updateHistory,
  getScore,
}