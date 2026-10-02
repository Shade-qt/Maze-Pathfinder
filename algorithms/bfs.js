function bfs(grid, start, end) {
    const visitedInOrder = [];
    const queue = [start];
    let head = 0; // index pointer, avoids slow Array.shift()
    start.isVisited = true;

    while (head < queue.length) {
        const node = queue[head++];
        visitedInOrder.push(node);
        if (node === end) break;

        for (const next of getNeighbors(node, grid)) {
            if (next.isVisited || next.isWall) continue;
            next.isVisited = true;
            next.previousNode = node; // breadcrumb for backtracking
            queue.push(next);
        }
    }
    return visitedInOrder;
}

function getNeighbors({ row, col }, grid) {
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}

function getShortestPath(end) {
    const path = [];
    for (let node = end; node !== null; node = node.previousNode) {
        path.unshift(node);
    }
    return path;
}