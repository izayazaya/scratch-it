const preload = [
    "assets/extraChance.png",
    "assets/lanyard.jpg",
    "assets/loser.png",
    "assets/sticker.png"
];

const images = [];
for(let i = 0; i < preload.length; i++){
    images[i] = new Image();
    images[i].src = preload[i];
}

const canvas = document.getElementById("scratchItCanvas");
const context = canvas.getContext("2d");

// Size
const gridSize = 3;
const squareSize = canvas.width / gridSize;
const grid = [];

// Define reward distribution
const rewardDistribution = [
    { src: "assets/lanyard.jpg", count: 1},
    { src: "assets/sticker.png", count: 2},
    { src: "assets/extraChance.png", count: 2},
    { src: "assets/loser.png", count: 4}
];

// Shuffle array function 
function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create image assignments
let imageAssignments = [];
rewardDistribution.forEach(item => {
    for(let i = 0; i < item.count; i++){
        imageAssignments.push(item.src);
    }
});
imageAssigments = shuffle(imageAssignments);

// Loop that draws the grid square by square 
for(let i = 0; i < gridSize; i++){
    for(let j = 0; j < gridSize; j++){
        const index = i * gridSize + j;
        grid.push({
            x: i * squareSize,
            y: j * squareSize,
            color: "red",
            revealed: false,
            imageSrc: imageAssignments[index]
        });
    }
}

function drawGrid(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(const square of grid){
        if(square.revealed){
            const img = images.find(image => image.src.includes(square.imageSrc));
            if(img){
                context.drawImage(img, square.x, square.y, squareSize, squareSize)
            }
        }else{
            context.fillStyle = square.color;
            context.fillRect(square.x, square.y, squareSize, squareSize);
        }
        context.strokeStyle = "black";
        context.strokeRect(square.x, square.y, squareSize, squareSize);
    }
}

canvas.addEventListener("click", function(event){
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    const clickedSquare = grid.find(
        (square)=>
            mouseX >= square.x && mouseX <= square.x + squareSize &&
            mouseY >= square.y && mouseY <= square.y + squareSize
    );

    if(clickedSquare && !clickedSquare.revealed){
        clickedSquare.revealed = true;
        drawGrid();
    }
});

drawGrid();
