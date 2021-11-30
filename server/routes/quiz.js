const { Router } = require('express');
const router = Router();

const searchController = require("../controller/search");

router.get('/:chapterId', searchController.getQuiz);

router.get('/', searchController.getChapter);

module.exports = router;