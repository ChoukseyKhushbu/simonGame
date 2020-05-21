(function () {
  var userClickedPattern = []; //to store user's pattern of colour

  var gamePattern = []; //to store computer's pattern

  var levl = 0; //starting

  var timer;
  var buttonColours = ["red", "blue", "yellow", "green"];
  var isDemonstrating = true;
  var timeBar = document.querySelector(".timeBar");
  var timeText = document.querySelector(".timeText");
  generateNextLevel();

  $("div#start").one("click", function () {
    console.log(levl);
    startNewLevel();
  });
  // startNewLevel();
  $(".btn").on("click", userSequence);

  function startNewLevel() {
    var countloop = function countloop(i) {
      setTimeout(function () {
        $("div#start").text(4 - i);
        if (i > 3) {
          $("div#start").hide();
          demonstrateLevel();
          $("div#start").text("Next level in->");
        }
      }, 1000 * i);
    };

    for (var i = 1; i <= 4; i++) {
      countloop(i);
    }
  }

  function generateNextLevel() {
    userClickedPattern = [];
    ++levl;
    $("div#level").text("level " + levl);
    timeBar.style.width = "calc(100% - 10px)";
    timeText.innerHTML = levl + "s";
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
    if (userClickedPattern.length == 0 && levl != 1) {
      var time = levl;
      timer = setInterval(function () {
        // console.log(timeText);
        timeBar.style.width = "calc(".concat((time / levl) * 100, "% - 10px)");
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
        startNewLevel();
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
        level: levl - 1,
      },
      function (dataReceived, status) {
        const {data,success}= dataReceived; 
        if (success) {
          console.log(success);
          console.log(data.page);
          window.location.href = `/highscores?page=${data.page}&scoreID=${data.highscore._id}`;
        } else {
          console.log("error");
        }
      }
    );
  }
})();