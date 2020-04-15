const mongoose = require("mongoose");
const User = require("../models/user");

const highscoreSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Highscore", highscoreSchema);
