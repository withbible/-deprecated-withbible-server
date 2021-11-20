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

router.get("/ranking/:subjectId", recordController.getSubjectRank);

router.get('/totalscore/:chapterid', recordController.getChapterScore);

router.patch('/myscore/:chapterid', recordController.patchMyChapterScore);

router.get('/myscore', recordController.getMyScoreAll);

module.exports = router;
