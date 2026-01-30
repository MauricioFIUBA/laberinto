// https://en.wikipedia.org/wiki/A*_search_algorithm
function AStarMazeSolver(mazeProps) {
    // Use provided grid or create new one
    if (mazeProps.grid) {
        this._grid = mazeProps.grid;
    } else {
        this._grid = new Grid(
            mazeProps.width,
            mazeProps.height,
            {
                width: Math.floor(mazeWidth / mazeProps.width),
                height: Math.floor(mazeHeight / mazeProps.height),
            },
            { up: true, down: true, left: true, right: true }
        );
    }

    this._openSet = [];
    this._closeSet = [];
    this._pathSolution = [];
    this._finished = false;
    this._solutionExists = false;

    // Distance functions - must be defined before use
    this._euclideanDistance = (cellA, cellB) =>
        dist(cellA.x(), cellA.y(), cellB.x(), cellB.y());

    this._manhattanDistance = (cellA, cellB) =>
        abs(cellA.x() - cellB.x()) + abs(cellA.y() - cellB.y());

    // Initialize the first cell with proper costs
    const startCell = this._grid.first();
    const endCell = this._grid.last();

    startCell.replaceGCost(0);
    startCell.replaceHCost(this._euclideanDistance(startCell, endCell));
    startCell.replaceFCost(startCell.gCost() + startCell.hCost());

    this._openSet = [startCell];

    // Find the cell with lowest fCost in openSet
    this._findLowestFCostCell = () => {
        let lowestIndex = 0;
        for (let i = 1; i < this._openSet.length; i++) {
            if (this._openSet[i].fCost() < this._openSet[lowestIndex].fCost()) {
                lowestIndex = i;
            }
            // Tie-breaker: prefer lower hCost (closer to goal)
            else if (this._openSet[i].fCost() === this._openSet[lowestIndex].fCost()) {
                if (this._openSet[i].hCost() < this._openSet[lowestIndex].hCost()) {
                    lowestIndex = i;
                }
            }
        }
        return lowestIndex;
    };

    this._isGoalReached = (cell) => {
        return cell === this._grid.last();
    };

    this._moveFromOpenToClose = (cell) => {
        this._openSet = this._openSet.filter((c) => c !== cell);
        this._closeSet.push(cell);
    };

    this._isInCloseSet = (cell) => this._closeSet.includes(cell);

    this._isInOpenSet = (cell) => this._openSet.includes(cell);

    this._isOpenSetEmpty = () => this._openSet.length === 0;

    this._checkNeighbours = (current) => {
        const neighbours = current.getValidNeighbours(this._grid);

        for (let i = 0; i < neighbours.length; i++) {
            const neighbour = neighbours[i];

            if (this._isInCloseSet(neighbour)) {
                continue; // Skip already evaluated cells
            }

            const tentativeGCost = current.gCost() + 1;

            if (!this._isInOpenSet(neighbour)) {
                // Discovered a new cell
                this._openSet.push(neighbour);
            } else if (tentativeGCost >= neighbour.gCost()) {
                // Not a better path
                continue;
            }

            // This path is the best so far
            neighbour.setCameFrom(current);
            neighbour.replaceGCost(tentativeGCost);
            neighbour.replaceHCost(this._euclideanDistance(neighbour, this._grid.last()));
            neighbour.replaceFCost(neighbour.gCost() + neighbour.hCost());
        }
    };

    this._buildPathSolution = (goal) => {
        this._pathSolution = [];
        let current = goal;
        while (current) {
            this._pathSolution.push(current);
            current = current.cameFrom();
        }
    };

    this._showPathSolution = () => {
        for (let i = 0; i < this._pathSolution.length; i++) {
            this._pathSolution[i].mark(78, 204, 163, 200); // Success green (#4ecca3)
        }
    };

    this._showCloseSet = () => {
        for (let i = 0; i < this._closeSet.length; i++) {
            this._closeSet[i].mark(233, 69, 96, 100); // Accent color (#e94560)
        }
    };

    this._showOpenSet = () => {
        for (let i = 0; i < this._openSet.length; i++) {
            this._openSet[i].mark(255, 107, 107, 100); // Accent hover (#ff6b6b)
        }
    };

    this._solutionFound = (goal) => {
        this._finished = true;
        this._solutionExists = true;
        this._buildPathSolution(goal);
        console.log(`Solved! (path length: ${this._pathSolution.length})`);
    };

    this._noSolutionFound = () => {
        this._finished = true;
        this._solutionExists = false;
        console.log('No solution found!');
    };

    this._isSolved = () => this._finished;

    this.solve = () => {
        if (!this._isSolved()) {
            if (!this._isOpenSetEmpty()) {
                const currentIndex = this._findLowestFCostCell();
                const current = this._openSet[currentIndex];

                if (this._isGoalReached(current)) {
                    this._solutionFound(current);
                    return;
                }

                this._moveFromOpenToClose(current);
                this._checkNeighbours(current);

                // Build current best path for visualization
                this._buildPathSolution(current);
            } else {
                this._noSolutionFound();
            }
        }
    };

    this.display = () => {
        this._grid.display();
        this._showCloseSet();
        this._showOpenSet();
        this._showPathSolution();
    };
}
