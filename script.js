let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let scoreText = document.getElementById("score");
let goScoreText = document.getElementById("goScore");
let HighScoreText = document.getElementById("HighScoreText");
let ModeText = document.getElementById("modeText");
let DiffText = document.getElementById("diffText");
let timerText = document.getElementById("time");
let GameOverCond = document.getElementById("GameOverCond");
let currScore, HighScore;

const colors = ["blue", "pink", "white"];
const eatSound = document.getElementById('eatSound');
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

let gameSpeed;
let wallCollision = true;
let gameTime = 15;
let TimerReverse = 600;
let gridColor = "rgba(100,100,100,.5)";
let grid = 25;
let count = 0;
let score = 0; 

let snake = {
  x: 100,
  y: 100,

  dx: grid,
  dy: 0,

  cells: [],
  maxCells: 5
};
let apple = {
  x: 300,
  y: 300
};


document.addEventListener("DOMContentLoaded", function() {
  var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  myModal.show();
});

  function startGame() {
    var selectedMod = document.querySelector('input[name="mod"]:checked');
    var selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');

    if (selectedMod) {
        var modValue = selectedMod.value;
        ModeText.textContent = modValue;
    }

    if (selectedDifficulty) {
        var difficultyText = selectedDifficulty.nextElementSibling.textContent;
        DiffText.textContent = difficultyText;
    }
    updateGameRules(modValue);

     switch(difficultyText){
      case "Easy": gameSpeed = 10;  TimerReverse = 800; break;
      case "Medium":  gameSpeed = 6;   TimerReverse = 600; break;
      case "Hard":   gameSpeed = 4;   TimerReverse = 300; break;
    }
 
    // Oyun döngüsünü başlat
    requestAnimationFrame(loop);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawGrid() {
  context.strokeStyle = gridColor;
  for (let i = 0; i <= canvas.width / grid; i++) {
    context.beginPath();
    context.moveTo(i * grid, 0);
    context.lineTo(i * grid, canvas.height);
    context.stroke();
  }

  for (let i = 0; i <= canvas.height / grid; i++) {
    context.beginPath();
    context.moveTo(0, i * grid);
    context.lineTo(canvas.width, i * grid);
    context.stroke();
  }
}

// Mode select
function updateGameRules(selectedMod) {
  
let timerCount = document.getElementById("timerCount");
  switch (selectedMod) {
      case "Classic":
          wallCollision = false;
          canvas.style.borderColor = "white"
          break;
      case "Time against":
          timerCount.style.display = "block";
          canvas.style.borderColor = "green"
           startCountdownMode(); 
          break;
      case "Endless":
        canvas.style.borderColor = "green"
          break;
  }
}

function startCountdownMode() {
  var countdown = setInterval(function() {
      if (gameTime <= 0) {
          clearInterval(countdown);
          GameOver("Time is over!");
      } else {
          gameTime--;
          timerText.textContent = gameTime;
      }
  }, TimerReverse);
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  if (++count < gameSpeed) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  snake.x += snake.dx;
  snake.y += snake.dy;


  if(!wallCollision){
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) 
      GameOver("You hit a wall");
  }
  else{
    snake.x = (snake.x < 0) ? canvas.width - grid : (snake.x >= canvas.width) ? 0 : snake.x;
    snake.y = (snake.y < 0) ? canvas.height - grid : (snake.y >= canvas.height) ? 0 : snake.y;
  }
  

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = "#D8E9A8";
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  //draw snake
    snake.cells.forEach(function(cell, index) {
    const alphaValue = 1 - index / (snake.cells.length);  
    context.fillStyle = `rgba(78, 200, 61, ${alphaValue})`;
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    //Eat apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells+=3;
      score +=5;
      scoreText.textContent = score;
      eatSound.play();

      gameTime+= 3;

      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {

      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          GameOver("You ate own tail");
      }
    }
  });
}

function increaseGameSpeed() {
  gameSpeed += 1; 
  console.log(gameSpeed);
}

function GameOver(message){
  currScore = score;
  goScoreText.textContent = currScore;
  let  storedHighScore = localStorage.getItem('highScore');


  if (storedHighScore !== null) {
    HighScore = parseInt(storedHighScore);
} else {
    HighScore = 150; 
}

if (currScore >= HighScore) {
  HighScore = currScore;
  localStorage.setItem('highScore', HighScore.toString());
}

HighScoreText.textContent = HighScore;

  gameSpeed = 60;
  var myModal2 = new bootstrap.Modal(document.getElementById('exampleModal2'));
  GameOverCond.textContent = message;
  myModal2.show();
}
function Reset(){
  snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        score = 0;
        scoreText.textContent = score;

        apple.x = getRandomInt(0, 20) * grid;
        apple.y = getRandomInt(0, 20) * grid;
}
document.addEventListener('keydown', function(e) {

  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

