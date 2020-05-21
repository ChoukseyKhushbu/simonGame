const express = require("express");
const jwtCheck = require("../middlewares/jwtCheck");
const Highscores = require("../models/highscore");

const router = express.Router();

router.get("/", jwtCheck, async (req, res) => {
  const currentUserID = req.user.id;
const userScores = await Highscores.find({userid:currentUserID}).sort({createdAt:"desc"});

if(userScores.length){
  const currentScoreID= userScores[0]._id;
  res.render("menu",{scoreID:currentScoreID});
}else{
  res.render("menu",{scoreID:""});
}
});

module.exports = router;
