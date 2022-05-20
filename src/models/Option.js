const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }
);

module.exports = mongoose.model('options', OptionSchema);