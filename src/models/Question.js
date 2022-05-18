const mongoose = require('mongoose');
const Option = require('./Option').schema;

const QuestionSchema = new mongoose.Schema(
  {
    // +++ In Production need unique option
    text: { type: String, require: true },
    options: { type: [Option] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('questions', QuestionSchema);