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

highScoreSpan.textContent = highScore;

//core app functions
const startGame = () => {
  score = 0;
  scoreSpan.textContent = score;
  gameArea.innerHTML = "";
  if (antInterval) clearInterval(antInterval);
  antInterval = setInterval(spawnAnt, antSpawnRate);
  isPaused = false;
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

  //remove ant after animation ends if not smashed
  ant.addEventListener("animationend", () => {
    if (gameArea.contains(ant)) ant.remove();
  });

  gameArea.appendChild(ant);
};

restartBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    resumeGame();
  } else {
    pauseGame();
  }
});

//start game on load
startGame();
