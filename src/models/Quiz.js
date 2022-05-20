const mongoose = require('mongoose');
const Question = require('./Question').schema;

const QuizSchema = new mongoose.Schema(
  {
    categoryId: { type: Number, required: true },
    title: { type: String, required: true, unique: true },
    shuffleQuestions: { type: Boolean },
    questions: { type: [Question] },
  }
);

module.exports = mongoose.model('quizzes', QuizSchema);