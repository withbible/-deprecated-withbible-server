const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const LeaderBoardSchema = new mongoose.Schema({  
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  photoPath: { type: String },
  score: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model("leaderboards", LeaderBoardSchema);