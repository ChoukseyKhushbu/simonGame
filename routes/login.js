const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const loginCheck = require("../middlewares/loginCheck");

router.post("/", function (req, res) {
  console.log(req.body);
  const { username, password } = req.body;
  console.log(username + " " + password);
  let errors = {};

  if (!username) {
    errors.username = "Username is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  if (!(Object.entries(errors).length === 0 && errors.constructor === Object)) {
    // res.status(422).json({
    //   success: false,
    //   errors: errors,
    // });
    res.render("login", {
      errors,
    });
  } else {
    User.findOne({ username: username })
      .select("+password")
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const accessToken = jwt.sign(
              {
                sub: user.id,
                username: user.username,
              },
              process.env.JWT_SECRET
            );
            // res.status(200).json({
            //   success: true,
            //   data: {
            //     user: {
            //       username: user.username,
            //     },
            //   },
            //   token: accessToken,
            //   msg: "successfully logged in",
            // });

            // TODO: Set the cookie with the jwtToken
            req.session = {
              token: accessToken,
            };
            res.redirect("/");
          } else {
            // res.status(401).json({
            //   success: false,
            //   errors: {
            //     password: "Invalid Password",
            //   },
            // });
            res.render("login", {
              errors: {
                password: "Invalid Password",
              },
            });
          }
        } else {
          // User not found, creating a new user
          bcrypt
            .hash(password, +process.env.BCRYPT_SALT_ROUNDS)
            .then((hashedPassword) => {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: username,
                password: hashedPassword,
              });
              user
                .save()
                .then((user) => {
                  const accessToken = jwt.sign(
                    {
                      sub: user.id,
                      username: user.username,
                    },
                    process.env.JWT_SECRET
                  );
                  // res.status(200).json({
                  //   success: true,
                  //   data: {
                  //     user: {
                  //       username: user.username,
                  //     },
                  //   },
                  //   token: accessToken,
                  //   msg: "successfully registered",
                  // });
                  req.session = {
                    token: accessToken,
                  };
                  res.redirect("/");
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).json({
                    success: false,
                    errors: err.message,
                  });
                });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({
                success: false,
                errors: err.message,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          errors: err.message,
        });
      });
  }
});

router.get("/", loginCheck, function (req, res) {
  res.render("login", { errors: {} });
});

module.exports = router;
