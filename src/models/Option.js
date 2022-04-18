const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema(
  {
    code: { type: String, require: true },
    text: { type: String, require: true },
    isCorrect: { type: Boolean, require: true }
  }
);

module.exports = mongoose.model('options', OptionSchema);