const { StatusCodes } = require('http-status-codes');
const logger = require('../log');
const User = require("../models/User");

const getAllUser = async (req, res) => {
  try {
    const user = await User.find()
      .populate('leaderBoard')
      .select(
        'name username photoPath score'
      );

    if (!user.length)
      throw new Error("사용자가 존재하지 않습니다.");

    res.status(StatusCodes.OK).json({
      message: `모든 사용자 조회 완료`,
      data: user
    });

  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message
    });
  }
}

module.exports = { getAllUser }