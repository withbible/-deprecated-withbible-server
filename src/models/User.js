const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  histories: [{ type: ObjectId, ref: "histories" }]
});

module.exports = mongoose.model("users", UserSchema);