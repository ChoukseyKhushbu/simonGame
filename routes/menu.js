const express = require("express");
const jwtCheck = require("../middlewares/jwtCheck");
const router = express.Router();

router.get("/", jwtCheck, function (req, res) {
  res.render("menu");
});

module.exports = router;
