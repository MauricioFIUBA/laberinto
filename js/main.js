let canvas = null;

let division = 2.5;
let mazeWidth = 0;
let mazeHeight = 0;

let maze = null;
let builderTag = 'null';


const builders = {
    DYC: MazeBuilderByDivideAndConquer,
    DFS: MazeBuilderByDFS,
};

let heightInput = null;
let widthInput = null;

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
    const [width, height] = [
        parseInt(widthInput.value || '10'),
        parseInt(heightInput.value || '10'),
    ];
    const selectedBuilder = builders[builderTag];
    if (selectedBuilder) {
        console.log('Building...');
        hideDownloadButtons(); // Hide buttons when starting new maze
        maze = new Maze({ width, height }, selectedBuilder, AStarMazeSolver, {
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
    mazeWidth = windowWidth / division;
    mazeHeight = windowWidth / division;
    resizeCanvas(mazeWidth, mazeHeight);
}

function setup() {
    mazeWidth = windowWidth / division;
    mazeHeight = windowWidth / division;
    frameRate(24);

    heightInput = document.getElementById('alto');
    widthInput = document.getElementById('ancho');
    builderTag = document.getElementById('tipoDeAlgoritmo').value;

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
}

function draw() {
    if (maze) {
        maze.display();
        // console.log(windowWidth);
    }
}
