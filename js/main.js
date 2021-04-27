let canvas = null;

var division = 2.5;
var mazeWidth = 0;
var mazeHeight = 0;

let maze = null;
let builderTag = 'null';

var test = 0;

const builders = {
  DYC: MazeBuilderByDivideAndConquer,
  DFS: MazeBuilderByDFS
};

let heightInput = null;
let widthInput = null;
let builderSelect = null;

let uploadInput = null;

function chooseBuilder(value) {
  builderTag = value;
}

function buildMaze(mazeWidth, mazeHeight) {
  const [width, height] = [
    parseInt(widthInput.value || '10'),
    parseInt(heightInput.value || '10')
  ];
  const selectedBuilder = builders[builderTag];
  if(selectedBuilder) {
    console.log('Building...')
    maze = new Maze({ width, height }, selectedBuilder, AStarMazeSolver, { mazeWidth, mazeHeight });
  } else {
    alert('Builder not implemented');
  }
}

function solveMaze(mazeGridRepr) {
  console.log('Solving...')
  // maze = new Maze(mazeGridRepr, null, AStarMazeSolver);
}

function downloadMaze() {
  if(canvas) save(canvas, 'laberinto.png');
}

function downloadRepresentation() {
  if(maze)
    saveJSON(maze.gridRepresentation(), 'mapa-laberinto.txt');
}

function processFile(file) {
  const mazeGridJson = file.data;
  solveMaze(JSON.parse(mazeGridJson));
}

function buttonFunction(){
  var innerHTMLString = '<h1> I am H1 </h1>';
  var container = document.querySelector('.opciones .finales')

  container.classList.add('pre-animation');
  document.getElementById("download-text").innerHTML = '<button id="download-text">Texto</button>';
  document.getElementById("download-image").innerHTML = '<button id="download-image">Imagen</button>';
  setTimeout(function(){
      container.classList.remove('pre-animation');
      // alert('esto tendria que tardar');
  },100);



}

function windowResized() {
  mazeWidth = windowWidth / division
  mazeHeight = windowWidth / division
  resizeCanvas(mazeWidth, mazeHeight  );
}

function setup() {
  mazeWidth = windowWidth / division;
  mazeHeight = windowWidth / division;
  frameRate(24);

  heightInput = document.getElementById('alto')

  widthInput = document.getElementById('ancho')

  builderTag = document.getElementById('tipoDeAlgoritmo').value; 

  document.getElementById('start').onclick = function() {
    buildMaze(mazeWidth, mazeHeight);
  };

  document.getElementById('download-text').onclick = function() {
    downloadRepresentation();
  };

  document.getElementById('download-image').onclick = function() {
    downloadMaze();
  };

  createCanvas(mazeWidth, mazeHeight);
}

function draw() {
  if(maze) {
    maze.display();
    // console.log(windowWidth);
  }
  
}
