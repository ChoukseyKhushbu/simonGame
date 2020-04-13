const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("start the game");
});

module.exports = router;
