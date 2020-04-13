const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.session.name);
  if (req.session.name) {
    res.send(`Hello ${req.session.name}`);
  } else {
    req.session = { name: "khushbu" };
    res.send("no user");
  }
});

module.exports = router;
