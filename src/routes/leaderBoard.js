const { Router } = require('express');
const router = Router();

const { leaderBoardController } = require('../controllers');

// +++ For EndUser API
router.get('/', leaderBoardController.getLeaderBoard);

// +++ For Admin API
router.put('/', leaderBoardController.putLeaderBoard);

module.exports = router;
