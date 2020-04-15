const express = require("express");
const router = express.Router();
const jwtCheck = require("../middlewares/jwtCheck");
router.get("/", function (req, res) {
  res.render("instructions");
});

module.exports = router;
