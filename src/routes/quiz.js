const { Router } = require('express');
const router = Router();

const queryController = require("../controller/quiz");

// +++ For EndUser API
router.get('/category/:categoryId', queryController.getQuizCategory);


// +++ For Admin API
router.put('/', queryController.putQuiz);

router.put('/category', queryController.putQuizCategory);

router.patch('/question', queryController.patchQuizQuestion);

module.exports = router;