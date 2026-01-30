let canvas = null;

let division = 2.5;
let mazeWidth = 0;
let mazeHeight = 0;

let maze = null;
let builderTag = 'null';

let sizeInput = null;

const builders = {
    DYC: MazeBuilderByDivideAndConquer,
    DFS: MazeBuilderByDFS,
};

function chooseBuilder(value) {
    builderTag = value;
}

function hideDownloadButtons() {
    const container = document.querySelector('.opciones .finales');
    container.classList.add('pre-animation');
    
    // Reset buttons back to empty spans
    const downloadTextBtn = document.getElementById('download-text');
    const downloadImageBtn = document.getElementById('download-image');
    
    if (downloadTextBtn.tagName === 'BUTTON') {
        downloadTextBtn.outerHTML = '<span id="download-text"></span>';
    }
    if (downloadImageBtn.tagName === 'BUTTON') {
        downloadImageBtn.outerHTML = '<span id="download-image"></span>';
    }
}

function buildMaze(canvasWidth, canvasHeight) {
    const size = parseInt(sizeInput.value || '10');
    const selectedBuilder = builders[builderTag];
    if (selectedBuilder) {
        console.log('Building...');
        // Clear the current maze and canvas before starting new one
        maze = null;
        clear();
        background(15, 52, 96); // Match --bg-card color
        
        hideDownloadButtons(); // Hide buttons when starting new maze
        maze = new Maze({ width: size, height: size }, selectedBuilder, AStarMazeSolver, {
            mazeWidth: canvasWidth,
            mazeHeight: canvasHeight,
        });
    } else {
        alert('Builder not implemented');
    }
}

function solveMaze(asciiMaze) {
    console.log('Solving...');
    maze = Maze.fromAscii(asciiMaze, AStarMazeSolver, {
        mazeWidth,
        mazeHeight,
    });
}

function downloadMaze() {
    if (canvas) save(canvas, 'laberinto.png');
}

function downloadRepresentation() {
    if (maze) {
        const asciiMaze = maze.toAscii();
        const blob = new Blob([asciiMaze], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'laberinto.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

function processFile(file) {
    const asciiMaze = file.data;
    solveMaze(asciiMaze);
}

function buttonFunction() {
    const container = document.querySelector('.opciones .finales');

    // Replace spans with buttons using outerHTML
    const downloadTextSpan = document.getElementById('download-text');
    const downloadImageSpan = document.getElementById('download-image');

    downloadTextSpan.outerHTML = '<button id="download-text">Texto</button>';
    downloadImageSpan.outerHTML = '<button id="download-image">Imagen</button>';

    // Re-attach click handlers to the new button elements
    document.getElementById('download-text').onclick = function () {
        downloadRepresentation();
    };

    document.getElementById('download-image').onclick = function () {
        downloadMaze();
    };

    // Remove pre-animation class to show the buttons
    container.classList.remove('pre-animation');
}

function windowResized() {
    mazeWidth = Math.min(windowWidth * 0.55, 700);
    mazeHeight = Math.min(windowWidth * 0.55, 700);
    resizeCanvas(mazeWidth, mazeHeight);
}

function setup() {
    mazeWidth = Math.min(windowWidth * 0.55, 700);
    mazeHeight = Math.min(windowWidth * 0.55, 700);
    frameRate(24);

    sizeInput = document.getElementById('tamano');
    const sizeValueDisplay = document.getElementById('size-value');
    builderTag = document.getElementById('tipoDeAlgoritmo').value;

    // Update displayed value when slider changes
    sizeInput.addEventListener('input', (e) => {
        sizeValueDisplay.textContent = e.target.value;
    });

    document.getElementById('start').onclick = function () {
        buildMaze(mazeWidth, mazeHeight);
    };

    // Move file upload listener to setup (only needs to be set once)
    document.getElementById('upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            processFile({ data: event.target.result });
        };
        reader.readAsText(file);
    });

    canvas = createCanvas(mazeWidth, mazeHeight);
    canvas.parent('canvas-container');
}

function draw() {
    if (maze) {
        background(15, 52, 96); // Match --bg-card color
        maze.display();
    }
}
