'use strict'
// proj name: Minesweeper Game

const MINE = '💣'
const MARK = '🚩'
const EMPTY = ' '
const DEAD = '😵'
const SMILEY = '😊'

var gInterval


// model
var gBoard = {
    isShown: false,
    isMine: false,
    isMarked: false
}
// board size + num of mines
var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1,
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
function onInit() {
    gBoard = createBoard()
    addBomb(gLevel.MINES)
    renderBoard(gBoard)
    gGame.isOn = true
    // placebombs(gLevel.MINES, gBoard)
    // console.log('gLevel.LIVES', gLevel.LIVES)
}
function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false,
            }
        }

    }
    // console.log(board)
    return board
}
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (!cell.isShown) {
                cell = EMPTY
            }
            if (cell.isShown) {
                if (cell.isMine) {
                    cell = MINE
                } else {
                    cell = EMPTY
                }
            }
            // console.log(board[i][j].isMine)
            var className = `cell cell-${i}-${j}`
            className += (board[i][j].isMine) ? ' MINE' : ' EMPTY'
            strHTML += `<td class="${className}" onmousedown="onCellClicked(this,${i},${j},event)">${cell}</td>`
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}
function getBombs() {
    var bombs = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            bombs.push({ i, j })
        }
    }
    // console.log('bombs', bombs)
    return bombs
}
function getRandomCell() {
    var emptyCells = getBombs()
    // console.log('emptyCells', emptyCells)
    var randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    // console.log('randIdx', randIdx)
    // console.log('emptyCells[randIdx]', emptyCells[randIdx])
    return emptyCells[randIdx]
}
function addBomb(minesNum) {
    for (var i = 0; i < minesNum; i++) {
        var randCell = getRandomCell()
        // console.log('randCell', randCell)
        var randBomb = gBoard[randCell.i][randCell.j]
        randBomb.isMine = true
        // console.log('randBomb', randBomb)
    }
    // renderCell(randCell, BALL_IMG)
}
function onCellClicked(elCell, i, j, event) {
    if (gGame.isOn) {
        // gInterval = setInterval(timer, 1000)
        // console.log('elCell', elCell)
        var mouseSide = event.button
        // console.log('mouseSide', mouseSide)
        if (mouseSide === 0) {
            leftClicked(elCell, i, j, event)
            // console.log('leftclick')
        }
        if (mouseSide !== 0) {
            rightClicked(elCell, i, j, event)
            // console.log('rightclick')
        }
    }
}
function setMinesNegsCount(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) negsCount++
        }
    }
    // console.log(negsCount)
    // board[i][j].minesAroundCount = negsCount
    return negsCount
}
function leftClicked(elCell, i, j) {
    // if clicked MINE:
    if (elCell.classList.contains('MINE')) {
        // console.log('gLevel.MINES', gLevel.MINES)
        gLevel.LIVES--
        gLevel.MINES--

        // update lives + mines on DOM
        var minesCounter = document.querySelector('.mines-text')
        minesCounter.innerText = gLevel.MINES
        var livesCounter = document.querySelector('.livesCount')
        livesCounter.innerText = gLevel.LIVES

        gBoard[i][j].isShown = true
        elCell.innerHTML = MINE
        elCell.style.backgroundColor = 'red'
        // console.log('gLevel.MINES', gLevel.MINES)
        // console.log(' gLevel.LIVES', gLevel.LIVES)
        if (gLevel.LIVES === 0) {
            console.log('gLevel.MINES', gLevel.MINES)
            console.log('GAME OVER')
            gameOver()
            return

        } else {
            console.log('MINE!')
        }
        // if no MINE
    } else {
        elCell.style.backgroundColor = 'lightgrey'
        // console.log('elCell', elCell)
        if (gBoard[i][j].isMarked) return

        if (!checkGameOver(elCell, i, j))

            // check if mines around
            gBoard[i][j].isShown = true
        var minesAround = setMinesNegsCount(i, j, gBoard)
        gGame.shownCount++
        // console.log('gGame.shownCount', gGame.shownCount)

        if (minesAround === 0) {
            elCell.classList.add('zero')
            // elCell.innerHTML = EMPTY
            // expandShown(gBoard, elCell, i, j)

        } else {
            // console.log('minesAround', minesAround)
            elCell.innerHTML = minesAround
            if (minesAround === 1) elCell.style.color = 'blue'
            if (minesAround === 2) elCell.style.color = 'green'
            if (minesAround > 2) elCell.style.color = 'red'
        }
    }
}
function rightClicked(elCell, i, j) {

    if (gBoard[i][j].isMarked) {
        elCell.innerHTML = EMPTY
        gGame.markedCount--
        gBoard[i][j].isMarked = false
    } else {
        gBoard[i][j].isMarked = true
        elCell.innerHTML = MARK
        gGame.markedCount++
    }
    //update DOM
    var flagCounter = document.querySelector('.marked-text')
    flagCounter.innerText = gGame.markedCount
}
function timer() {
    //sec
    var elSec = document.querySelector('.sec')
    var currSec = elSec.innerText
    currSec++
    elSec.innerText = currSec
    //min
    var elMin = document.querySelector('.min')
    var currMin = elMin.innerText
    if (currSec > 60) {
        currMin++
        elMin.innerText = currMin
        //need to reset the sec
        currSec = 0
        elSec.innerText = currSec
    }

}
function gameOver() {
    gGame.isOn = false
    clearInterval(gInterval)

    // show all mines on screen
    var smiley = document.querySelector('.MINE')
    smiley.innerHTML = MINE

    // show game over text
    var gameoverTitle = document.querySelector('.gameover-title')
    gameoverTitle.innerText = 'GAME OVER! Click smiley to restart game'

    // change smiley
    var smiley = document.querySelector('.smiley')
    smiley.innerHTML = DEAD
}
function resetTimer() {
    clearInterval(gInterval);
    var elSec = document.querySelector('.sec')
    elSec.innerHTML = '00'
    var elMin = document.querySelector('.min')
    elMin.innerHTML = '00'
}
function restartGame() {
    var smiley = document.querySelector('.smiley')
    smiley.innerHTML = SMILEY
    var gameoverTitle = document.querySelector('.gameover-title')
    gameoverTitle.innerText = ''
    resetTimer()
    resetGame()
    onInit()
}
function expandShown(board, elCell, i, j) {
    // get first degree neighbors:
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            board[i][j].innerHTML = setMinesNegsCount(i, j, gBoard)
        }
    }
    console.log(negsCount)
    // board[i][j].minesAroundCount = negsCount
    return negsCount
}
function changeLevel(level) {
    // console.log(level)
    gLevel.SIZE = level
    if (level === 4) gLevel.MINES = 2, gLevel.LIVES = 1
    if (level === 8) gLevel.MINES = 14, gLevel.LIVES = 3
    if (level === 12) gLevel.MINES = 32, gLevel.LIVES = 3

    var minesCounter = document.querySelector('.mines-text')
    minesCounter.innerText = gLevel.MINES

    var livesCounter = document.querySelector('.livesCount')
    livesCounter.innerText = gLevel.LIVES

    // console.log('gLevel.SIZE', gLevel.SIZE)
    restartGame()
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function resetGame() {
    //reset levels
    var level = gLevel.SIZE
    if (level === 4) gLevel.MINES = 2, gLevel.LIVES = 1
    if (level === 8) gLevel.MINES = 14, gLevel.LIVES = 3
    if (level === 12) gLevel.MINES = 32, gLevel.LIVES = 3

    // user menu
    var minesCounter = document.querySelector('.mines-text')
    minesCounter.innerText = gLevel.MINES
    var livesCounter = document.querySelector('.livesCount')
    livesCounter.innerText = gLevel.LIVES

    //resetGgame
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    var flagCounter = document.querySelector('.marked-text')
    flagCounter.innerText = gGame.markedCount
}
function checkGameOver(elCell, i, j) {
    areBombsMarked()

    // if (gBoard[i][j].isMarked && )

}
function areBombsMarked() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                console.log('gBoard[i][j].isMine', gBoard[i][j].isMine)

                var isMarked = (gBoard[i][j].isMarked) ? true : false
            }

        }

    }
    console.log('isMarked', isMarked)
    return isMarked
}