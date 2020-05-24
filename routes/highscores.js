const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Highscores = require("../models/highscore");
const jwtCheck = require("../middlewares/jwtCheck");

router.get("/", jwtCheck, async (req, res) => {
  const page = Number(req.query.page || 1);
  const scoreID=req.query.scoreID;
  const skip = (page - 1) * 10;
  try {
    const highscores = await Highscores.find({})
      .populate("userid") //to get username
      .sort({ level: "desc", createdAt: "asc" }) //to get greater score first
      .skip(skip) //to skip particuar no. of documents for pagination
      .limit(10) //to get only 10 documents
      .exec();

    //gives the count of total documents present in Highscores
    const documentCount = await Highscores.find()
      .estimatedDocumentCount()
      .exec();

    // console.log(documentCount);
    // console.log(highscores);
    // console.log(typeof(highscores[0]._id))

    res.render("highscores", {
      usersWithHighscores: highscores,
      lastPage: Math.ceil(documentCount / 10),
      startRank: skip + 1,
      currentPage: page,
      scoreID:scoreID,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      errors: err.message,
    });
  }
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
      const count = Highscores.find({ level: { $gte: level } }).countDocuments();
      // console.log(count);
      return count;
    }).then((count) => {
      console.log("count: ",count);
      const page = Math.ceil(count / 10);
      res.status(200).json({
        success: true,
        data: {
          highscore: newScore,
          page: page,
          rank: count,
        },
      });
    }).catch((err) => {
      console.log(err);
      console.log("page not found");
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
//Highscores.findById(score._id).sort({ level: "desc", createdAt: "asc" }).count();