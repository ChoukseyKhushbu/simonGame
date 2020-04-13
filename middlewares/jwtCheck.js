const jwt = require("jsonwebtoken");

const jwtCheck = (req, res, next) => {
  const tokenExtracted = req.session.token;
  if (tokenExtracted) {
    jwt.verify(tokenExtracted, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.log("Invalid token");
        res.redirect("/login");
      } else {
        req.user = {
          id: payload.sub,
          username: payload.username,
        };
        next();
      }
    });
  } else {
    //token not found in cookie
    console.log("token not found in cookie hence redirected to login");
    res.redirect("/login");
  }
};

module.exports = jwtCheck;
