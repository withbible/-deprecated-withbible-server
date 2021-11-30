const User = require('../models/User');
const Rank = require("../models/Rank");

const SUBJECT_CODE_RECORDS = require("../utils/quiz");
const DefaultDict = require('../utils/collection');
const logger = require('../log');

const getSubjectRank = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const allRank = await Rank.findOne(
      { subjectId: subjectId }
    );
    res.json({ data: allRank.ranks.slice(0, 3) });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
}

const getChapterScore = async (req, res) => {
  try {
    const { chapterId } = req.params;
    res.json(await User.find({
      [`quizRecord.${chapterId}`]: { "$exists": true }
    }));
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const patchMyChapterScore = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { sheet } = req.body;
    const { name, username } = req.session.user;
    
    if(!sheet[chapterId] || !sheet[chapterId].length)
      throw new Error("invalid data");

    const user = await User.findOneAndUpdate(
      { username },
      {
        '$set': {
          [`quizRecord.${chapterId}`]: sheet[chapterId]
        }
      },
      { new: true }
    )
        
    const totalPercentage = Object.entries(user.quizRecord)
      .filter(([chapterId, _]) =>
        chapterId.substring(0, 2) === chapterId.substring(0, 2)
      )
      .map(([_, chapterRecord]) =>
        chapterRecord
          .filter(each => each).length / chapterRecord.length
      )
      .reduce((acc, cur) => acc += cur, 0);  
        
    const result = await Rank.findOneAndUpdate(
      { 
        'subjectId': chapterId.substring(0, 2),
        ranks: { '$elemMatch': { name } },
      },
      {
        '$set': {
          'ranks.$.name': name,
          'ranks.$.correctAnswerRate': totalPercentage
        }
      },
      {
        upsert: true,
        new: true,  
      }
    );

    res.json({
      message: `${result.subjectId} / ${chapterId} is updated`,
      data: result
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const getMyScoreRaw = (req, res) => {
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

const getMyScoreDetail = async (req, res) => {
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
};

module.exports = {
  getSubjectRank,
  getChapterScore,
  patchMyChapterScore,
  getMyScoreRaw,
  getMyScoreDetail
};