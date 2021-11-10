const mongoose = require("mongoose");

const RankSchema = new mongoose.Schema({
  sd : {type:Array, require: true},
  sw : {type:Array, require: true},
  db : {type:Array, require: true},
  im : {type:Array, require: true}
},{timestamps : true})

module.exports = mongoose.model("rank", RankSchema);