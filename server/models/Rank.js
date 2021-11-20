const mongoose = require("mongoose");

const RankSchema = new mongoose.Schema({
  subjectId : {type:String, require: true, unique: true},
  ranks : {type:Array, require: true},

},{timestamps : true})

module.exports = mongoose.model("rank", RankSchema);