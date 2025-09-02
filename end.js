document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tile = params.get("tile");

    const container = document.getElementById("gameResult");

    let messageOne = "UNKNOWN OUTCOME";
    let messageTwo = "UNKNOWN OUTCOME";
    let messageThree = "";
    let messageFour = "";
    let imageSrc = tile;
    if (tile && (tile.includes("assets/lanyard.png") || tile.includes("assets/sticker.png"))) {
        messageOne = "CONGRATULATIONS!";
        messageTwo = "YOU WON!";
        messageThree = "PRIZE WON:";
        if (tile.includes("assets/lanyard.png")) {
            messageFour = "LANYARD";
        } else if (tile.includes("assets/sticker.png")) {
            messageFour = "STICKER";
        }
    } else if (tile && tile.includes("assets/try-again.png")) {
        messageOne = "WOMP WOMP,";
        messageTwo = "BETTER LUCK NEXT TIME!";
    }

    container.innerHTML = `
        <p class="messageOne">${messageOne}</p>
        <img id="endImage" src="${imageSrc}">
        <p class="messageTwo">${messageTwo}</p>
        <p class="messageThree">${messageThree}</p>
        <p class="messageFour">${messageFour}</p>
        <button id="finishButton">FINISH</button>
    `;

    document.getElementById("finishButton").addEventListener("click", () => {
        location.href = "index.html";
    });
});
