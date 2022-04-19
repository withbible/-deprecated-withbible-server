const logger = require('../log');
const Quiz = require('../models/Quiz');
const categoryCode = require('../modules/categoryCode');
const { quizService } = require('../services');

const putQuiz = async (req, res) => {
  try {
    const data = await quizService.putQuiz(req.body);

    res.json({
      message: `퀴즈 생성 완료`,
      size: data.length,
      data
    });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getQuizCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const data = await quizService.getQuizCategoryById(categoryId);

    data
      ? res.json({
        category: categoryCode[data[0]["categoryId"]],
        size: Object.keys(data).length,
        data
      })
      : res.status(400).json({ message: "Invalid query" });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
};

const putQuizChapter = async (req, res) => {
  try {
    const { categoryId, title, shuffleQuestions, questions } = req.body;

    const data = await quizService.putQuizChapter({
      categoryId,
      title,
      shuffleQuestions,
      questions
    });

    data
      ? res.json({
        message: `${data.title} 챕터 생성 완료`,
        size: data.questions.length,
        questions: data.questions
      })
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
};

const postQuizQuestion = async (req, res) => {
  try {
    const { categoryId, title, text, options } = req.body;

    const data = await quizService.postQuizQuestion(
      categoryId,
      title,
      text,
      options
    );

    data
      ? res.json({
        message: `${data.title} 챕터 퀴즈 추가 완료`,
        size: data.questions.length,
        questions: data.questions,
      })
      : res.status(400).json({ message: "Invalid query" });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteQuizQuestion = async (req, res) => {
  try {
    const { questionId } = req.query;

    const data = await quizService.deleteQuizQuestion(questionId);

    data
      ? res.json({
        message: `${data.title} 챕터 퀴즈 제거 완료`,
        size: data.questions.length,
        questionsLeft: data.questions
      })
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
};

// +++ Task
const patchQuizQuestionTitle = async (req, res) => {
  try {
    const { categoryId, title, questionId, newTitle } = req.body;

    const data = await Quiz.findOneAndUpdate(
      {
        $and: [
          { categoryId },
          { title },
          { 'questions._id': questionId }
        ]
      },
      {
        $set: { 'questions.$.text': newTitle }
      },
      { new: true }
    );

    data
      ? res.json(data)
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const patchQuizQuestionOptionTitle = async (req, res) => {
  try {
    const { categoryId, title, questionId, optionId, newTitle } = req.body;

    const data = await Quiz.findOneAndUpdate(
      {
        $and: [
          { categoryId },
          { title },
          { 'questions._id': questionId },
          { 'questions.options._id': optionId }
        ]
      },
      {
        $set: { 'questions.options.$.text': newTitle }
      },
      { new: true }
    );

    data
      ? res.json(data)
      : res.status(400).json({ message: "Invalid query" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  putQuiz,
  getQuizCategory,
  putQuizChapter,
  postQuizQuestion,
  patchQuizQuestionTitle,
  deleteQuizQuestion,
  patchQuizQuestionOptionTitle
};