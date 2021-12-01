const { Router } = require('express');
const router = Router();

const queryDSLController = require("../controller/queryDSL");

router.get('/synonym/:keyword', queryDSLController.getChapterBySynonymKeyword);

router.get('/:keyword', queryDSLController.getChapterByKeyword);

module.exports = router;