const scoreService = require("../service/score");
const logger = require('../log');

// +++ aggregate
const getRankBySubject = async (req, res) => {
  const getTop3 = (allRank) => allRank.ranks.slice(0, 3);

  try {
    const { subjectId } = req.params;

    const allRank = await scoreService.getRankBySubject(subjectId);
    res.json({
      data: getTop3(allRank)
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
}

const getMyQuizScoreDetail = async (req, res) => {
  try {
    const { name, quizRecord } = req.session.user;

    res.json({
      data: scoreService.getScore(quizRecord),
      name
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// +++ raw
const patchMyQuizScoreWithRank = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { sheet } = req.body;
    const { name, username } = req.session.user;

    if (!sheet[chapterId] || !sheet[chapterId].length)
      throw new Error("invalid data");

    const user = await patchQuizRecord(username, chapterId, sheet);

    const totalPercentage = getScorePercentage(user);

    res.json({
      message: `${result.subjectId} / ${chapterId} is updated`,
      data: await patchSubjectRank(name, totalPercentage)
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const getQuizScoreByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    res.json({
      data: await scoreService.getQuizRecordByChapter(chapterId)
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const getMyQuizScore = (req, res) => {
  try {
    const { name, quizRecord } = req.session.user;

    res.json({
      message: 'keep logined',
      name,
      quizRecord
    });
  } catch (err) {
    logger.error(err);
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  getRankBySubject,
  getMyQuizScoreDetail,
  patchMyQuizScoreWithRank,
  getQuizScoreByChapter,
  getMyQuizScore
};