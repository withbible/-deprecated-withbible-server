const User = require('../models/User');

const SUBJECT_CODE_RECORDS = require("../utils/quiz");
const DefaultDict = require('../utils/collection');
const logger = require('../log');

const getChapterScore = async (req, res) => {
  try {
    const { chapterid } = req.params;
    res.json(await User.find({
      [`quizRecord.${chapterid}`]: { "$exists": true }
    }));
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
}

const patchMyChapterScore = async (req, res) => {
  try {
    const { chapterid } = req.params;
    const { sheet } = req.body;
    const { username } = req.session.user;
    await User.updateOne(
      { username },
      {
        '$set': {
          [`quizRecord.${chapterid}`]: sheet[chapterid]
        }
      },
    );
    res.json({ message: `${chapterid} is updated` });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
}

const getMyScoreAll = async (req, res) => {
  try {
    const { name, quizRecord } = req.session.user;
    const result = new DefaultDict(_ => []);
    for (const [chapterId, chapterRecord] of Object.entries(quizRecord)) {
      const subjectTitle = SUBJECT_CODE_RECORDS[chapterId.match(/^.[^_]/)];
      result[subjectTitle].push({
        "chapterId": parseInt(chapterId.match(/[1-9][0-9]*/)),
        "detail": {
          "score": chapterRecord.filter(each => each === true).length + "/" + chapterRecord.length,
          "state": chapterRecord.some(each => each === null) ? "proceed" : "end"
        }
      })
      result[subjectTitle].sort((a, b) =>
        (a.chapterId > b.chapterId) ? 1
          : (b.chapterId > a.chapterId) ? -1
            : 0);
    }

    res.json({
      data: result,
      name
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getChapterScore, patchMyChapterScore, getMyScoreAll };