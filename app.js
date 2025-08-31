const canvas = document.getElementById("scratchItCanvas");
const context = canvas.getContext("2d");

// Size
const gridSize = 5;
const squareSize = canvas.width / gridSize;
const grid = [];

// Loop that draws the grid square by square 
for(let i = 0; i < gridSize; i++){
    for(let j = 0; j < gridSize; j++){
        grid.push({
            x: i * squareSize,
            y: j * squareSize,
            color: "red",
        });
    }
}

function drawGrid(){
    for(const square of grid){
        context.fillStyle = square.color;
        context.strokeStyle = "black";
        context.fillRect(square.x, square.y, squareSize, squareSize);
        context.strokeRect(square.x, square.y, squareSize, squareSize);
    }
}

function togglePressed(clickedSquare){
    clickedSquare.color = clickedSquare.color === "red" ? "green" : "red";
}

canvas.addEventListener("click", function(event){
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const clickedSquare = grid.find(
        (square)=>
            mouseX >= square.x && mouseX <= square.x + squareSize &&
            mouseY >= square.y && mouseY <= square.y + squareSize
    );

    if(clickedSquare){
        togglePressed(clickedSquare);
    }

    drawGrid();
});

drawGrid();
