document.addEventListener("DOMContentLoaded", () => {
    const preload = [
        "assets/1up.png",
        "assets/lanyard.png",
        "assets/try-again.png",
        "assets/sticker.png",
        "assets/default.png"
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

    // Variables idk
    const gridSize = 3;
    const gapSize = 20;
    const totalGapWidth = (gridSize - 1) * gapSize;
    const squareSize = (canvas.width - totalGapWidth) / gridSize;
    let grid = [];
    let isProcessing = false;
    const luckySpecialist = new Audio('assets/sfx/lucky-specialist.mp3');

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
                    imageSrc: imageAssignments[index],
                    hover: false,
                    flipping: false,
                    opacity: 1 // Fade-out animation
                });
            }
        }
    }

    initializeGrid();

    function drawGrid() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (const square of grid) {
            if (square.flipping) {
                const overlayImg = images.find(image => image.src.endsWith("assets/default.png"));
                if (overlayImg) {
                    context.save();
                    context.globalAlpha = square.opacity; // Fade-out effect
                    context.drawImage(overlayImg, square.x, square.y, squareSize, squareSize);
                    context.restore();
                }
            } else if (square.revealed) {
                const img = images.find(image => image.src.endsWith(square.imageSrc));
                if (img) {
                    context.drawImage(img, square.x, square.y, squareSize, squareSize);
                }
            } else {
                const overlayImg = images.find(image => image.src.endsWith("assets/default.png"));
                if (overlayImg) {
                    context.save();
                    if (square.hover && !square.flipping) {
                        context.filter = 'brightness(150%)'; // Increase brightness to 150% while hovering
                    }
                    context.drawImage(overlayImg, square.x, square.y, squareSize, squareSize);
                    context.restore();
                }
            }
            context.strokeStyle = "gold";
            context.lineWidth = 2;
            context.strokeRect(square.x, square.y, squareSize, squareSize);
        }
    }

    // Function to animate shuffling of all tiles
    function animateShuffle() {
        let animationFrame;
        let timeElapsed = 0;
        const duration = 400; 
        const allTiles = grid.map(tile => ({ ...tile, targetX: tile.x, targetY: tile.y }));

        // Unreveal the 1up tile immediately after pressing run it back
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
                    tile.x += (tile.targetX - tile.x) * 0.2;
                    tile.y += (tile.targetY - tile.y) * 0.2;
                });
                // Redraw with interpolated positions
                context.clearRect(0, 0, canvas.width, canvas.height);
                allTiles.forEach(tile => {
                    const overlayImg = images.find(image => image.src.endsWith("assets/default.png"));
                    if (overlayImg) {
                        context.drawImage(overlayImg, tile.x, tile.y, squareSize, squareSize);
                    }
                    context.strokeStyle = "gold";
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
        <button id="resetButton">RUN IT BACK!</button>
    `;
    document.body.appendChild(popup);

    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", () => {
        popup.style.display = "none"; 
        overlay.style.display = "none"; 
        luckySpecialist.pause();
        luckySpecialist.currentTime = 0;
        // Unreveal the 1up tile before animation
        const revealedTile = grid.find(square => square.revealed);
        if (revealedTile) {
            revealedTile.revealed = false;
            drawGrid(); 
        }
        animateShuffle(); // Start shuffling animation
    });

    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            initializeGrid();
            drawGrid();
            isProcessing = false; // Reset to false to enable clicks
        }
    });

    // Hover effect
    canvas.addEventListener("mousemove", function(event) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        grid.forEach(square => {
            square.hover = false;
        });

        const hoveredSquare = grid.find(
            (square) =>
                mouseX >= square.x && mouseX <= square.x + squareSize &&
                mouseY >= square.y && mouseY <= square.y + squareSize
        );

        if (hoveredSquare && !hoveredSquare.revealed && !isProcessing) {
            hoveredSquare.hover = true;
        }

        drawGrid();
    });  

    // Click event with fade-out animation, sound, and confetti
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
            isProcessing = true; 
            clickedSquare.flipping = true;
            clickedSquare.opacity = 1; // Reset opacity for animation
            drawGrid();

            const flipSound = new Audio('assets/sfx/flip-sound.mp3');
            flipSound.play();

            // Fade-out animation
            let fadeStart = performance.now();
            function animateFade(currentTime) {
                if (!fadeStart) fadeStart = currentTime;
                const progress = Math.min((currentTime - fadeStart) / 500, 1);
                clickedSquare.opacity = 1 - progress; // Fade from 1 to 0
                drawGrid();

                if (progress < 1) {
                    requestAnimationFrame(animateFade);
                } else {
                    clickedSquare.flipping = false;
                    clickedSquare.revealed = true;
                    drawGrid();

                    luckySpecialist.volume = 0.6;
                    if (clickedSquare.imageSrc.includes("assets/lanyard.png")) {
                        bigConfetti(); // Big confetti for lanyard
                        luckySpecialist.play();
                    } else if (clickedSquare.imageSrc.includes("assets/sticker.png") || clickedSquare.imageSrc.includes("assets/1up.png")) {
                        smallConfetti(); // Small confetti for sticker or 1up
                        luckySpecialist.play();
                    } else if (clickedSquare.imageSrc.includes("assets/try-again.png")) {
                        const cricketSound = new Audio('assets/sfx/cricket-sound.mp3');
                        cricketSound.play(); // Cricket sound for try-again
                    }

                    setTimeout(() => {
                        if (clickedSquare.imageSrc.includes("assets/1up.png")) {
                            document.getElementById("popupTitle").textContent = "LUCKY!";
                            document.getElementById("popupMessage").textContent = "YOU PULLED A 1UP TILE! YOU GET ANOTHER SHOT!";
                            popup.style.display = "block";
                            overlay.style.display = "block";
                            isProcessing = false; // Unlock only after run it back has been pressed
                        } else {
                            const redirectUrl = `./end.html?tile=${encodeURIComponent(clickedSquare.imageSrc)}`;
                            location.href = redirectUrl;
                        }
                    }, 4500); // 4.5 second delay
                }
            }
            requestAnimationFrame(animateFade);
        }
    });

    // Confetti functions
    function confetti(options) {
        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "1001";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = options.particleCount || 100;
        const spread = options.spread || 60;
        const origin = { x: 0.5, y: 0 }; // Start from the top center

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: canvas.width * (Math.random() * 0.8 + 0.1), // Spread across 80% of width
                y: canvas.height * origin.y,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 5 + 2,
                size: Math.random() * 10 + 5,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let allDone = true;
            particles.forEach(particle => {
                particle.x += Math.cos(particle.angle) * particle.speed;
                particle.y += Math.sin(particle.angle) * particle.speed + 3; // Number is gravity
                particle.size *= 0.98; // Shrink

                if (particle.size > 0.2) {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                    allDone = false;
                }
            });

            if (!allDone) {
                requestAnimationFrame(animateConfetti);
            } else {
                document.body.removeChild(canvas);
            }
        }

        animateConfetti();
    }

    function bigConfetti() {
        confetti({ particleCount: 1000, spread: 240, origin: { x: 0.5, y: 0 } });
    }

    function smallConfetti() {
        confetti({ particleCount: 200, spread: 120, origin: { x: 0.5, y: 0 } });
    }
});
