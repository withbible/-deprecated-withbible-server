const { Router } = require('express');
const router = Router();

const searchController = require("../controller/search");

router.get('/synonym/:keyword', searchController.getChapterBySynonymKeyword);

router.get('/:keyword', searchController.getChapterByKeyword);

module.exports = router;