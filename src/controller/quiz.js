const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Quiz = require('../models/Quiz');

const getQuizCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const data = await Quiz.findOne({ categoryId });

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const putQuiz = async (req, res) => {
  try {
    const data = Quiz.insertMany(req.body);
    data.then(data => res.json(data));

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const putQuizCategory = async (req, res) => {
  try {
    const { id, categoryId, title, shuffleQuestions, questions } = req.body;

    const data = await new Quiz({
      id,
      categoryId,
      title,
      shuffleQuestions,
      questions
    }).save();

    res.json(data);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const patchQuizQuestion = async (req, res) => {
  try {
    const { categoryId, title, questionId, newTitle } = req.body;

    const data = await Quiz.findOneAndUpdate(
      {
        $and: [
          { categoryId },
          { title },
          { 'questions.$_id': ObjectId(questionId) }
        ]
      },
      {
        $set: { 'questions.$.text': newTitle }
      }
    );

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// +++ Todo
const patchQuizQuestionOption = async(req, res) => {

};

const deleteQuizQuestion = async(req, res) => {

};

module.exports = {
  getQuizCategory,
  putQuiz,
  putQuizCategory,
  patchQuizQuestion
};