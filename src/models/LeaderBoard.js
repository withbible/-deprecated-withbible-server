const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const LeaderBoardSchema = new mongoose.Schema({
  photoPath: { type: String, unique: true },
  totalScore: { type: Number, required: true },
  user: {
    type: ObjectId,
    ref: "users",
    index: { unique: true }
  }
});

module.exports = mongoose.model("leaderboards", LeaderBoardSchema);