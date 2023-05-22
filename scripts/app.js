const grid = document.querySelector('.grid')
const width = 600
const height = 500
const cellHeight = 20
const cellWidth = 100
const ballWidth = 20
const ballHeight = 20
const numRows = 8
const numCols = 6
const playerStartingPosition = [250, 10]
const ballStartingPosition = [300, 30]
const scoreHTML = document.getElementById('score')
const livesHTML = document.getElementById('lives')
const startButton = document.getElementById('start-button')
let cells = []
let cell, horDirection, score, lives, intervalTimer
const playerCurrentPosition = playerStartingPosition
const ballCurrentPosition = ballStartingPosition
const continueButton = document.getElementById('continue-button')
let disableContinueBtn = true
let vertDirection  = 5

function randomHorizontalDirection() {
  horDirection = Math.floor(Math.random() * 10) + 1
}

function scoring() {
  score += 10
  scoreHTML.innerHTML = score
}

function startGame() {
  cells.forEach(cell => cell.remove())
  cells = []
  clearInterval(intervalTimer)
  console.log(playerCurrentPosition)
  score = 0
  scoreHTML.innerHTML = score
  lives = 5
  livesHTML.innerHTML = lives
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

function settingInterval(){ 
  intervalTimer = setInterval(function() {
    movingBall()
    collision()
  }, 50)
}



const player = document.createElement('div')
player.classList.add('player')
grid.appendChild(player)

function placePlayer() {
  player.style.left = playerStartingPosition[0] + 'px'
  player.style.bottom = playerStartingPosition[1] + 'px'
}

const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)

function placeBall() {
  ball.style.left = ballStartingPosition[0] + 'px'
  ball.style.bottom = ballStartingPosition[1] + 'px'
}

function playerMovement(e) {
  const keyCode = e.keyCode
  const left = 37
  const right = 39
  
  if (left === keyCode && playerCurrentPosition[0] > 0) {
    playerCurrentPosition[0] -= 10
    player.style.left = playerCurrentPosition[0] + 'px'
  } else if (right === keyCode && playerCurrentPosition[0] < 500) {
    playerCurrentPosition[0] += 10
    player.style.left = playerCurrentPosition[0] + 'px'
  }
  placePlayer()
}

continueButton.addEventListener('click', function() {
  if (!disableContinueBtn && lives > 0) {
    disableContinueBtn = true
    clearInterval(intervalTimer)
    addEventListener('keydown', playerMovement)
    settingInterval()
  }
}
)


function movingBall() {
  ballCurrentPosition[0] += horDirection
  ballCurrentPosition[1] += vertDirection
  placeBall()
}

function collision() {
  if (ballCurrentPosition[0] >= (width - ballWidth)) {
    changeInline()
  } else if (ballCurrentPosition[0] <= 0) {
    changeInline()
  } else if (ballCurrentPosition[1] >= (height - ballHeight)) {
    changeBlock()
  } else if (ballCurrentPosition[1] <= 5){
    losingLives()
  } 

  if (cells.length === 0) {
    win()
  }

  const playerRect = player.getBoundingClientRect()
  const ballRect = ball.getBoundingClientRect()
  if (ballRect.bottom > playerRect.top &&
      ballRect.top < playerRect.bottom &&
      ballRect.left < playerRect.right &&
      ballRect.right > playerRect.left
  ) {
    randomHorizontalDirection()
    changeBlock()
  }
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
      const ballCenterX = ballRect.left + ballWidth / 2

      if (ballCenterX < cellRect.left || ballCenterX > cellRect.right) {
        changeInline()
        console.log('right or left side')
      } else {
        changeBlock()
        console.log('top or bottom')
      }
    }
  }
}

function win() {
  scoreHTML.innerHTML = `${score} - You win!!!`
  clearInterval(intervalTimer)
  removeEventListener('keydown', playerMovement)
}


function changeInline() {
  horDirection = horDirection === horDirection ? -horDirection : horDirection
  console.log(horDirection)
}

function changeBlock() {
  vertDirection = vertDirection === vertDirection ? -vertDirection : vertDirection
}

function resetCurrentPositions() {
  playerCurrentPosition[0] = 250
  playerCurrentPosition[1] = 10
  ballCurrentPosition[0] = 300
  ballCurrentPosition[1] = 35
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

function gameOver() {
  clearInterval(intervalTimer)
  removeEventListener('keydown', playerMovement)
}

startButton.addEventListener('click', startGame)
