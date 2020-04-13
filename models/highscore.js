const mongoose = require("mongoose");
const highscoreSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, required: true },
    level: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Highscore", highscoreSchema);
