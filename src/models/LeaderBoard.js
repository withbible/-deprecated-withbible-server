const mongoose = require("mongoose")

const LeaderBoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  photoPath: { type: String },
  score: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("leaderBoards", LeaderBoardSchema);