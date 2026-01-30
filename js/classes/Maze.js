/** @type {import('p5')} */

/**
 * @param {{width: number, height: number}} props - Maze dimensions
 * @param {typeof MazeBuilderByDFS | typeof MazeBuilderByDivideAndConquer | null} builder - Builder class constructor
 * @param {typeof AStarMazeSolver | null} solver - Solver class constructor
 * @param {{mazeWidth: number, mazeHeight: number}} dim - Canvas dimensions
 */
function Maze(props, builder, solver, dim) {
    // Resize existing canvas instead of creating new one
    resizeCanvas(dim.mazeWidth, dim.mazeHeight);
    
    this._builder = builder ? new builder(props) : null;
    this._solver = solver ? new solver(props) : null;
    this._grid = null; // Will be set by builder or fromAscii
    
    this.gridRepresentation = () => this._builder.gridRepresentation();
    
    let isBuilding = true;
    let isSolving = false;
    let framesExtras = 5;

    // Convert maze to ASCII representation
    this.toAscii = () => {
        const gridRepr = this._builder.gridRepresentation();
        const numCols = gridRepr.width;
        const numRows = gridRepr.height;
        const grid = gridRepr.grid;
        
        // Each cell becomes 2x2 in ASCII (plus walls)
        // Total size: (numCols * 2 + 1) x (numRows * 2 + 1)
        const asciiWidth = numCols * 2 + 1;
        const asciiHeight = numRows * 2 + 1;
        
        // Initialize with spaces
        const ascii = [];
        for (let y = 0; y < asciiHeight; y++) {
            ascii.push(new Array(asciiWidth).fill(' '));
        }
        
        // Fill corners with walls
        for (let y = 0; y < asciiHeight; y += 2) {
            for (let x = 0; x < asciiWidth; x += 2) {
                ascii[y][x] = '#';
            }
        }
        
        // Process each cell
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = grid[col + row * numCols];
                const asciiX = col * 2 + 1;
                const asciiY = row * 2 + 1;
                
                // Cell center is always open
                ascii[asciiY][asciiX] = ' ';
                
                // Check walls
                if (cell._walls.up) {
                    ascii[asciiY - 1][asciiX] = '#';
                }
                if (cell._walls.down) {
                    ascii[asciiY + 1][asciiX] = '#';
                }
                if (cell._walls.left) {
                    ascii[asciiY][asciiX - 1] = '#';
                }
                if (cell._walls.right) {
                    ascii[asciiY][asciiX + 1] = '#';
                }
            }
        }
        
        // Mark start (top-left entrance) and end (bottom-right exit)
        ascii[1][0] = 'S';
        ascii[asciiHeight - 2][asciiWidth - 1] = 'E';
        
        return ascii.map(row => row.join('')).join('\n');
    };

    // Display the maze
    this.display = () => {
        background(15, 52, 96); // Match --bg-card color

        if (isBuilding) {
            isBuilding = this._builder.build();
            this._builder.display();

            if (!isBuilding) {
                alert('MAZE FINISHED!');
                buttonFunction();
            }
        } else {
            // Always display the grid after building is complete
            this._builder.display();
        }
        
        if (isSolving) {
            this._solver.solve();
            this._solver.display();
        }
    };
    
    // Method to start solving
    this.startSolving = () => {
        isSolving = true;
    };
}

// Static method to create maze from ASCII
Maze.fromAscii = function(asciiString, solver, dim) {
    const lines = asciiString.trim().split('\n');
    const asciiHeight = lines.length;
    const asciiWidth = lines[0].length;
    
    // Calculate maze dimensions
    const numCols = Math.floor((asciiWidth - 1) / 2);
    const numRows = Math.floor((asciiHeight - 1) / 2);
    
    const cellWidth = dim.mazeWidth / numCols;
    const cellHeight = dim.mazeHeight / numRows;
    
    // Create grid representation
    const gridCells = [];
    
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const asciiX = col * 2 + 1;
            const asciiY = row * 2 + 1;
            
            const walls = {
                up: lines[asciiY - 1]?.[asciiX] === '#',
                down: lines[asciiY + 1]?.[asciiX] === '#',
                left: lines[asciiY]?.[asciiX - 1] === '#',
                right: lines[asciiY]?.[asciiX + 1] === '#',
            };
            
            gridCells.push({
                _x: col,
                _y: row,
                _size: { width: cellWidth, height: cellHeight },
                _walls: walls,
            });
        }
    }
    
    // Create a special maze instance for solving
    const mazeInstance = Object.create(Maze.prototype);
    
    // Resize existing canvas instead of creating new one
    resizeCanvas(dim.mazeWidth, dim.mazeHeight);
    
    // Create grid from parsed data
    const grid = new Grid(numCols, numRows, { width: cellWidth, height: cellHeight }, null, gridCells);
    
    // Create solver with the grid
    const solverInstance = new solver({ width: numCols, height: numRows, grid: grid });
    
    let isSolving = true;
    
    mazeInstance.display = () => {
        background(15, 52, 96); // Match --bg-card color
        
        if (isSolving) {
            // solve() returns true while still solving, false when done
            solverInstance.solve();
            if (solverInstance._isSolved()) {
                isSolving = false;
                console.log('Maze solving complete!');
            }
        }
        
        // Always display the solver's progress
        solverInstance.display();
    };
    
    mazeInstance.toAscii = () => asciiString;
    mazeInstance.gridRepresentation = () => grid.representation();
    
    return mazeInstance;
};
