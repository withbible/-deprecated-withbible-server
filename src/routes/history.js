const { Router } = require('express');
const router = Router();

const { historyController } = require('../controllers');

router.put('/', historyController.putHistory);

router.get('/', historyController.getHistory);

router.post('/', historyController.updateHistory);

module.exports = router;