'use strict'
// proj name: Minesweeper Game

const MINE = '💣'
const FLAG = '🚩'

// model
var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}
// board size + num of mines
var gLevel = {
    SIZE: 4,
    MINES: 2
};
// current game state
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = createBoard()
    // renderBoard(gBoard)
}
function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            // board[i][j] = (Math.random() > 0.5) ? LIFE : '' --> another option
            var currCell = board[i][j]
            currCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }
    }
    console.log(board)
    return board
}
function countNegs(cellI, cellJ, mat) { // neighbors loop
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j] === MINE) negsCount++
            // if (mat[i][j]) negsCount++
        }
    }
    return negsCount
}
// function renderBoard(board) {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {
//             var cell = board[i][j]
//             var className = (cell) ? 'occupied' : ''
//             var cellData = 'data-i="' + i + '" data-j="' + j + '"'
//             strHTML += `<td class="${className}" ${cellData} onclick="onCellClicked(this,${i},${j})">${cell}</td>`
//         }
//         strHTML += '</tr>\n'
//     }
//     var elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHTML
// }
// function timer() {
//     //sec
//     var elSec = document.querySelector('.sec')
//     var currSec = elSec.innerText
//     currSec++
//     elSec.innerText = currSec
//     //min
//     var elMin = document.querySelector('.min')
//     var currMin = elMin.innerText
//     if (currSec > 60) {
//         currMin++
//         elMin.innerText = currMin
//         //need to reset the sec
//         currSec = 0
//         elSec.innerText = currSec
//     }

// }
