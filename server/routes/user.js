const { Router } = require('express');
const router = Router();

const User = require("../models/User");
const Rank = require("../models/Rank");

const { SUBJECT_CODE } = require("../utils/quiz");
const DefaultDict = require('../utils/collection');
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
    
    if (!req.user)
      throw new Error("권한이 없습니다.");
    const { name, quizRecord } = req.user;
    const { chapterid } = req.params;
    const users = await User.findByIdAndUpdate(req.user.id,
      {
        "$set": {
          [`quizRecord.${chapterid}`]: req.body.sheet[chapterid]
        }
      },
    );

    const scorePercentage = [];//그 챕터의 정답률 배열
    for(var key in users.quizRecord){
      if(key.substring(0,2) == chapterid.substring(0,2)){
        scorePercentage.push(users.quizRecord[key].filter(each => each === true).length/users.quizRecord[key].length);
      }
    }
    const totalPercentage = scorePercentage.reduce((acc,cur)=>{return acc+= cur},0);//총 정답률의 합
    

    await Rank.findOneAndUpdate(
      {subjectId : chapterid.substring(0,2)},
      {
        $push:{
          ranks:{
            $each : [{ 
              name : name,
              correctAnswerRate : totalPercentage
              }],
            $sort : {correctAnswerRate : -1},
          }
        }
      }
    ).exec();
    res.json({ message: `${chapterid} is updated` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/ranking/:subjectId",async(req,res)=>{
  try{
    if (!req.user)
    throw new Error("권한이 없습니다.");
    const { subjectId } = req.params;//ex : sd
    const topRankingdb = [];
    const allRankingDb = await Rank.findOne(
      {subjectId : subjectId}
    )
    for(let i=0; i<3;i++){
      topRankingdb.push(allRankingDb.ranks[i]);
    }
    res.json({data: topRankingdb});
  } catch(err){
    console.error(err);
    res.status(400).json({ message: err.message });
  }
})

router.get('/totalscore/:chapterid', recordController.getChapterScore)

router.patch('/myscore/:chapterid', recordController.patchMyChapterScore);

router.get('/myscore', recordController.getMyScoreAll);

module.exports = router;
