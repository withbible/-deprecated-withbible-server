const logger = require('../log');
const LeaderBoard = require('../models/LeaderBoard');

const photoURL = 'https://avatars.dicebear.com/api/micah'

const putLeaderBoard = async (req, res) => {
  try {
    const { name, username, score } = req.body;
    const photoPath = `${photoURL}/${username}.svg`;

    const data = await LeaderBoard.create({
      name,
      username,
      photoPath,
      score
    });

    data
      ? res.json({
        message: `리더보드 등록 완료`,
        data
      })
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
}

const getLeaderBoard = async (_, res) => {
  try {
    const data = await LeaderBoard.find()
      .sort('-score')
      .limit(10)
      .select('name username photoPath score');

    if (!data.length)
      throw new Error("데이터가 존재하지 않습니다.")

    data
      ? res.json({
        message: `리더보드 조회 완료`,
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
  putLeaderBoard,
  getLeaderBoard,
}