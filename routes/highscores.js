const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Highscores = require("../models/highscore");
const jwtCheck = require("../middlewares/jwtCheck");

router.get("/", jwtCheck, function (req, res) {
  Highscores.find({})
    .populate("userid")
    .sort({ level: -1 })
    .limit(10)
    .exec(function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
        res.render("highscores", { usersWithHighscores: docs });
      }
    });
});

router.post("/", jwtCheck, function (req, res) {
  const level = req.body.level;

  const newScore = new Highscores({
    _id: new mongoose.Types.ObjectId(),
    userid: req.user.id,
    level: level,
  });
  newScore
    .save()
    .then((score) => {
      console.log("added successfully");
      res.status(200).json({
        success: true,
        data: {
          highscore: score,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        errors: err.message,
      });
    });
});

module.exports = router;
