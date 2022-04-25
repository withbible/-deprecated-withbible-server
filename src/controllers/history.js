const logger = require('../log');
const History = require('../models/History');

const putHistory = async (req, res) => {
  try {
    const data = await new History(req.body).save();

    res.json({
      message: `기록 등록 완료`,
      data
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
}

const getHistory = async (req, res) => {
  try {

    const { name } = req.query;

    const data = await History.find(
      { name }
    );

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

module.exports = {
  putHistory,
  getHistory
}