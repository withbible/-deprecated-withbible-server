const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  candidate: {
    type: String,
    required: true,
  },
  points: {
    type: String,
    required: true,
  }
});

// Create collection and adds schema
const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;