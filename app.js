const ROWS = 20;
const COLS = 40;
const START = { row: 5, col: 5 };
const END = { row: 14, col: 35 };

const grid = []; // the data: a 2D array of node objects

function createNode(row, col) {
    return {
        row,
        col,
        isStart: row === START.row && col === START.col,
        isEnd: row === END.row && col === END.col,
        isWall: false,
        isVisited: false,
        previousNode: null,
        distance: Infinity,
    };
}

function buildGrid() {
    for (let r = 0; r < ROWS; r++) {
        const currentRow = [];
        for (let c = 0; c < COLS; c++) {
            currentRow.push(createNode(r, c));
        }
        grid.push(currentRow);
    }
}

function renderGrid() {
    const container = document.getElementById('grid-container');
    container.style.gridTemplateRows = `repeat(${ROWS}, 25px)`;
    container.style.gridTemplateColumns = `repeat(${COLS}, 25px)`;

    for (const row of grid) {
        for (const node of row) {
            const cell = document.createElement('div');
            cell.id = `node-${node.row}-${node.col}`;
            cell.className = 'node';
            if (node.isStart) cell.classList.add('node-start');
            if (node.isEnd) cell.classList.add('node-end');
            container.appendChild(cell);
        }
    }
}

buildGrid();
renderGrid();