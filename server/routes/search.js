const { Router } = require('express');
const router = Router();

const searchController = require("../controller/search");

router.get('/keyword', searchController.getChapterByKeyword);

router.get('/sample/:synonnym', searchController.getChapterBySynonymKeyword);

module.exports = router;