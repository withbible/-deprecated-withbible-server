const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: Number, require: true },
    title: { type: String, require: true },
    score: { type: String },
    timeTaken: { type: String },
    date: { type: String }, // +++ Use created timestamp
    status: { type: String },
  }
);

module.exports = mongoose.model('histories', HistorySchema);