const mongoose = require('mongoose');
const Option = require('./Option').schema;

const QuestionSchema = new mongoose.Schema(
  {    
    text: { type: String, required: true, unique: true },
    options: { type: [Option] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('questions', QuestionSchema);