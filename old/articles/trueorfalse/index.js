const buttonElement = document.getElementById("box-button");
const boxElement = document.getElementById("box");
const catElement = document.getElementById("cat");

let boxIsOpen = true;

function openBox() {
    if (!boxIsOpen) {
        boxElement.classList.remove("closed");
        boxElement.classList.add("open");

        buttonElement.innerText = "Reset";

        if(randomBool()) {
            catElement.classList.remove("dead");
            catElement.classList.add("alive");
        } else {
            catElement.classList.remove("alive");
            catElement.classList.add("dead");
        }

        catElement.style.display = "inline-block";

        boxIsOpen = true;
    }
}

function randomBool() {
    return Math.random() < 0.5;
}

function closeBox() {
    if (boxIsOpen) {
        boxElement.classList.remove("open");

        boxElement.classList.add("closed");
        catElement.style.display = "none";

        buttonElement.innerText = "Open Box";

        boxIsOpen = false;
    }
}

function toggleBox() {
    if (boxIsOpen) {
        closeBox();
    } else {
        openBox();
    }
}

closeBox();