const { Router } = require('express');
const router = Router();

const searchController = require("../controller/search");

router.get('/:keyword', searchController.getChapterByKeyword);

// +++ Hashtag keyword API

module.exports = router;