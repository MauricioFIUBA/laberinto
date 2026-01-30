# Laberinto 🔀

A web-based maze generator and solver built with [p5.js](https://p5js.org/). Generate mazes using different algorithms and watch them being solved in real-time with the A* pathfinding algorithm.

![Maze Generator](https://img.shields.io/badge/p5.js-ED225D?style=flat&logo=p5.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

## ✨ Features

- **Two Maze Generation Algorithms:**
    - **DFS (Depth-First Search):** Creates mazes with long, winding corridors
    - **DYC (Divide & Conquer):** Creates mazes by recursively dividing the space

- **A* Pathfinding Solver:** Watch the algorithm find the optimal path from start to finish

- **Export Options:**
    - Download maze as PNG image
    - Download maze as ASCII text file

- **Import Mazes:** Load previously saved maze files (.txt) to solve them

- **Responsive Design:** Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

No build tools required! This project runs directly in the browser.

### Running Locally

1. **Clone the repository:**
     ```bash
     git clone https://github.com/mauricio/laberinto.git
     cd laberinto
     ```

2. **Open the project:**
     - Simply open `index.html` in your browser, or
     - Use a local server (recommended):
         ```bash
         # Using Python
         python -m http.server 8000
         
         # Using Node.js
         npx serve
         ```

3. **Navigate to** `http://localhost:8000` in your browser

## 🎮 Usage

1. **Select a maze generation algorithm** (DFS or DYC)
2. **Click "Generate"** to create a new maze
3. **Click "Solve"** to watch the A* algorithm find the path
4. **Export** your maze as PNG or TXT
5. **Import** a previously saved maze (in text) to solve it again

## 🛠️ Technologies Used

- [p5.js](https://p5js.org/) - Creative coding library for visualization
- Vanilla JavaScript - Core logic
- HTML5 & CSS3 - Structure and styling