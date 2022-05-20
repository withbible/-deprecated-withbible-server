const { StatusCodes } = require('http-status-codes');
const logger = require('../log');
const LeaderBoard = require('../models/LeaderBoard');

const photoURL = 'https://avatars.dicebear.com/api/micah'

const putLeaderBoard = async (req, res) => {
  const { username } = req.body;

  try {
    const photoPath = `${photoURL}/${username}.svg`;

    const data = await LeaderBoard.create({
      photoPath,
      ...req.body
    });

    res.status(StatusCodes.OK).json({
      message: `리더보드 등록 완료`,
      data
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message
    });
  }
}

const getLeaderBoard = async (_, res) => {
  try {
    const data = await LeaderBoard.find()
      .sort({score: 'desc', username: 'asc'})
      .limit(10)
      .select('name username photoPath score');

    if (!data.length)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid query"
      });


    res.status(StatusCodes.OK).json({
      message: `리더보드 조회 완료`,
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

module.exports = {
  putLeaderBoard,
  getLeaderBoard,
}