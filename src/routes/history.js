const { Router } = require('express');
const router = Router();

const { historyController } = require('../controllers');

router.put('/', historyController.putHistory);

router.get('/', historyController.getHistory);

module.exports = router;