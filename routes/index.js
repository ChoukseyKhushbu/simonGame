const express = require("express");
const router = express.Router();
const loginCheck = require("../middlewares/loginCheck");
/* GET home page. */
router.get("/", loginCheck, function (req, res, next) {
  // console.log(req.session.name);
  // if (req.session.name) {
  //   res.send(`Hello ${req.session.name}`);
  // } else {
  //   req.session = { name: "khushbu" };
  //   res.send("no user");
  // }
  res.render("login");
});

module.exports = router;
