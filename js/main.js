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
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    bombed: 0
}
function onInit() {
    gBoard = createBoard()
    renderBoard(gBoard)
}
function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    board[2][2].isMine = true
    board[0][1].isMine = true
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
function onCellClicked(elCell, i, j, event) {
    gGame.isOn = true
    if (gGame.isOn) {
        // gInterval = setInterval(timer, 1000)
        // console.log('elCell', elCell)
        var mouseSide = event.button
        console.log('mouseSide', mouseSide)
        if (mouseSide === 0) {
            leftClicked(elCell, i, j, event)
            console.log('leftclick')
        }
        if (mouseSide !== 0) {
            rightClicked(elCell, i, j, event)
            console.log('rightclick')
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
        // console.log('gGame.bombed', gGame.bombed)
        // console.log('gLevel.MINES', gLevel.MINES)
        gGame.bombed++
        gBoard[i][j].isShown = false
        elCell.innerHTML = MINE
        elCell.style.backgroundColor = 'red'
        console.log('gLevel.MINES', gLevel.MINES)
        if (gGame.bombed === gLevel.MINES) {
            console.log('gGame.bombed', gGame.bombed)
            console.log('gLevel.MINES', gLevel.MINES)
            console.log('GAME OVER')
            gameOver()
            return

        } else {
            console.log('gGame.bombed', gGame.bombed)
            console.log('MINE!')
        }
    }
    else {
        elCell.style.backgroundColor = 'lightgrey'
        // check if mines around
        var minesAround = setMinesNegsCount(i, j, gBoard)
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
        gBoard[i][j].isMarked = false
        elCell.innerHTML = EMPTY
    } else {
        gBoard[i][j].isMarked = true
        elCell.innerHTML = MARK
    }
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
    resetTimer()
    var allMines = document.querySelectorAll('.MINE')

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
    console.log(level)
    gLevel.SIZE = level
    console.log('gLevel.SIZE', gLevel.SIZE)
    restartGame()
}

//    board[i][j] = (Math.random() > 0.5) ? LIFE : '' --> another option