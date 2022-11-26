'use strict'
// proj name: Minesweeper Game

const MINE = '💣'
const MARK = '🚩'
const EMPTY = ' '
const DEAD = '😵'
const SMILEY = '😊'
const WINNER = '🤩'
const BULB = '💡'

var gInterval
var gIsWin = false
var gMinesCounter = 0
var gClicks = 0
var totalSeconds = 0
var elSecs = document.querySelector('.seconds')
var elMins = document.querySelector('.minutes')
var gHints = 3

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
    clearInterval(gInterval);
    var background = document.querySelector('body')
    background.style.backgroundColor = ''
    gBoard = createBoard()
    // addBomb(gLevel.MINES)
    renderBoard(gBoard)
    gGame.isOn = true
    gMinesCounter = 0
    console.log('gClicks', gClicks)
    // console.log(gBoard)
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
                isShown: false,
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
function onCellClicked(elCell, i, j, event) {
    if (!gGame.isOn) return
    checkGameOver()
    gClicks++
    console.log('gClicks', gClicks)
    startTimer()
    // gInterval = setInterval(timer, 1000)
    var mouseSide = event.button

    if (mouseSide === 0) {
        // console.log('left click')
        // console.log(' i, j', i, j)
        leftClicked(elCell, i, j, event)
    }
    if (mouseSide !== 0) {
        // console.log('rightclick')
        rightClicked(elCell, i, j, event)

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
    gClicks++
    console.log('gClicks', gClicks)
    if (gClicks === 2) addBomb(gLevel.MINES)
    console.log('elCell', elCell)

    // if clicked MINE:
    if (elCell.classList.contains('MINE')) {

        console.log('gLevel.MINES', gLevel.MINES)
        console.log(' gLevel.LIVES', gLevel.LIVES)
        gLevel.LIVES--
        gLevel.MINES--

        // update lives + mines on DOM
        var minesCounter = document.querySelector('.mines-text')
        minesCounter.innerText = gLevel.MINES
        var livesCounter = document.querySelector('.livesCount')
        livesCounter.innerText = gLevel.LIVES

        gBoard[i][j].isShown = true
        elCell.innerHTML = MINE
        elCell.style.backgroundColor = 'rgb(214, 30, 30)'
        // console.log('gLevel.MINES', gLevel.MINES)
        console.log(' gLevel.LIVES', gLevel.LIVES)
        if (gLevel.LIVES === 0) {
            livesCounter.innerText = gLevel.LIVES
            console.log('gLevel.MINES', gLevel.MINES)
            console.log('GAME OVER')
            gameOver()
            return

        } else {
            console.log('MINE!')
        }
        // if no MINE
    } else {
        if (gBoard[i][j].isMarked) return  // if flagged - return
        if (gBoard[i][j].isShown) return

        gBoard[i][j].isShown = true
        elCell.style.backgroundColor = 'rgb(190, 190, 190)'
        gGame.shownCount++
        console.log('gGame.shownCount', gGame.shownCount)

        if (checkGameOver(elCell, i, j)) {
            console.log('checkGameOver is true')
            gIsWin = true
            gameOver()
            return
        }

        // check if mines around
        var minesAround = setMinesNegsCount(i, j, gBoard)
        if (minesAround === 0) {
            // elCell.classList.add('zero')
            // console.log('no neighbors')
            expandShown(gBoard, elCell, i, j)

        } else {
            // show num of mines around cell and change its color
            elCell.innerHTML = minesAround
            if (minesAround === 1) {
                elCell.style.color = ' rgb(3, 110, 204)'
            }
            if (minesAround === 2) {
                elCell.style.color = 'rgb(15, 129, 55)'
            }
            if (minesAround > 2) {
                elCell.style.color = 'rgb(214, 30, 30)'
            }
        }
    }
}
function rightClicked(elCell, i, j) {
    console.log('gGame.markedCount', gGame.markedCount)
    if (checkGameOver()) {
        gIsWin = true
        gameOver()
        return
    }
    if (gBoard[i][j].isMarked) {
        elCell.innerHTML = EMPTY
        elCell.style.backgroundColor = 'white'
        gGame.markedCount--
        console.log('gGame.markedCount', gGame.markedCount)
        gBoard[i][j].isMarked = false
    } else {
        gBoard[i][j].isMarked = true
        elCell.innerHTML = MARK
        gGame.markedCount++
        console.log('gGame.markedCount', gGame.markedCount)
        if (checkGameOver()) {
            gIsWin = true
            gameOver()
            return


        }
    }
    //update DOM
    var flagCounter = document.querySelector('.marked-text')
    flagCounter.innerText = gGame.markedCount
}
function getEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            emptyCells.push({ i, j })
        }
    }
    // console.log('emptyCells', emptyCells)
    return emptyCells
}
function getRandomCell(nums) {
    // console.log('nums', nums)
    var randIdx = getRandomIntInclusive(0, nums.length - 1)
    // console.log('randIdx', randIdx)
    // console.log('emptyCells[randIdx]', emptyCells[randIdx])
    return nums[randIdx]
}
function addBomb(minesNum) {
    var emptyCells = getEmptyCells()
    // console.log('emptyCells', emptyCells)

    for (var i = 0; i < minesNum; i++) {
        var randCell = getRandomCell(emptyCells)
        console.log('randCell', randCell)

        // update MODEL:
        var randBomb = gBoard[randCell.i][randCell.j]
        randBomb.isMine = true
        // console.log('randBomb.isMine', randBomb.isMine)

        gMinesCounter++

        // remove num from array
        var cellIdx = emptyCells.indexOf(randCell)
        emptyCells.splice(cellIdx, 1)

        // update DOM:
        var bombLocation = { i: randCell.i, j: randCell.j }
        renderCell(bombLocation, MINE)

    }
    console.log('gMinesCounter', gMinesCounter)
    console.log('gLevel.MINES', gLevel.MINES)
}
function renderCell(location, value) {
    // console.log('location', location)
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    // console.log('elCell', elCell)
    // elCell.innerHTML = value
    elCell.classList.remove('EMPTY')
    elCell.classList.add('MINE')
}
function getClassName(location) {
    // console.log('location', location)
    const cellClass = 'cell-' + location.i + '-' + location.j
    // console.log('cellClass', cellClass)
    return cellClass
}
function gameOver() {
    gGame.isOn = false
    console.log('gGame.isOn', gGame.isOn)
    resetTimer()

    if (gIsWin) {
        var gameoverTitle = document.querySelector('.gameover-title')
        gameoverTitle.innerText = 'YOU WIN!!! Click smiley to restart game'
        var gameBg = document.querySelector('.game-container')
        gameBg.style.backgroundImage = 'url("../img/confetti.gif")'

        // change smiley
        var smiley = document.querySelector('.smiley')
        smiley.innerHTML = WINNER
        smiley.style.backgroundColor = 'green'
    }

    if (!gIsWin) {
        // show all mines on scren
        var mines = document.querySelectorAll('.MINE')
        mines.innerHTML = MINE

        // show game over text
        var gameoverTitle = document.querySelector('.gameover-title')
        gameoverTitle.innerText = 'GAME OVER! Click smiley to restart game'

        // change smiley
        var smiley = document.querySelector('.smiley')
        smiley.innerHTML = DEAD
        smiley.style.backgroundColor = 'red'

        // change background to red
        var background = document.querySelector('body')
        background.style.backgroundColor = 'red'
    }
}
function resetTimer() {
    clearInterval(gInterval);
    elSecs.innerHTML = '00'
    elMins.innerHTML = '00:'
}
function restartGame() {
    gGame.isOn = true
    clearInterval(gInterval);
    var smiley = document.querySelector('.smiley')
    smiley.innerHTML = SMILEY
    var gameoverTitle = document.querySelector('.gameover-title')
    gameoverTitle.innerText = ''
    gIsWin = false
    var smiley = document.querySelector('.smiley')
    smiley.style.backgroundColor = 'white'

    totalSeconds = 0
    gClicks = 0
    resetTimer()
    resetGame()
    onInit()
}
function expandShown(board, elCell, cellI, cellJ) {
    // find locations of cells around, turn background to grey
    // mark all cells as gBoard.IsShown, add count to gGame.shownCount
    // open all cells around without bombs
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[cellI][cellJ].isMarked) continue
            if (board[cellI][cellJ].isMine) continue
            board[cellI][cellJ].isShown = true

            // console.log('board[cellI][cellJ]', board[cellI][cellJ])

            // DOM:
            elCell = document.querySelector(`.cell-${i}-${j}`)
            // console.log('elCell', elCell)
            elCell.style.backgroundColor = 'rgb(190, 190, 190)' // grey
            gGame.shownCount++
        }

    }

    console.log('gGame.shownCount', gGame.shownCount)
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

    // user menu + bg
    var minesCounter = document.querySelector('.mines-text')
    minesCounter.innerText = gLevel.MINES
    var livesCounter = document.querySelector('.livesCount')
    livesCounter.innerText = gLevel.LIVES
    var gameBg = document.querySelector('.game-container')
    gameBg.style.backgroundImage = 'none'

    //resetGgame
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    var flagCounter = document.querySelector('.marked-text')
    flagCounter.innerText = gGame.markedCount

    var background = document.querySelector('body')
    background.style.backgroundColor = 'white'
}
function checkGameOver(elCell, i, j) {
    // check if amount of unopened cells == gLevel.MINES (shownCount === cells - gLevel.MINES)
    // console.log('gLevel.SIZE)*2', (gLevel.SIZE) * 2)
    // console.log('gGame.shownCount', gGame.shownCount)
    var cellsNum = (gLevel.SIZE * gLevel.SIZE)
    var lastCells = cellsNum - gLevel.MINES
    // console.log('cellsNum - gLevel.MINES', cellsNum - gLevel.MINES)
    // console.log('lastCells', lastCells)
    if (gGame.shownCount >= lastCells) {
        console.log('all cells opened')
        // check if all bombs are marked
        if (areAllBombsMarked()) {
            console.log('win!')
            return true
        }
    }
    return false
}
function areAllBombsMarked() {
    var allMarked = false
    var minesNum = gLevel.MINES
    console.log('minesNum', minesNum)

    console.log('gGame.markedCount', gGame.markedCount)

    if (minesNum === gGame.markedCount) {
        allMarked = true
        console.log('all bombs flagged', allMarked)
    }
    return allMarked
}
function startTimer() {
    if (gClicks === 1) gInterval = setInterval(updateTime, 1000);
}
function updateTime() {
    ++totalSeconds;
    elSecs.innerHTML = pad(totalSeconds % 60);
    elMins.innerHTML = pad(parseInt(totalSeconds / 60)) + ':'
}
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
function hints(elHint) {

    if (gHints === 0) return
    // change hints bg color  + open cells for 3 secs
    elHint.style.backgroundColor = 'pink'
    var lightBulbs = document.querySelector('.hints-text')
    if (gHints === 3) lightBulbs.innerHTML = '💡💡'
    if (gHints === 2) lightBulbs.innerHTML = '💡'
    if (gHints === 1) lightBulbs.innerHTML = 'No hints left'

    openCells()
    setTimeout(hintOn, 1000, elHint)
    gHints--
}
function hintOn(elHint) {
    elHint.style.backgroundColor = ''
    closeCells()
    clearTimeout()
}
function openCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            console.log('currCell', currCell)
            // DOM
            var className = `.cell-${i}-${j}`
            console.log('className', className)
            var elCell = document.querySelector(`${className}`)
            // console.log('elCell', elCell)
            elCell.style.backgroundColor = 'pink'
            elCell.classList.contains('MINE') ? elCell.innerHTML = MINE : elCell.innerHTML = EMPTY

        }
    }
}
function closeCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]

            var className = `.cell-${i}-${j}`
            console.log('className', className)
            var elCell = document.querySelector(`${className}`)
            // console.log('elCell', elCell)


            if (!currCell.isShown) {
                elCell.innerHTML = EMPTY
                elCell.style.backgroundColor = ''
            } else {
                elCell.style.backgroundColor = 'rgb(190, 190, 190)'
                if (elCell.classList.contains('MINE')) {
                    elCell.innerHTML = MINE
                } else {
                    var cellNegs = setMinesNegsCount(i, j, gBoard)
                    if (cellNegs === 0) elCell.innerHTML = EMPTY
                    if (cellNegs > 0) elCell.innerHTML = setMinesNegsCount(i, j, gBoard)
                }

            }
        }
    }
}
