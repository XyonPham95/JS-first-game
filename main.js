/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 626;
canvas.height = 563;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, bulletReady;
let bgImage, heroImage, monsterImage, bullet;
let bX, bY;
let startTime = Date.now();
// const SECONDS_PER_ROUND = 30;
let score = 0;
let elapsedTime = 0;
let gameoverMenu;
let stop = document.getElementById("stop");
let scoreBoard = document.getElementById("scoreBoard");
let scoreB = document.getElementById("scoreB");
let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("resartBtn");
let newHighScore = 0;
let newBestTime = 0;

function getHighest(type) {
  return localStorage.getItem(type);
}

function save() {
  let currentHighestScore = getHighest("newHighScore");
  let currentBestTime = getHighest("newBestTime");

  if (
    !currentHighestScore ||
    (currentHighestScore && currentHighestScore < score)
  ) {
    localStorage.setItem("newHighScore", score);
  }

  if (!currentBestTime || (currentBestTime && currentBestTime < elapsedTime)) {
    localStorage.setItem("newBestTime", elapsedTime);
  }
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "img/BG.jpg";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "img/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "img/Demon.png";

  bullet = new Image();
  bullet.onload = function () {
    // show the hero image
    bulletReady = true;
  };
  bullet.src = "img/bull.png";
}

/**
 * Setting up our characters.
 *
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 *
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let bs = 15;
let test = false;

let monsterX = Math.floor(Math.random() * canvas.width);
if (monsterX <= 0) {
  monsterX = 0;
} else if (monsterX + 34 > canvas.height) {
  monsterX = Math.floor(Math.random() * canvas.width - 50) + 24;
}
let monsterY = Math.floor(Math.random() * canvas.height);
if (monsterY <= 0) {
  monsterY = 0;
} else if (monsterY + 34 > canvas.height) {
  monsterY = Math.floor(Math.random() * canvas.height - 50) + 24;
}
let gameOver = false;
/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  addEventListener(
    "keydown",
    function (key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function (key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  function setState(state) {
    gameState = state;
    showMenu(state);
  }

  function displayMenu(menu) {
    menu.style.visability = "visable";
  }

  function showMenu(state) {
    if (state == "GameOver") {
      displayMenu(gameoverMenu);
    }
  }
  if (test == true) {
    return;
  }

  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
  }

  if (heroX < 0) {
    heroX = canvas.width - 34;
  } else if (heroX + 34 > canvas.width) {
    heroX = 0;
  }
  if (heroY < 0) {
    heroY = canvas.height - 34;
  } else if (heroY + 34 > canvas.height) {
    heroY = 0;
  }

  if (elapsedTime % 3 === 0) {
    bX = monsterX;
    bY = monsterY;
  }

  //   let buX = heroX - monsterX;
  //   let buY = heroY - monsterY;
  //   var length = Math.sqrt(buX * buX + buY * buY);
  //   buX /= length;
  //   buY /= length;

  if ((bX, bY)) {
    // let startX = monsterX + buX * monsterX / 2;
    // let startY = monsterY + buY * monsterX / 2;
    // let endX = startX + buX * 3000;
    // let endY = startY + buY * 3000;
    x = heroX + 15 - monsterX;
    y = heroY + 15 - monsterY;
    bX += Math.round(x / 20);
    bY += Math.round(y / 20);
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= monsterX + 24 &&
    monsterX <= heroX + 24 &&
    heroY <= monsterY + 24 &&
    monsterY <= heroY + 24
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = Math.floor(Math.random() * canvas.width);
    if (monsterX <= 0) {
      monsterX = 0;
    } else if (monsterX + 34 > canvas.height) {
      monsterX = Math.floor(Math.random() * canvas.width - 50);
    }
    monsterY = Math.floor(Math.random() * canvas.height);
    if (monsterY <= 0) {
      monsterY = 0;
    } else if (monsterY + 34 > canvas.height) {
      monsterY = Math.floor(Math.random() * canvas.height - 50);
    }
    score += 1;
  }
  let scoreB = [];

  drawScoreboard();

  function drawScoreboard() {
    scoreB.push(score);
    document.getElementById("scoreB").innerHTML = `Your Score: ${scoreB}`;
  }

  // Game Over
  gameoverMenu = document.getElementById("gameOver");

  if (
    heroX <= bX + 24 &&
    heroY <= bY + 24 &&
    bX <= heroX + 24 &&
    bY <= heroY + 24
  ) {
    gameOver = true;
  }

  function restartBTn() {
    update();
    loadImages();
    render();
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (bulletReady && bX && bY) {
    ctx.drawImage(bullet, bX, bY);
  }
  if (gameOver) {
    ctx.clearRect(0, 0, 626, 563);
    startBtn.style.display = "inline";
  }

  // ctx.font = "30px Changa one";
  // ctx.fillText(`Score: ${score}`, 20, 35);
  // document.getElementById("score-area").innerHTML = `${score}`;
  // document.getElementById("high-score").innerHTML = getHighest("newHighScore");
  // ctx.fillText("Score : " + score, 10, 50);
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */

var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
