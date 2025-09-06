document.addEventListener("DOMContentLoaded", () => {
    const backgroundContainer = document.querySelector(".backgroundContainer");
    const toggleButton = document.createElement("button");
    toggleButton.className = "toggleButton";
    toggleButton.textContent = "I";
    backgroundContainer.appendChild(toggleButton);

    const state = localStorage.getItem("backgroundState") || "sliding";
    if (state === "paused") {
        backgroundContainer.classList.add("noAnimation");
        toggleButton.textContent = "O";
    } else if (state === "solid") {
        backgroundContainer.classList.add("solidColor");
        toggleButton.textContent = "X";
    }

    toggleButton.addEventListener("click", () => {
        if (!backgroundContainer.classList.contains("noAnimation") && !backgroundContainer.classList.contains("solidColor")) {
            backgroundContainer.classList.add("noAnimation");
            toggleButton.textContent = "O";
            localStorage.setItem("backgroundState", "paused");
        } else if (backgroundContainer.classList.contains("noAnimation")) {
            backgroundContainer.classList.remove("noAnimation");
            backgroundContainer.classList.add("solidColor");
            toggleButton.textContent = "X";
            localStorage.setItem("backgroundState", "solid");
        } else if (backgroundContainer.classList.contains("solidColor")) {
            backgroundContainer.classList.remove("solidColor");
            toggleButton.textContent = "I";
            localStorage.setItem("backgroundState", "sliding");
        }
    });
});
