const { Router } = require('express');
const router = Router();

const { quizController } = require("../controllers");

// +++ For EndUser API
router.get('/category/:categoryId', quizController.getQuizCategory);


// +++ For Admin API
router.put('/', quizController.putQuiz);

router.put('/chapter', quizController.putQuizChapter);

router.post('/question', quizController.postQuizQuestion);

router.delete('/question', quizController.deleteQuizQuestion);

module.exports = router;