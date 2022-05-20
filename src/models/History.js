const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: Number, required: true },
    title: { type: String, required: true },
    answerSheet: { type: [String] },
    score: { type: String },
    timeTaken: { type: String },
    date: { type: String },     // +++ Use created timestamp
    status: { type: String },
  }
);

module.exports = mongoose.model('histories', HistorySchema);