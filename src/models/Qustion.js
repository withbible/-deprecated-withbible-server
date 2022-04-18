const mongoose = require('mongoose');
const Option = require('../models/Option').schema;

const QuestionSchema = new mongoose.Schema(
  {
    text: { type: String, require: true },
    options: { type: [Option] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('questions', QuestionSchema);