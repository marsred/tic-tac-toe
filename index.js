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

const grid = [];
const GRID_LENGTH = 3;
const COMPUTER_THINKING_TIME = 100;
const players = {'X': 1,'O': 2};
const turn = {
    value: 'X',
    get text() {
        return this.value;
    },
    set text(turntext) {
        this.value = turntext;
        turnChanged(turntext);
    }
};
const emptyBoxes = [];
const overlay = document.getElementById('overlay');

function initializeGrid() {
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
            emptyBoxes.push(rowidx * GRID_LENGTH + colIdx);
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
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let newValue = players[turn.text];
    grid[colIdx][rowIdx] = newValue;
    renderMainGrid();
    addClickHandlers();
    markBoxChecked(rowIdx, colIdx);
    let w = checkForWinner();
    if(w) {
        overlay.style.display = 'block';
        declareWinner(w);
        return;
    }
    turnNextPlayer();
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function turnNextPlayer() {
    turn.text = (turn.text == 'X' ? 'O' : 'X');
}

function markBoxChecked(rowId, colId) {
    let boxValue = parseInt(colId) * GRID_LENGTH + parseInt(rowId);
    const markedBoxIndex = emptyBoxes.indexOf(boxValue);
    emptyBoxes.splice(markedBoxIndex, 1);
    console.log(emptyBoxes);
}

function turnChanged(curTurn) {
    if(curTurn == 'O') {
        overlay.style.display = 'block';
        if(emptyBoxes.length == 0) return;
        let thinkingTime = COMPUTER_THINKING_TIME;
        const randomBox = Math.floor(Math.random() * emptyBoxes.length);
        setTimeout(function() {
            let boxes = document.getElementsByClassName("box");
            boxes[emptyBoxes[randomBox]].click();
        },thinkingTime);
    } else {
        overlay.style.display = 'none';
    }
}

function checkForWinner() {
    let i, j;
    for (i = 0;i < GRID_LENGTH; i++) {
        let score = 0;
        for (j = 0;j < GRID_LENGTH; j++) {
            if(grid[i][j] == 0) {score = 0;break;}
            score += grid[i][j];
        }
        if(score != 0 && score % 3 == 0) {
            return grid[i][j-1];
        }
    }

    for (j = 0;j < GRID_LENGTH; j++) {
        let score = 0;
        for (i = 0;i < GRID_LENGTH; i++) {
            if(grid[i][j] == 0) {score = 0;break;}
            score += grid[i][j];
        }
        if(score != 0 && score % 3 == 0) {
            return grid[i-1][j];
        }
    }

    let score = 0;
    for (i=0,j = 0; i < GRID_LENGTH; i++,j++) {
        if(grid[i][j] == 0) {score = 0;break;}
        score += grid[i][j];
    }
    if(score != 0 && score % 3 == 0) {
        return grid[0][0];
    }

    score = 0;
    for (i=0,j = GRID_LENGTH-1; i < GRID_LENGTH; i++,j--) {
        if(grid[i][j] == 0) {score = 0;break;}
        score += grid[i][j];
    }
    if(score != 0 && score % 3 == 0) {
        return grid[0][GRID_LENGTH-1];
    }

    return false;
}

function declareWinner(w) {
    document.getElementById('message').textContent = "Winner: " + (w == players['X'] ? 'X' : 'O');
}

initializeGrid();
renderMainGrid();
addClickHandlers();
