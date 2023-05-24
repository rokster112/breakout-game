const grid = document.querySelector('.grid')
const continueButton = document.getElementById('continue-button')
const highScoreHTML = document.getElementById('high-score')
const player = document.createElement('div')
const scoreHTML = document.getElementById('score')
const livesHTML = document.getElementById('lives')
const startButton = document.getElementById('start-button')
const ball = document.createElement('div')
const gridWidth = 600
const gridHeight = 500
const cellHeight = 20
const cellWidth = 100
const ballDiameter = 10
const numRows = 8
const numCols = 6
const playerStartingPosition = [250, 10]
const ballStartingPosition = [300, 30]
const playerCurrentPosition = playerStartingPosition
const ballCurrentPosition = ballStartingPosition
grid.appendChild(player)
grid.appendChild(ball)
let cells = []
let cell, horDirection, score, lives, intervalTimer, vertDirection
let highScore = 0
let disableContinueBtn = true


startButton.addEventListener('click', startGame)
continueButton.addEventListener('click', function() {
  if (!disableContinueBtn && lives > 0) {
    disableContinueBtn = true
    clearInterval(intervalTimer)
    addEventListener('keydown', playerMovement)
    settingInterval()
  }
})

function startGame() {
  cells.forEach(cell => cell.remove())
  cells = []
  player.classList.remove('player')
  ball.classList.remove('ball')
  player.classList.add('player')
  ball.classList.add('ball')
  clearInterval(intervalTimer)
  score = 0
  scoreHTML.innerHTML = score
  lives = 5
  livesHTML.innerHTML = lives
  vertDirection  = 3
  addCells()
  resetCurrentPositions()
  placePlayer()
  placeBall()
  randomHorizontalDirection()
  settingInterval()
  addEventListener('keydown', playerMovement)
}

function addCells() {

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      cell = document.createElement('div')
      cell.classList.add('cell')
      cell.style.left = col * cellWidth + 'px'
      cell.style.top = row * cellHeight + 'px'
      cells.push(cell)
      grid.appendChild(cell)
    }
  }
}

function placePlayer() {
  player.style.left = playerStartingPosition[0] + 'px'
  player.style.bottom = playerStartingPosition[1] + 'px'
}

function placeBall() {
  ball.style.left = ballStartingPosition[0] + 'px'
  ball.style.bottom = ballStartingPosition[1] + 'px'
}

function playerMovement(e) {
  const keyCode = e.keyCode
  const left = 37
  const right = 39
  
  if (left === keyCode && playerCurrentPosition[0] > 0) {
    playerCurrentPosition[0] -= 25
    player.style.left = playerCurrentPosition[0] + 'px'
  } else if (right === keyCode && playerCurrentPosition[0] < 500) {
    playerCurrentPosition[0] += 25
    player.style.left = playerCurrentPosition[0] + 'px'
  }
  placePlayer()
}

function movingBall() {
  ballCurrentPosition[0] += horDirection
  ballCurrentPosition[1] += vertDirection
  placeBall()
  if (cells.length === 0) {
    winningGame()
  }
}

function scoring() {
  score += 10
  scoreHTML.innerHTML = score
  speedingUpBall()

}

function checkHighScore() {
  highScore = score > highScore ? score : highScore
  highScoreHTML.innerHTML = highScore
}

function speedingUpBall() {
  if (score === 100) {
    vertDirection = vertDirection < 0 ? vertDirection - 1 : vertDirection + 1
  } else if (score === 200) {
    vertDirection = vertDirection < 0 ? vertDirection - 1 : vertDirection + 1
  } else if (score === 300) {
    vertDirection = vertDirection < 0 ? vertDirection - 1 : vertDirection + 1
  } else if (score === 400) {
    vertDirection = vertDirection < 0 ? vertDirection - 1 : vertDirection + 1
  }
}

function randomHorizontalDirection() {
  horDirection = Math.floor(Math.random() * 10) + 4
}

function changeBallDirectionInline() {
  horDirection = horDirection === -horDirection ? horDirection : -horDirection
}

function changeBallDirectionBlock() {
  vertDirection = vertDirection === -vertDirection ? vertDirection : -vertDirection
}

function wallCollision() {
  if (ballCurrentPosition[0] >= (gridWidth - ballDiameter)) {
    changeBallDirectionInline()
  } else if (ballCurrentPosition[0] <= 0) {
    changeBallDirectionInline()
  } else if (ballCurrentPosition[1] >= (gridHeight - ballDiameter)) {
    changeBallDirectionBlock()
  } else if (ballCurrentPosition[1] <= 5){
    losingLives()
  } 
  
}

function playerCellBallCollision() {
  const playerRect = player.getBoundingClientRect()
  const ballRect = ball.getBoundingClientRect()
  const ballCenterX = ballRect.left + ballDiameter / 2
  const ballPositionInPlayer = ballRect.left - playerRect.left
  const relativePosition = ballPositionInPlayer / cellWidth

  //Ball collides with the paddle/player
  if (ballRect.bottom > playerRect.top &&
      ballRect.top < playerRect.bottom &&
      ballRect.left < playerRect.right &&
      ballRect.right > playerRect.left
  ) {
    randomHorizontalDirection()
    changeBallDirectionBlock()
    if (ballCenterX < playerRect.left || ballCenterX > playerRect.right) {
      changeBallDirectionInline()
    } else if (relativePosition < 0.33) {
      horDirection = -horDirection
    } else if (relativePosition < 0.66 && relativePosition > 0.33) {
      horDirection = horDirection === -horDirection ? -2 : 2
    } else if (relativePosition > 0.66) {
      horDirection = +horDirection
    }
  }

  //Ball collides with cells
  for (let i = 0; i < cells.length; i++) {
    const cellRect = cells[i].getBoundingClientRect()
    if (ballRect.bottom > cellRect.top &&
          ballRect.top < cellRect.bottom &&
          ballRect.left < cellRect.right &&
          ballRect.right > cellRect.left
    ) {
      scoring()
      cells[i].remove()
      cells.splice(i, 1)
      if (ballCenterX < cellRect.left || ballCenterX > cellRect.right) {
        changeBallDirectionInline()
      } else {
        changeBallDirectionBlock()
      }
    }
  }
}

function settingInterval(){ 
  intervalTimer = setInterval(function() {
    movingBall()
    wallCollision()
    playerCellBallCollision()
  }, 20)
}

function losingLives() {
  lives -= 1
  livesHTML.innerHTML = lives
  if (lives < 1) {
    gameOver()
    disableContinueBtn = true
  } else {
    resetCurrentPositions()
    disableContinueBtn = false
    placeBall()
    placePlayer()
    movingBall()
    removeEventListener('keydown', playerMovement)
    clearInterval(intervalTimer)
  }
}

function resetCurrentPositions() {
  playerCurrentPosition[0] = 250
  playerCurrentPosition[1] = 10
  ballCurrentPosition[0] = 300
  ballCurrentPosition[1] = 35
}

function winningGame() {
  scoreHTML.innerHTML = `${score} - You win ! ! !`
  clearInterval(intervalTimer)
  removeEventListener('keydown', playerMovement)
  checkHighScore()
}

function gameOver() {
  checkHighScore()
  scoreHTML.innerHTML = `${score} - You Lose ! ! !`
  clearInterval(intervalTimer)
  removeEventListener('keydown', playerMovement)
}