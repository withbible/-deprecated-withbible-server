const { Router } = require('express');
const router = Router();

const authenticate = require('../middleware/authentication');
const scoreController = require('../controller/score');

router.get("/totalscore/rank/:subjectId", scoreController.getSubjectRank);

router.get('/totalscore/:chapterid', scoreController.getChapterScore);

router.use(authenticate);

router.patch('/myscore/:chapterid', scoreController.patchMyChapterScore);

router.get('/myscore/raw', scoreController.getMyScoreRaw);

router.get('/myscore/detail', scoreController.getMyScoreDetail);

// +++ Delete Quiz API

module.exports = router;