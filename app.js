// Navbar
const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

navToggle.addEventListener("click", function () {
  links.classList.toggle("show-links");
});

// Snake Game
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const squares = [];
  const width = 20;

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    squares.push(square);
    grid.appendChild(square);
  }

  const scoreDisplay = document.getElementById('game-score');
  const gamePlayedDisplay = document.getElementById('games-played');
  const startBtn = document.querySelector('.start');
  const startBtnSpan = startBtn.querySelector('span');
  const statusMessage = document.querySelector('.status-message');
  const instructions = document.querySelector('.instructions');
  const upBtn = document.getElementById('up-btn');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const downBtn = document.getElementById('down-btn');


  let appleIndex = 0;
  let gameState = {
    score: 0,
    gameSpeedDelay: 200,
    direction: 1,
    currentSnake: [2, 1, 0],
    interval: null,
    gamesPlayed: 0,
    bestScore: 0,
  };

  function formatScore(score) {
    return score.toString().padStart(4, '0');
  }

  function increaseSpeed() {
    if (gameState.gameSpeedDelay > 150) {
      gameState.gameSpeedDelay -= 5;
    } else if (gameState.gameSpeedDelay > 100) {
      gameState.gameSpeedDelay -= 3;
    } else if (gameState.gameSpeedDelay > 50) {
      gameState.gameSpeedDelay -= 2;
    } else if (gameState.gameSpeedDelay > 25) {
      gameState.gameSpeedDelay -= 1;
    }
  }

  function startGame() {
    instructions.classList.add('hidden');
    startBtnSpan.innerHTML = '<svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M370.7 133.3C346.6 109.1 312.9 96 277.3 96c-61.9 0-114.4 41-131.5 96H64c22.5-93.3 106-160 213.3-160 57.3 0 109.1 22.9 146.7 60.5V48h64v160h-160V144h94.7zM234.7 416c34.6 0 68.3-13.1 92.4-37.3 24.2-24.2 37.3-57.8 37.3-92.4h81.8c0 106.6-86.5 193.1-193.1 193.1-57.3 0-109.1-22.9-146.7-60.5V464h-64V304h160v64h-94.7c24.1 24.2 57.8 37.3 92.4 37.3z"/></svg>';
    statusMessage.classList.add('hidden');
    gameState.currentSnake.forEach(index => squares[index].classList.remove('snake', 'head'));
    squares[appleIndex].classList.remove('apple');
    clearInterval(gameState.interval);
    gameState.score = 0;
    randomApple();
    gameState.direction = 1;
    scoreDisplay.textContent = formatScore(gameState.score);
    gameState.gameSpeedDelay = 200;
    gameState.currentSnake = [2, 1, 0];
    gameState.currentSnake.forEach(index => squares[index].classList.add('snake'));
    squares[gameState.currentSnake[0]].classList.add('head');
    gameState.interval = setInterval(moveOutcomes, gameState.gameSpeedDelay);
    gameState.gamesPlayed++;
    gamePlayedDisplay.textContent = formatScore(gameState.gamesPlayed);
  }

  function moveOutcomes() {

    squares[gameState.currentSnake[0]].classList.remove('head');
    const tail = gameState.currentSnake.pop();
    squares[tail].classList.remove('snake');

    let newHead = gameState.currentSnake[0] + gameState.direction;

    if (gameState.direction === 1 && gameState.currentSnake[0] % width === width - 1) {
      // going right off edge → wrap to left
      newHead = gameState.currentSnake[0] - (width - 1);
    } else if (gameState.direction === -1 && gameState.currentSnake[0] % width === 0) {
      // going left off edge → wrap to right
      newHead = gameState.currentSnake[0] + (width - 1);
    } else if (gameState.direction === -width && gameState.currentSnake[0] < width) {
      // going up off edge → wrap to bottom
      newHead = gameState.currentSnake[0] + (width * (width - 1));
    } else if (gameState.direction === width && gameState.currentSnake[0] >= width * (width - 1)) {
      // going down off edge → wrap to top
      newHead = gameState.currentSnake[0] % width;
    }

    if (squares[newHead].classList.contains('snake')) {
      if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
      }
      statusMessage.innerHTML = `Game Over!<br> Your score: ${gameState.score}<br> Best score: ${gameState.bestScore}<br> Games played: ${gameState.gamesPlayed}`;
      statusMessage.classList.remove('hidden');
      startBtnSpan.textContent = 'go';
      return clearInterval(gameState.interval);
    }

    gameState.currentSnake.unshift(newHead);

    if (squares[newHead].classList.contains('apple')) {
      squares[newHead].classList.remove('apple');
      squares[tail].classList.add('snake');
      gameState.currentSnake.push(tail);
      randomApple();
      gameState.score++;
      scoreDisplay.textContent = formatScore(gameState.score);
      increaseSpeed();
      clearInterval(gameState.interval);
      gameState.interval = setInterval(moveOutcomes, gameState.gameSpeedDelay);
    }

    squares[newHead].classList.add('snake', 'head');
  }

  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
  }

  // Keyboard Controls
  function control(e) {
    const currentDirection = gameState.direction;

    switch (e.key) {
      case 'ArrowRight':
        if (currentDirection !== -1) gameState.direction = 1; //right
        break;
      case 'ArrowUp':
        if (currentDirection !== width) gameState.direction = -width; //up
        break;
      case 'ArrowLeft':
        if (currentDirection !== 1) gameState.direction = -1; //left
        break;
      case 'ArrowDown':
        if (currentDirection !== -width) gameState.direction = +width; //down
        break;
    }
  }

  document.addEventListener('keydown', control);

  // Touch Controls
  upBtn.addEventListener('pointerdown', () => {
    if (gameState.direction !== width) gameState.direction = -width;
  });
  downBtn.addEventListener('pointerdown', () => {
    if (gameState.direction !== -width) gameState.direction = +width;
  });
  leftBtn.addEventListener('pointerdown', () => {
    if (gameState.direction !== 1) gameState.direction = -1;
  });
  rightBtn.addEventListener('pointerdown', () => {
    if (gameState.direction !== -1) gameState.direction = 1;
  });

  startBtn.addEventListener('click', startGame);
});