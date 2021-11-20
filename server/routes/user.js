const { Router } = require('express');
const router = Router();

const User = require("../models/User");
const Rank = require("../models/Rank");

const authenticate = require('../middleware/authentication');
const authController = require('../controller/auth');
const recordController = require('../controller/record');

router.post('/register', authController.register);

router.patch('/login', authController.login);

router.use(authenticate);

router.patch('/logout', authController.logout);

router.get('/me', authController.keepLogin);

router.patch("/record/:chapterid", async (req, res) => {
  try {
    const { name, username } = req.session.user;
    const { chapterid } = req.params;
    const user = await User.findOneAndUpdate(
      { username },
      {
        "$set": {
          [`quizRecord.${chapterid}`]: req.body.sheet[chapterid]
        }
      },
      { new: true }
    )
    const scorePercentage = [];
    for (var key in user.quizRecord) {
      if (key.substring(0, 2) == chapterid.substring(0, 2)) {
        scorePercentage.push(user.quizRecord[key].filter(each => each === true).length / user.quizRecord[key].length);
      }
    }
    const totalPercentage = scorePercentage.reduce((acc, cur) => acc += cur, 0);
    console.log(totalPercentage, chapterid);
    const result = await Rank.findOneAndUpdate(
      {
        'subjectId': chapterid.substring(0, 2),
        ranks: {
          '$elemMatch': {
            name
          }
        },
      },
      {
        '$set': {
          'ranks.$.name': name,
          'ranks.$.correctAnswerRate': totalPercentage
        }
        // '$sort': { correctAnswerRate: -1 }
      },
      { new: true }
    );
    // .exec();
    res.json({
      message: `${chapterid} is updated`,
      data: result
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/ranking/:subjectId", recordController.getSubjectRank);

router.get('/totalscore/:chapterid', recordController.getChapterScore);

router.patch('/myscore/:chapterid', recordController.patchMyChapterScore);

router.get('/myscore', recordController.getMyScoreAll);

module.exports = router;
