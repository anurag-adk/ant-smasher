//defining game container and scoreboard elements
const gameArea = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const highScoreSpan = document.getElementById("high-score");
const restartBtn = document.getElementById("restart-btn");
const smashSound = document.getElementById("smash-sound");

//defining score variables and keeping track of highscore with localStorge
let score = 0;
let highScore = parseInt(localStorage.getItem("antHighScore")) || 0;
let antInterval = null;
let antSpawnRate = 1000; // ms
highScoreSpan.textContent = highScore;

//core app functions
const startGame = () => {
  score = 0;
  scoreSpan.textContent = score;
  gameArea.innerHTML = "";
  if (antInterval) clearInterval(antInterval);
  antInterval = setInterval(spawnAnt, antSpawnRate);
};

//ant functions
const randomPosition = () => {
  const areaRect = gameArea.getBoundingClientRect();
  const x = Math.random() * (areaRect.width - 40);
  const y = Math.random() * (areaRect.height - 40);
  return { x, y };
};

const spawnAnt = () => {
  const ant = document.createElement("div");
  ant.className = "ant";
  const { x, y } = randomPosition();
  ant.style.left = `${x}px`;
  ant.style.top = `${y}px`;

  //smaching functionality
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
    }, 4000);
  };

  ant.addEventListener("click", smash);

  //remove ant after 5s if not smashed
  setTimeout(() => {
    if (gameArea.contains(ant)) ant.remove();
  }, 5000);

  gameArea.appendChild(ant);
};

restartBtn.addEventListener("click", startGame);

//start game on load
startGame();
