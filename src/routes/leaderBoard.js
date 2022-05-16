const { Router } = require('express');
const router = Router();

const { leaderBoardController } = require('../controllers');

router.put('/', leaderBoardController.putLeaderBoard);

router.get('/', leaderBoardController.getLeaderBoard);

module.exports = router;
