/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
*
*/

const GRID_LENGTH = 4;
const COMPUTER_THINKING_TIME = 100;
const RESULT_TIE = 3;

let gamer = 'X';
let computer = 'O';
const playerNumbers = {'X': 1, 'O': 2};
const firstPlayer = 'X';

const turn = {
    value: gamer,
    get text() {
        return this.value;
    },
    set text(playerName) {
        this.value = playerName;
        turnChangeHandler(playerName);
    }
};
const grid = [];
const uncheckedBoxes = [];
const criticalPaths = getCriticalPaths(GRID_LENGTH);

// elements
const overlay = document.getElementById('overlay');
const info = document.getElementById('message');
const griddiv = document.getElementById('grid');
const playerselect = document.getElementById('choosePlayerSelect');
const restartBtn = document.getElementById('restartGame');

function initializeGrid() {
    grid.length = 0;
    uncheckedBoxes.length = 0;
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
            uncheckedBoxes.push(rowidx * GRID_LENGTH + colIdx);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';

    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const columnDivs = getColumns();
    griddiv.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    grid[colIdx][rowIdx] = playerNumbers[turn.text];
    renderMainGrid();
    addClickHandlers();
    markBoxChecked(rowIdx, colIdx);
    let result = checkForResult();
    if(result > 0) {
        if(result == RESULT_TIE) {
            declareTie();
        } else {
            declareWinner(result);
        }
        return;
    }

    let nextPlayer = (turn.text == 'X' ? 'O' : 'X');
    setNextPlayer(nextPlayer);
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        if(boxes[idx].textContent.trim() == "") {
            boxes[idx].addEventListener('click', onBoxClick, false);
        }
    }
}

function markBoxChecked(rowId, colId) {
    let boxValue = parseInt(colId) * GRID_LENGTH + parseInt(rowId);
    const markedBoxIndex = uncheckedBoxes.indexOf(boxValue);
    uncheckedBoxes.splice(markedBoxIndex, 1);
}

function turnChangeHandler(curTurn) {
    if(curTurn == computer) {
        overlay.style.display = 'block';
        var criticalBox = findCriticalBox(computer);
        if(criticalBox == undefined) {
            criticalBox = findCriticalBox(gamer);
        }
        if(criticalBox == undefined) {
            var randomBoxNumber = Math.floor(Math.random() * uncheckedBoxes.length);
            criticalBox = uncheckedBoxes[randomBoxNumber];
        }

        setTimeout(function() {
            let boxes = document.getElementsByClassName("box");
            boxes[criticalBox].click();
        },COMPUTER_THINKING_TIME);
    } else {
        overlay.style.display = 'none';
    }
}

function checkForResult() {
    let startIndex, hasWinner;
    let i,j;
    let boxes = document.getElementsByClassName("box");
    for(i in criticalPaths) {
        startIndex = criticalPaths[i][0];
        if(boxes[startIndex].textContent == "") continue;
        for(j = 1; j < GRID_LENGTH; j++) {
            if(boxes[criticalPaths[i][j]].textContent != boxes[startIndex].textContent) break;
        }

        if( j == GRID_LENGTH) {
            winningPlayer = boxes[startIndex].textContent;
            return playerNumbers[winningPlayer];
        }
    }

    if(uncheckedBoxes.length == 0) {
        return RESULT_TIE;
    };

    return 0;
}

function declareWinner(w) {
    let winner = (w == playerNumbers[gamer] ? gamer : computer);
    info.innerHTML = '<span class="win">Winner: '+ winner +'</span>';
    overlay.style.display = 'block';
}

function declareTie() {
    info.innerHTML = '<span class="tie">Match Tied</span>';
    overlay.style.display = 'block';
}

function turnNextPlayer() {
    turn.text = (turn.text == gamer ? computer : gamer);
}

function setNextPlayer(player) {
    info.textContent = "Next turn: " + player;
    turn.text = player;
}

function highlightPlayerSelectBox() {
    playerselect.classList.add('error');
    setTimeout(function() {
        playerselect.classList.remove('error');
    }, 200);
}

function restartGame() {
    initializeGrid();
    renderMainGrid();
    info.innerHTML = '&nbsp;';
    this.classList.add('hidden');
    playerselect.classList.remove('hidden');
    playerselect.selectedIndex = 0;
    griddiv.addEventListener('click', highlightPlayerSelectBox);
    overlay.style.display = 'none';
}

function playerSelectChange() {
    gamer = (this.value  == 'X' ? 'X' : 'O');
    computer = (gamer  == 'X' ? 'O' : 'X');
    addClickHandlers();
    setNextPlayer(firstPlayer);
    this.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    griddiv.removeEventListener('click', highlightPlayerSelectBox);
}

function startGame() {
    initializeGrid();
    renderMainGrid();
    griddiv.addEventListener('click', highlightPlayerSelectBox);
    playerselect.addEventListener('change', playerSelectChange);
    restartBtn.addEventListener('click', restartGame);
}

function getPlayerBoxes(player) {
    var playerBoxes = [];
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        if(boxes[idx].textContent == player) {
            playerBoxes.push(idx);
        }
    }

    return playerBoxes;
}

function findCriticalBox(player) {
    let playerBoxes = getPlayerBoxes(player);
    for(var i in criticalPaths) {
        let winningpath = arraydiff(criticalPaths[i], playerBoxes);
        if(winningpath.length != 1) continue;

        if(uncheckedBoxes.indexOf(winningpath[0]) !== -1) {
            return winningpath[0];
        }
    }
}

function arraydiff(array1, array2) {
    return array1.filter(x => array2.indexOf(x) == -1);
}

function getCriticalPaths(gridSize) {
    let i,j,tempArray;
    const criticalPaths = [];
    for(i = 0; i < gridSize; i++) {
        tempArray = [];
        for(j = 0; j < gridSize; j++) {
            tempArray.push(i * gridSize + j);
        }
        criticalPaths.push(tempArray);
    }
    for(i = 0; i < gridSize; i++) {
        tempArray = [];
        for(j = 0; j < gridSize; j++) {
            tempArray.push(i + j * gridSize);
        }
        criticalPaths.push(tempArray);
    }

    tempArray = [];
    for(i = 0,j = 0; i < gridSize; i++,j++) {
        tempArray.push(i * gridSize + j);
    }
    criticalPaths.push(tempArray);

    tempArray = [];
    for(i = 0,j = gridSize - 1; i < gridSize; i++,j--) {
        tempArray.push(i * gridSize + j);
    }
    criticalPaths.push(tempArray);

    return criticalPaths;
}

startGame();
