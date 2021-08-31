const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  chapter: {
    type: String,
    required: true,
  },
  scoreDetail: {
    type: [Boolean],
    required: true,
  }
})

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;