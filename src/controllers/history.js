const logger = require('../log');
const History = require('../models/History');

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
      {
        $and: [
          { name },
          { title }
        ]
      },
      {
        $set: {
          answerSheet,
          score,
          timeTaken,
          date,
        }
      },
      {
        upsert: true,
        new: true
      }
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

module.exports = {
  putHistory,
  getHistory,
  updateHistory
}