const logger = require('../log');
const LeaderBoard = require('../models/LeaderBoard');

let photoURL = 'https://avatars.dicebear.com/api/micah'

const putLeaderBoard = async (req, res) => {
  try {
    const { name, username, _, score } = req.body;
    const photoPath = `${photoURL}/${username}.svg`;

    const data = await new LeaderBoard({
      name,
      username,
      photoPath,
      score
    }).save();

    if (!Object.keys(data).length)
      throw new Error("데이터가 존재하지 않습니다.")

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

const getLeaderBoard = async (req, res) => {
  try {
    const data = await LeaderBoard.find();

    if (!data.length)
      throw new Error("데이터가 존재하지 않습니다.")

    data
      ? res.json({
        message: `리더보드 조회 완료`,
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
  getLeaderBoard
}