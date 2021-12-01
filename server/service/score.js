const User = require('../models/User');
const Rank = require("../models/Rank");

const { SUBJECT_CODE_RECORDS } = require("../utils/vo");
const DefaultDict = require('../utils/collection');

const getRankBySubject = async (subjectId) => {
  try {
    return await Rank.findOne({ subjectId }
    );
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const getQuizRecordByChapter = async (chapterId) => {
  try {
    return await User.find({
      [`quizRecord.${chapterId}`]: { "$exists": true }
    });
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const patchQuizRecord = async (username, chapterId, sheet) => {
  try {
    return await User.findOneAndUpdate(
      { username },
      {
        '$set': {
          [`quizRecord.${chapterId}`]: sheet[chapterId]
        }
      },
      { new: true }
    );
  } catch (err) {
    return Promise.reject(err.message);
  }
}

const patchSubjectRank = async (name, totalPercentage) => {
  try {
    return await Rank.findOneAndUpdate(
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
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const getScorePercentage = (user) => Object.entries(user.quizRecord)
  .filter(([chapterId, _]) =>
    chapterId.substring(0, 2) === chapterId.substring(0, 2)
  )
  .map(([_, chapterRecord]) =>
    chapterRecord
      .filter(each => each).length / chapterRecord.length
  )
  .reduce((acc, cur) => acc += cur, 0);

const getScore = (quizRecord) => {
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
};

module.exports = {
  getRankBySubject,
  getQuizRecordByChapter,
  patchQuizRecord,
  patchSubjectRank,
  getScorePercentage,
  getScore
};