const mongoose = require('mongoose');
const Question = require('./Question').schema;

const QuizSchema = new mongoose.Schema(
  {
    categoryId: { type: Number, require: true },
    title: { type: String, require: true, unique: true },
    shuffleQuestions: { type: Boolean },
    questions: { type: [Question] },
  }
);

module.exports = mongoose.model('quizzes', QuizSchema);