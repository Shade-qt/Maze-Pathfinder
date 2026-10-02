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

let isMouseDown = false;

function setupWallDrawing() {
    const container = document.getElementById('grid-container');

    container.addEventListener('mousedown', (e) => {
        const node = getNodeFromEvent(e);
        if (!node || node.isStart || node.isEnd || isRunning) return;
        isMouseDown = true;
        toggleWall(node);
    });

    container.addEventListener('mouseover', (e) => {
        if (!isMouseDown) return;
        const node = getNodeFromEvent(e);
        if (!node || node.isStart || node.isEnd || isRunning) return;
        setWall(node, true);
    });

    window.addEventListener('mouseup', () => (isMouseDown = false));
}

function getNodeFromEvent(e) {
    if (!e.target.classList.contains('node')) return null;
    const [, row, col] = e.target.id.split('-');
    return grid[row][col];
}

function setWall(node, isWall) {
    node.isWall = isWall;
    document
        .getElementById(`node-${node.row}-${node.col}`)
        .classList.toggle('node-wall', isWall);
}

function toggleWall(node) {
    setWall(node, !node.isWall);
}

setupWallDrawing();

let isRunning = false;
let VISIT_DELAY = 5;   // was a const at 15; now set from the slider
const PATH_DELAY = 25; // was 40

function cellOf(node) {
    return document.getElementById(`node-${node.row}-${node.col}`);
}

function resetSearchState() {
    for (const row of grid) {
        for (const node of row) {
            node.isVisited = false;
            node.previousNode = null;
            node.distance = Infinity;
            cellOf(node).classList.remove('node-visited', 'node-path');
        }
    }
}

function clearGrid() {
    if (isRunning) return;
    for (const row of grid) {
        for (const node of row) setWall(node, false);
    }
    resetSearchState();
}

function animate(visited, path, pathFound) {
    isRunning = true;

    visited.forEach((node, i) => {
        setTimeout(() => {
            if (!node.isStart && !node.isEnd) {
                cellOf(node).classList.add('node-visited');
            }
        }, i * VISIT_DELAY);
    });

    const pathStartsAt = visited.length * VISIT_DELAY;

    if (!pathFound) {
        setTimeout(() => {
            alert('No path found!');
            isRunning = false;
        }, pathStartsAt);
        return;
    }

    path.forEach((node, i) => {
        setTimeout(() => {
            if (!node.isStart && !node.isEnd) {
                cellOf(node).classList.add('node-path');
            }
        }, pathStartsAt + i * PATH_DELAY);
    });

    setTimeout(() => (isRunning = false), pathStartsAt + path.length * PATH_DELAY);
}

document.getElementById('start-bfs').addEventListener('click', () => {
    if (isRunning) return;
    VISIT_DELAY = Math.max(1, Math.round(40 / document.getElementById('speed').value));
    resetSearchState(); // lets you run it again without reloading
    const start = grid[START.row][START.col];
    const end = grid[END.row][END.col];
    const visited = bfs(grid, start, end);
    const path = getShortestPath(end);
    animate(visited, path, path[0] === start);
});

document.getElementById('clear-grid').addEventListener('click', clearGrid);