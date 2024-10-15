const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.getElementById('score')
const startBtn = document.getElementById('strat-button')
const width = 10
let score = 0
let timerId

let nextRandom = 0

const lTetromino = [
    [0, width, 2*width, 1],
    [width, width + 1, width + 2, 2 * width + 2],
    [1, width + 1, 2*width + 1, 2*width],
    [width, 2*width, 2*width + 1, 2*width + 2]
]

const zTetromino = [
    [width, width + 1, 1, 2],
    [0, width, width + 1, 2*width + 1],
    [width, width+1 , 1, 2],
    [0, width, width + 1, 2*width + 1]
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1,width+2, 2*width + 1],
    [width, width+1, width+2, 2*width+1],
    [1, width, width+1, 2*width+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width + 1, 2*width + 1, 3*width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2*width + 1, 3*width + 1],
    [width, width + 1, width + 2, width + 3]
]

const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

let random = Math.floor(Math.random()*theTetrominos.length)
let current = theTetrominos[random][currentRotation]

// draw

function draw () {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    })
}

function undraw () {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}

document.addEventListener('keyup' , control)

function control (e) {
    if (e.keyCode === 37) {
        moveLeft()
    }
    else if (e.keyCode === 40) {
        moveDown()
    }
    else if (e.keyCode === 39) {
        moveRight()
    }
    else if (e.keyCode === 38) {
        rotate()
    }
}

function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetrominos.length)
        current = theTetrominos[random][currentRotation]
        currentPosition = 4
        addScore()
        draw()
        displayShape()
    }
}

function moveLeft () {
    undraw()
    const isLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    
    if (!isLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
    }

    draw()
}

function moveRight() {
    undraw()

    const isRightEfge = current.some(index => (currentPosition + index) % width === width -1)

    if (!isRightEfge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1
    }

    draw()
}

function rotate () {
    undraw()
    currentRotation ++
    if (currentRotation === current.length) {
        currentRotation = 0
    }
    current = theTetrominos[random][currentRotation]
    draw()
}

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

const upNextTetrominos = [
    [0, displayWidth, 2*displayWidth, 1],
    [displayWidth, displayWidth + 1, 1, 2],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [0, displayWidth, 2*displayWidth, 3*displayWidth],
]

function displayShape () {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    })
    upNextTetrominos[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
    })
}

startBtn.addEventListener('click' , () => {
    if(timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown , 1000)
        nextRandom = Math.floor(Math.random() * theTetrominos.length)
        displayShape()
    }
})

function addScore () {
    for (let i = 0; i < 199 ; i += width) {
        const row = [i , i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))       
        }
    }
}