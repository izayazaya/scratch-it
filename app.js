document.addEventListener("DOMContentLoaded", () => {
    const preload = [
        "assets/1up.png",
        "assets/lanyard.png",
        "assets/try-again.png",
        "assets/sticker.png",
        "assets/circuits-logo.png"
    ];

    const images = [];
    let loadedImages = 0;
    for (let i = 0; i < preload.length; i++) {
        images[i] = new Image();
        images[i].onload = () => {
            loadedImages++;
            if (loadedImages === preload.length) {
                drawGrid();
            }
        };
        images[i].src = preload[i];
    }

    const canvas = document.getElementById("scratchItCanvas");
    const context = canvas.getContext("2d");

    // Size and gap
    const gridSize = 3;
    const gapSize = 10;
    const totalGapWidth = (gridSize - 1) * gapSize;
    const squareSize = (canvas.width - totalGapWidth) / gridSize;
    let grid = [];
    let isProcessing = false;

    // Define reward distribution
    const rewardDistribution = [
        { src: "assets/lanyard.png", count: 1 },
        { src: "assets/sticker.png", count: 2 },
        { src: "assets/1up.png", count: 2 },
        { src: "assets/try-again.png", count: 4 }
    ];

    // Shuffle array function 
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to initialize grid
    function initializeGrid() {
        grid = [];
        let imageAssignments = [];
        rewardDistribution.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                imageAssignments.push(item.src);
            }
        });
        imageAssignments = shuffle(imageAssignments);

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const index = i * gridSize + j;
                grid.push({
                    x: i * (squareSize + gapSize), 
                    y: j * (squareSize + gapSize),
                    revealed: false,
                    imageSrc: imageAssignments[index]
                });
            }
        }
    }

    initializeGrid();

    function drawGrid() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const square of grid) {
            if (square.revealed) {
                const img = images.find(image => image.src.endsWith(square.imageSrc));
                if (img) {
                    context.drawImage(img, square.x, square.y, squareSize, squareSize);
                }
            } else {
                const overlayImg = images.find(image => image.src.endsWith("assets/circuits-logo.png"));
                if (overlayImg) {
                    context.drawImage(overlayImg, square.x, square.y, squareSize, squareSize);
                }
            }
            context.strokeStyle = "black";
            context.strokeRect(square.x, square.y, squareSize, squareSize);
        }
    }

    // Function to animate shuffling of all tiles
    function animateShuffle() {
        let animationFrame;
        let timeElapsed = 0;
        const duration = 800; 
        const allTiles = grid.map(tile => ({ ...tile, targetX: tile.x, targetY: tile.y }));

        // Unreveal the 1up tile immediately
        const revealedTile = grid.find(square => square.revealed);
        if (revealedTile) {
            revealedTile.revealed = false;
        }

        // Get original positions of all tiles and shuffle them
        let originalPositions = allTiles.map(tile => ({ x: tile.x, y: tile.y }));
        originalPositions = shuffle(originalPositions);

        // Assign shuffled positions as targets
        allTiles.forEach((tile, index) => {
            tile.targetX = originalPositions[index].x;
            tile.targetY = originalPositions[index].y;
        });

        function animate(currentTime) {
            if (!timeElapsed) timeElapsed = currentTime;
            const progress = (currentTime - timeElapsed) / duration;

            if (progress < 1) {
                // Interpolate positions toward target
                allTiles.forEach(tile => {
                    tile.x += (tile.targetX - tile.x) * 0.1;
                    tile.y += (tile.targetY - tile.y) * 0.1;
                });
                // Redraw with interpolated positions
                context.clearRect(0, 0, canvas.width, canvas.height);
                allTiles.forEach(tile => {
                    const overlayImg = images.find(image => image.src.endsWith("assets/circuits-logo.png"));
                    if (overlayImg) {
                        context.drawImage(overlayImg, tile.x, tile.y, squareSize, squareSize);
                    }
                    context.strokeStyle = "black";
                    context.strokeRect(tile.x, tile.y, squareSize, squareSize);
                });
                animationFrame = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrame);
                initializeGrid(); // Reset with new shuffle
                drawGrid();
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    const overlay = document.createElement("div");
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    const popup = document.createElement("div");
    popup.id = 'popup';
    popup.innerHTML = `
        <p id="popupTitle"></p>
        <p id="popupMessage"></p>
        <button id="resetButton">RUN IT BACK</button>
    `;
    document.body.appendChild(popup);

    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", () => {
        popup.style.display = "none"; 
        overlay.style.display = "none"; 
        // Unreveal the 1up tile before animation
        const revealedTile = grid.find(square => square.revealed);
        if (revealedTile) {
            revealedTile.revealed = false;
            drawGrid(); // Update display immediately
        }
        animateShuffle(); // Trigger shuffling animation
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            initializeGrid();
            drawGrid();
            isProcessing = false; // Reset isProcessing to enable clicks
        }
    });

    canvas.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        const clickedSquare = grid.find(
            (square) =>
                mouseX >= square.x && mouseX <= square.x + squareSize &&
                mouseY >= square.y && mouseY <= square.y + squareSize
        );

        if (clickedSquare && !clickedSquare.revealed && !isProcessing) {
            clickedSquare.revealed = true;
            drawGrid();
            isProcessing = true; // Lock out all further clicks
            if (clickedSquare.imageSrc.includes("assets/1up.png")) {
                setTimeout(() => {
                    document.getElementById("popupTitle").textContent = "LUCKY!";
                    document.getElementById("popupMessage").textContent = "YOU PULLED A 1UP! YOU GET ANOTHER SHOT!";
                    popup.style.display = "block";
                    overlay.style.display = "block";
                    isProcessing = false; // Re-enable clicks after popup
                }, 5000);
            } else {
                const redirectUrl = `./end.html?tile=${encodeURIComponent(clickedSquare.imageSrc)}`;
                setTimeout(() => {
                    try {
                        location.href = redirectUrl;
                    } catch (error) {
                        alert("Redirect to end.html failed. Check console for details.");
                        isProcessing = false;
                    }
                }, 5000);
            }
        }
    });
});
