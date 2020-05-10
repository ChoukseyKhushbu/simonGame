(function () {
  var userClickedPattern = []; //to store user's pattern of colour

  var gamePattern = []; //to store computer's pattern

  var gamelevel = 0; //starting

  var timer;
  var buttonColours = ["red", "blue", "yellow", "green"];
  var isDemonstrating = true;
  var timeBar = document.querySelector(".timeBar");
  var timeText = document.querySelector(".timeText");
  generateNextLevel();
  $("div#start").on("click", function () {
    startNewLevel();
  });
  $(".btn").on("click", userSequence);

  function startNewLevel() {
    let i = 3;

    var interval = setInterval(function CountDown() {
      $("div#start").text = i;
      i--;
    }, 1000);

    if (i === 0) {
      clearInterval(interval);
      $("div#start").hide();
      setTimeout(demonstrateLevel, 500);
    }
  }

  function generateNextLevel() {
    userClickedPattern = [];
    ++gamelevel;
    $("div#level").text("level " + gamelevel);
    timeBar.style.width = "calc(100% - 10px)";
    timeText.innerHTML = gamelevel + "s";
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColours[randomNumber];
    gamePattern.push(randomChosenColor);
  }

  function demonstrateLevel() {
    $("div#blockScreen").show();

    var _loop = function _loop(i) {
      setTimeout(function () {
        playSound(gamePattern[i]);
        animatePress(gamePattern[i]);

        if (i == gamePattern.length - 1) {
          $("div#blockScreen").hide();
        }
      }, 1000 * i);
    };

    for (var i = 0; i < gamePattern.length; i++) {
      _loop(i);
    }
  }

  function userSequence() {
    if (userClickedPattern.length == 0 && gamelevel != 1) {
      var time = gamelevel;
      timer = setInterval(function () {
        // console.log(timeText);
        timeBar.style.width = "calc(".concat(
          (time / gamelevel) * 100,
          "% - 10px)"
        );
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
    setTimeout(function () {
      $("#" + currentColour).removeClass("pressed");
    }, 100);
  }

  function endGame(reason) {
    clearInterval(timer);
    $("div#gameover").text(reason);
    $("div#gameover").css("display", "flex"); //hit POST/highscore

    $.post(
      "/highscores",
      {
        level: gamelevel - 1,
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
})();
