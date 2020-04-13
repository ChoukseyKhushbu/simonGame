const jwt = require("jsonwebtoken");

const loginCheck = (req, res, next) => {
  const tokenExtracted = req.session.token;
  if (tokenExtracted) {
    jwt.verify(tokenExtracted, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.log("Invalid token");
        next();
      } else {
        console.log("user already logged in hence redirected to menu");
        res.redirect("/menu");
      }
    });
  } else {
    //token not found in cookie
    console.log("token not found in cookie hence staying at login");
    next();
  }
};

module.exports = loginCheck;
