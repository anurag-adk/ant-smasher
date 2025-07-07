//defining game container and scoreboard elements
const gameArea = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const highScoreSpan = document.getElementById("high-score");
const restartBtn = document.getElementById("restart-btn");
const pauseBtn = document.getElementById("pause-btn");
const smashSound = document.getElementById("smash-sound");

//defining score variables and keeping track of highscore with localStorge
let score = 0;
let highScore = parseInt(localStorage.getItem("antHighScore")) || 0;
let antInterval = null;
let antSpawnRate = 1200;
let isPaused = false;
let gameStarted = false;
let gameOver = false;

highScoreSpan.textContent = highScore;

//core app functions
const startGame = () => {
  const oldGameOver = document.getElementById("game-over");
  if (oldGameOver) oldGameOver.remove();
  score = 0;
  scoreSpan.textContent = score;
  gameArea.innerHTML = "";
  if (antInterval) clearInterval(antInterval);
  antInterval = setInterval(spawnAnt, antSpawnRate);
  isPaused = false;
  gameStarted = true;
  gameOver = false;
  restartBtn.textContent = "Quit";
  pauseBtn.style.display = "inline-block";
  pauseBtn.disabled = false;
  pauseBtn.textContent = "Pause";
};

const showGameOver = () => {
  //remove existing game over
  const oldGameOver = document.getElementById("game-over");
  if (oldGameOver) oldGameOver.remove();
  //create new game over
  const gameOverDiv = document.createElement("div");
  gameOverDiv.id = "game-over";
  gameOverDiv.textContent = "Game Over";
  gameArea.appendChild(gameOverDiv);
};

const stopGame = () => {
  clearInterval(antInterval);
  antInterval = null;
  gameArea.innerHTML = "";
  score = 0;
  scoreSpan.textContent = score;
  isPaused = false;
  gameStarted = false;
  gameOver = false;
  restartBtn.textContent = "Start";
  pauseBtn.style.display = "none";
  pauseBtn.disabled = true;
  pauseBtn.textContent = "Pause";
};

const pauseGame = () => {
  clearInterval(antInterval);
  isPaused = true;
  pauseBtn.textContent = "Resume";
};

const resumeGame = () => {
  antInterval = setInterval(spawnAnt, antSpawnRate);
  isPaused = false;
  pauseBtn.textContent = "Pause";
};

//ant functions
const spawnAnt = () => {
  if (gameOver) return;
  const ant = document.createElement("div");
  ant.className = "ant";
  const areaRect = gameArea.getBoundingClientRect();
  const antWidth = 40;
  const antHeight = 40;
  //random horizontal position within game area
  const x = Math.random() * (areaRect.width - antWidth);

  //determine direction: bottom-to-top if score < 5, else randomize
  let direction = "up";
  if (score >= 5) {
    direction = Math.random() < 0.5 ? "up" : "down";
  }

  //set ant travel time based on score
  let antTravelTime = 10;
  if (score > 10) {
    antTravelTime = 6;
  }

  //set initial position and animation
  if (direction === "up") {
    ant.style.left = `${x}px`;
    ant.style.top = `${areaRect.height - antHeight}px`;
    ant.style.animation = `ant-move-up ${antTravelTime}s linear forwards`;
  } else {
    ant.style.left = `${x}px`;
    ant.style.top = `0px`;
    ant.style.animation = `ant-move-down ${antTravelTime}s linear forwards`;
  }

  //smashing functionality
  const smash = () => {
    if (gameOver) return;
    ant.classList.add("smashed");
    smashSound.currentTime = 0;
    smashSound.play();
    score++;
    scoreSpan.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreSpan.textContent = highScore;
      localStorage.setItem("antHighScore", highScore);
    }
    ant.removeEventListener("click", smash);
    setTimeout(() => {
      ant.remove();
    }, 400);
  };

  ant.addEventListener("click", smash);

  //game over if ant reaches the other side
  ant.addEventListener("animationend", () => {
    if (gameArea.contains(ant)) {
      if (!ant.classList.contains("smashed")) {
        gameOver = true;
        showGameOver();
        clearInterval(antInterval);
        antInterval = null;
        gameStarted = false;
        restartBtn.textContent = "Start";
        pauseBtn.style.display = "none";
        pauseBtn.disabled = true;
        pauseBtn.textContent = "Pause";
      }
      ant.remove();
    }
  });

  gameArea.appendChild(ant);
};

restartBtn.textContent = "Start";
pauseBtn.style.display = "none";
pauseBtn.disabled = true;

restartBtn.addEventListener("click", () => {
  if (!gameStarted) {
    startGame();
  } else {
    stopGame();
  }
});

pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
});
