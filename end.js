document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tile = params.get("tile");

    const container = document.getElementById("gameResult");

    let messageOne = "UNKNOWN OUTCOME";
    let messageTwo = "UNKNOWN OUTCOME";
    let messageThree = "";
    let messageFour = "";
    let imageSrc = tile;
    let messageOneClass = "";
    let messageTwoClass = ""; 

    if (tile && (tile.includes("/scratch-it/assets/lanyard.png") || tile.includes("/scratch-it/assets/sticker.png"))) { 
        messageOne = "CONGRATULATIONS!"; 
        messageTwo = "YOU WON!";
        messageThree = "PRIZE WON:";
        if (tile.includes("/scratch-it/assets/lanyard.png")) {
            messageFour = "LANYARD";
        } else if (tile.includes("/scratch-it/assets/sticker.png")) {
            messageFour = "STICKER";
        }
        messageOneClass = "winText";
        messageTwoClass = "winText";
    } else if (tile && tile.includes("/scratch-it/assets/try-again.png")) {
        messageOne = "WOMP WOMP,";
        messageTwo = "BETTER LUCK</br>NEXT TIME!";
        messageOneClass = "loseText"; 
        messageTwoClass = "loseText"; 
    }

    container.innerHTML = `
        <div class="endContainer">
            <p class="messageOne ${messageOneClass}">${messageOne}</p>
            <img id="endImage" src="${imageSrc}">
            <p class="messageTwo ${messageTwoClass}">${messageTwo}</p>
        </div>
        ${tile && (tile.includes("/scratch-it/assets/lanyard.png") || tile.includes("/scratch-it/assets/sticker.png")) ? `
            <p class="messageThree">${messageThree}</p>
            <p class="messageFour">${messageFour}</p>
        ` : ''}
        <button id="finishButton">FINISH</button>
    `;

    const endContainer = document.querySelector(".endContainer");

    var endMascot = document.createElement('img');
    endMascot.id = "endMascot";
    if (endContainer) {
        const rect = endContainer.getBoundingClientRect();
        if (tile && (tile.includes("/scratch-it/assets/lanyard.png") || tile.includes("/scratch-it/assets/sticker.png"))) { 
            endMascot.src = "/scratch-it/assets/win.png";
            endMascot.style.position = "absolute";
            endMascot.style.top = "0";
            endMascot.style.right = "0";
            endMascot.style.transform = "translate(45%, 10%)";
        } else if (tile && tile.includes("/scratch-it/assets/try-again.png")) {
            endMascot.src = "/scratch-it/assets/lose.png";
            endMascot.style.position = "absolute";
            endMascot.style.bottom = "0";
            endMascot.style.left = "0";
            endMascot.style.transform = "translate(120%, 10%)";
        }
        endMascot.style.width = "22rem";
        endMascot.style.height = "22rem";
        endMascot.style.zIndex = "1001";
        endContainer.appendChild(endMascot);
    }

    document.getElementById("finishButton").addEventListener("click", () => {
        location.href = "/scratch-it/";
    });
});
