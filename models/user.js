const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  streak: {type: Number,default: 0},
});

module.exports = mongoose.model("User", userSchema);
