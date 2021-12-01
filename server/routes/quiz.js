const { Router } = require('express');
const router = Router();

const queryDSLController = require("../controller/queryDSL");

router.get('/:chapterId', queryDSLController.getQuiz);

router.get('/', queryDSLController.getChapter);

module.exports = router;