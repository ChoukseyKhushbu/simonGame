const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const jwtCheck = require("../middlewares/jwtCheck");
const Highscores = require("../models/highscore");
const Users = require("../models/user");
const statCheck = require("../middlewares/statCheck");

const router = express.Router();

function segment(duration) {
    return duration.as('hours') > 8760 ? Math.round(duration.as('hours') / 8760) + 'y ago' :
        duration.as('hours') > 730 ? Math.round(duration.as('hours') / 730) + 'M ago' :
            duration.as('hours') > 168 ? Math.round(duration.as('hours') / 168) + 'w ago' :
                duration.as('hours') > 24 ? Math.round(duration.as('hours') / 24) + 'd ago' :
                    duration.as('hours') > 1 ? Math.round(duration.as('hours')) + 'h ago' :
                        duration.as('minutes') > 1 ? Math.round(duration.as('minutes')) + 'm ago' :
                            duration.as('seconds') > 0 ? Math.round(duration.as('seconds')) + 's ago' : '';
}

router.get("/:userID",statCheck, async (req, res) => {

    const userID = req.params.userID;
    const currUserId = req.user.id==userID ? userID : null;
    try {
        let user, rank = 0, total = 0, lastSeen, highestScore = {level:0},percentile;
        const userScores = await Highscores.find({ userid: userID }).populate("userid").sort({ createdAt: "desc" });

        if (!userScores.length) {
            user = await Users.findById(userID);
        } else {
            total = userScores.reduce((acc, score) => {
                highestScore = score.level > highestScore.level ? score : highestScore;
                return score.level + acc;
            }, 0);
            
            const greaterScoreCount = await Highscores.find({ level: { $gt: highestScore.level }}).countDocuments();
            const sameScoreCount = await Highscores.find({level:highestScore.level, createdAt:{$lt:highestScore.createdAt}}).countDocuments();
            rank = greaterScoreCount + sameScoreCount+1;
            console.log(moment(userScores[0].createdAt).fromNow());
            lastSeen = segment(moment.duration(moment().diff(userScores[0].createdAt)));

            const userCount = await Highscores.find().estimatedDocumentCount().exec();
            percentile = rank? (((userCount-rank)/userCount)*100).toFixed(1): "0";
        }

        res.render("user", {
            rank: rank || "-",
            userName: (userScores && userScores.length) ? userScores[0].userid.username : user.username,
            highestScore: (userScores && userScores.length) ? highestScore.level : "-",
            latestScore: (userScores && userScores.length) ? userScores[0].level : "-",
            averageScore: (userScores && userScores.length)? Math.ceil(total / (userScores.length)) : "-",
            gamesPlayed: userScores.length || 0,
            lastSeen: lastSeen || "-",
            percentile:percentile ? percentile+"%" : "-",
            userID:userID,
            currUserId:currUserId
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            errors: err.message,
        });
    }
});

module.exports = router;