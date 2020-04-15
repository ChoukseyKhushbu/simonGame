var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var session = require("cookie-session");
dotenv.config();

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var menuRouter = require("./routes/menu");
var gameRouter = require("./routes/game");
var instructionsRouter = require("./routes/instructions");
var highscoresRouter = require("./routes/highscores");
var logoutRouter = require("./routes/logout");
var instructionsRouter = require("./routes/instructions");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//setting cookie-session

app.use(
  session({
    name: "session",
    keys: [process.env.COOKIE_SESSION_KEY1, process.env.COOKIE_SESSION_KEY2],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/menu", menuRouter);
app.use("/game", gameRouter);
app.use("/instructions", instructionsRouter);
app.use("/highscores", highscoresRouter);
app.use("/logout", logoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
