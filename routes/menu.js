const express = require("express");
const jwtCheck = require("../middlewares/jwtCheck");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("menu");
});

module.exports = router;
