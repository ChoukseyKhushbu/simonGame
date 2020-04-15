var userClickedPattern = []; //to store user's pattern of colour
var gamePattern = []; //to store computer's pattern
var level = 0; //starting
var timer;
var buttonColours = ["red", "blue", "yellow", "green"];
var isDemonstrating = true;

const timeBar = document.querySelector(".timeBar");
const timeText = document.querySelector(".timeText");

function generateNextLevel() {
  userClickedPattern = [];
  ++level;
  $("div#level").text("level " + level);

  timeBar.style.width = "calc(100% - 10px)";
  timeText.innerHTML = level + "s";

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
  if (userClickedPattern.length == 0 && level != 1) {
    let time = level;
    timer = setInterval(() => {
      console.log(timeText);
      timeBar.style.width = `calc(${(time / level) * 100}% - 10px)`;
      timeText.innerHTML = time + "s";
      time--;
      if (time === -1) {
        clearInterval(timer);
        endGame("TIME OVER");
      }
    }, 1000);
  }

  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);

  animatePress(userChosenColor);
  playSound(userChosenColor);
  checkPattern(userClickedPattern.length - 1);
}

function demonstrateLevel() {
  $("div#blockScreen").show();
  for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(() => {
      playSound(gamePattern[i]);
      animatePress(gamePattern[i]);
      if (i == gamePattern.length - 1) {
        $("div#blockScreen").hide();
      }
    }, 1000 * i);
  }
}

function endGame(reason) {
  clearInterval(timer);
  $("div#gameover").text(reason);
  $("div#gameover").css("display", "flex");
  //hit POST/highscore
  $.post(
    "/highscores",
    {
      level: level - 1,
    },
    function (data, status) {
      if (data.success) {
        window.location.href = "/highscores";
      } else {
        console.log("error");
      }
    }
  );
}

function checkPattern(currentLevel) {
  if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
    if (userClickedPattern.length == gamePattern.length) {
      clearInterval(timer);
      generateNextLevel();

      $("div#start").show();
    }
  } else {
    endGame("WRONG CLICK");
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
