//defining game container and scoreboard elements
const gameArea = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const highScoreSpan = document.getElementById("high-score");
const restartBtn = document.getElementById("restart-btn");

//defining score variables and keeping track of highscore with localStorge
let score = 0;
let highScore = parseInt(localStorage.getItem("antHighScore")) || 0;
highScoreSpan.textContent = highScore;

//core app functions
const startGame = () => {
  score = 0;
  scoreSpan.textContent = score;
  gameArea.innerHTML = "";
};

restartBtn.addEventListener("click", startGame);

// Start game on load
startGame();
