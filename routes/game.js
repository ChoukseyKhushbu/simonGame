const express = require("express");
const router = express.Router();
const jwtCheck = require("../middlewares/jwtCheck");
router.get("/", jwtCheck, function (req, res) {
  res.render("game");
});

module.exports = router;
