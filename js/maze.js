function Maze(props, builder, solver, dim) {
    canvas = createCanvas(dim.mazeWidth, dim.mazeHeight);
    // background(50);
    builder = builder ? new builder(props) : null;
    solver = null; /*new solver(props) : null;*/
    this.gridRepresentation = () => builder.gridRepresentation();
    isBuilder = true
    isSolving = false

    framesExtras = 5;

    // Muestra el laberinto (esta funcion se ejecuta permanentemente cada 25 frames/s)
    this.display = () => {
        if (isBuilder) {

            isBuilder = builder.build();
            builder.display();

            if (!isBuilder) {
                // alert('MAZE FINISHED!');
                buttonFunction();
            }
        } else if (framesExtras > 0) {
            builder.display();
            framesExtras--;
        }
        if (isSolving) {
            solver.solve();
            solver.display();
        }
    }
}