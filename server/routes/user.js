const { Router } = require('express');
const router = Router();

const authenticate = require('../middleware/authentication');
const authController = require('../controller/auth');
const recordController = require('../controller/record');

router.post('/register', authController.register);

router.patch('/login', authController.login);

router.patch('/logout', authController.logout);

router.use(authenticate);

router.get('/me', (req, res) => {
  const { name, quizRecord } = req.session.user;
  try {
    res.json({
      message: 'keep logined',
      name,
      quizRecord
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/totalscore/:chapterid', recordController.getChapterScore)

router.patch('/myscore/:chapterid', recordController.patchMyScore);

router.get('/myscore', recordController.getMyScoreAll);

module.exports = router;