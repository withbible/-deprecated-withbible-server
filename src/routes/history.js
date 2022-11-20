const { Router } = require('express');
const router = Router();

const { historyController } = require('../controllers');

// +++ For EndUser API
router.put('/', historyController.putHistory);

router.get('/', historyController.getHistory);

router.post('/', historyController.updateHistory);

router.get('/score', historyController.getTotalScore);

module.exports = router;