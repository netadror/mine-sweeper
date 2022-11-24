'use strict'
// proj name: xxx

// global variables (The Model)
var gBoard
var gGameInterval

// boards functions
function onInit() {
    gBoard = createBoard()
    renderBoard(gBoard)
}
function createBoard() {
    var board = []
    for (var i = 0; i < 4; i++) {
        board.push([])
        for (var j = 0; j < 4; j++) {
            board[i][j] = drawNum()
            // board[i][j] = (Math.random() > 0.5) ? LIFE : '' --> another option
        }
    }
    console.table(board)
    return board
}
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = (cell) ? 'occupied' : ''
            var cellData = 'data-i="' + i + '" data-j="' + j + '"'
            strHTML += `<td class="${className}" ${cellData} onclick="onCellClicked(this,${i},${j})">${cell}</td>`
        }
        strHTML += '</tr>\n'

    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}
function resetGame() {
    var allColored = document.querySelectorAll('.occupied') // get all items with class
    allColored.classList.remove('occupied') // remove class
    gNumsClicks = 1 // reset a counter
    createBoard()
    resetTimer()
}
function gameOver() {
    console.log('Game Over')
    // TODO
    onOpenModal()
    clearInterval(gIntervalGhosts)
    gGame.isOn = false
    renderCell(gPacman.location, '🪦')
    clearInterval(gIntervalCherrys)
}
function onToggleGame(elBtn) {
    // console.log('gGameInterval', gGameInterval)

    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elBtn.innerText = 'Start!'

    } else {
        gGameInterval = setInterval(play, GAME_FREQ)
        elBtn.innerText = 'Pause!'
    }

}

// cells
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}
function cellClicked(elTd, elClickedNum, tdI, tdJ) {
    // console.log('tdI, tdJ', tdI, tdJ, 'clickedNum', clickedNum, 'elTd', elTd)
    if (elClickedNum === gNumsClicks && gNumsClicks < 16) {
        console.log('match!')
        elTd.classList.add('occupied')
        gNumsClicks++
    }
    if (elClickedNum === gNumsClicks && gNumsClicks === 16) {
        var subHeader = document.querySelector('h3')
        subHeader.innerText = 'You Won!'
        console.log('you won')
        setTimeout(resetGame(), 2000)
    }
}
function onCellClicked(elTd, cellI, cellJ) { // with classes
    // console.log('elTd', elTd)
    // console.log('cellI', cellI)
    // console.log('cellJ', cellJ)

    // if (elTd.classList.contains('occupied')) {
    // if (elTd.innerText === LIFE) {
    if (gBoard[cellI][cellJ] === LIFE) {
        // Update the model:
        gBoard[cellI][cellJ] = SUPER_LIFE
        // Update the dom:
        elTd.innerText = SUPER_LIFE
        blowUpNegs(cellI, cellJ, gBoard)
    }
}
function getNextLocation(eventKeyboard) {
    // console.log(eventKeyboard)
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // DONE: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
    }

    return nextLocation
}
function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if ((gBoard[i][j] != WALL) && (gBoard[i][j] != PACMAN) && (gBoard[i][j] != POWER_FOOD)) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells
}
function getRandomCell() {
    var emptyCells = getEmptyCells()
    var randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    return emptyCells[randIdx]
}

function getCellCoord(strCellId) { // Gets string returns object ['cell-2-7' --> {i:2, j:7}]
    var coord = {}
    var parts = strCellId.split('-')
    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord
}
function getClassNamePos(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}
function countNegs(cellI, cellJ, mat) { // neighbors loop
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++
            if (mat[i][j]) negsCount++
        }
    }
    return negsCount
}
function countFoodAround(rowIdx, colIdx, board) { // neighbors loop example2
    var foodCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell === LIFE || currCell === SUPER_LIFE)
                foodCount++
        }
    }
    return foodCount
}

// nums
function createNums(length) {
    var nums = []
    for (var i = 1; i <= length; i++) {
        nums.push(i)
    }
    return nums
}
function shuffledNums(nums) { //returns a shuffeled array
    var shuffledNums = nums.sort(() => Math.random() - 0.5);
    return shuffledNums
}
function drawNum(nums) {
    var idx = getRandomInt(0, nums.length)
    var num = nums[idx]
    nums.splice(idx, 1)
    return num
}
function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1)

        keep = items[i];
        items[i] = items[randIdx]
        items[randIdx] = keep
    }

    return items
}
function updateScore(diff) {
    // TODO: update model and dom
    // Model
    gGame.score += diff
    // DOM
    document.querySelector('h2 span').innerText = gGame.score

}

// modal
function onOpenModal() {
    // show the modal
    var modal = document.querySelector('.modal')
    modal.style.display = 'block'
    // change text
    if (gFoodCounter === 0) {
        var elModalH2 = document.querySelector('.modal h2')
        elModalH2.innerText = 'YOU WON! 🤗'
    } else {
        var elModalH2 = document.querySelector('.modal h2')
        elModalH2.innerText = 'Game Over 😔 '
    }
    // show button
}
function onCloseModal() {
    // hide the modal
    var modal = document.querySelector('.modal')
    modal.style.display = 'none';
    // DONE: restart game
    onInit()
}

// timer 1
function timer() {
    var timer = document.querySelector('.timer span')
    var start = Date.now()
    // define gTimerInterval as global variable first

    gTimerInterval = setInterval(function () {
        var currTs = Date.now()
        var secs = parseInt((currTs - start) / 1000)
        var ms = (currTs - start) - secs * 1000
        ms = '000' + ms
        ms = ms.substring(ms.length - 2, ms.length)

        timer.innerText = `\n ${secs}:${ms}`
    }, 100)
}
// timer 2
function timer() {
    // define gInterval global
    // turn function where is needed: gInterval = setInterval(timer, 1000)

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
function resetTimer() {
    var timer = document.querySelector('.timer span')
    timer.innerText = '00:00'
    clearInterval(gTimerInterval);
}
function resetTimer2() {
    clearInterval(gInterval)
    document.querySelector('.min').innerText = '00'
    document.querySelector('.sec').innerText = '00'
    document.querySelector('.counter').innerText = gNextNum
}
// setTimeOut + .hidden
function flashMsg(msg) {
    var elUserMsg = document.querySelector('.user-msg')
    elUserMsg.innerText = msg
    elUserMsg.hidden = false // removes the hidden attributes from the html
    setTimeout(() => {
        elUserMsg.hidden = true // returns it after 2250mls
    }, 2250)
}
// Convert location object {i, j} to selector & render value in element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// general functions
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}
function copyMat(mat) { // copy matrix
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }

    return color
}

// audio
const WIN_SOUND = new Audio('sound/win.wav')
WIN_SOUND.play()

// img
var elBox = document.querySelector('.box');
elBox.innerHTML = '<img src="img/1.png">'
const GAMER_IMG = '<img src="img/gamer.png">'
const PACMAN_IMG = '<img src="img/pacman.png">'

// classlists - no .
var elMsg = document.querySelector('.user-msg')
elMsg.classList.add('success') // ADD

var elUserInfo = document.querySelector('.user-info')
elUserInfo.classList.remove('active') // REMOVE

if (elUserInfo.classList.contains('selected')) {
    elMsg.classList.toggle('match') //TOGGLE
}