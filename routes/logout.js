const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  req.session = null;
  res.redirect("/login");
});

module.exports = router;
