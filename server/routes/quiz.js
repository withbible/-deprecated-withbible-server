const { Router } = require('express');
const router = Router();

const searchController = require("../controller/search");

router.get('/', searchController.getChapter);

router.get('/:chapterid', searchController.getQuiz);

module.exports = router;