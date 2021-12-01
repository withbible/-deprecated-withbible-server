const { Router } = require('express');
const router = Router();

const authenticate = require('../middleware/authentication');
const scoreController = require('../controller/score');

router.get("/aggregate/all/rank/:subjectId", scoreController.getRankBySubject);

router.get('/raw/all/:chapterId', scoreController.getQuizScoreByChapter);

router.use(authenticate);

router.get('/aggregate/me', scoreController.getMyQuizScoreDetail);

router.patch('/raw/me/:chapterId', scoreController.patchMyQuizScoreWithRank);

router.get('/raw/me', scoreController.getMyQuizScore);


module.exports = router;