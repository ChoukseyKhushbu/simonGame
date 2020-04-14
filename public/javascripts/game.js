var userClickedPattern = []; //to store user's pattern of colour
var gamePattern = []; //to store computer's pattern
var level = 0; //starting
var interval;
var buttonColours = ["red", "blue", "yellow", "green"];

function generateNextLevel() {
  userClickedPattern = [];
  ++level;
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColours[randomNumber];
  gamePattern.push(randomChosenColor);
}

generateNextLevel();

$("div#start").on("click", function () {
  startNewLevel();
});

$(".btn").on("click", userSequence);

function startNewLevel() {
  $("div#start").hide();
  demonstrateLevel();
}

function userSequence() {
  //   if (userClickedPattern.length == 0 && level != 1) {
  //     // interval = setTimeout(() => {
  //     //   endGame();
  //     // }, level * 1000);
  //   }
  console.log(this);
  var userChosenColor = $(this).attr("id"); // getting user clicked colour
  userClickedPattern.push(userChosenColor);

  animatePress(userChosenColor);
  playSound(userChosenColor);
  checkPattern(userClickedPattern.length - 1);
}

function demonstrateLevel() {
  for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(() => {
      playSound(gamePattern[i]);
      animatePress(gamePattern[i]);
    }, 1500 * i);
  }
}

function endGame() {
  //   clearInterval(interval);
  $("div#gameover").css("display", "flex");
  //hit POST/highscore
}

function checkPattern(currentLevel) {
  if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
    console.log("success");

    if (userClickedPattern.length == gamePattern.length) {
      //   clearInterval(interval);
      generateNextLevel();
      $("div#level").text("level " + level);
      //show div.start
      $("div#start").show();
    }
  } else {
    endGame();
  }
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
