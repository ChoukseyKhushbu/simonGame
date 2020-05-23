const express = require("express");
const jwtCheck = require("../middlewares/jwtCheck");

const router = express.Router();

router.get("/", jwtCheck, async (req, res) => {
  const userID = req.user.id;

  res.render("menu",{userID:userID});
});

module.exports = router;
