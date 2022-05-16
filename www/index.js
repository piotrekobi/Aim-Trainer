import { greet } from "aim-trainer";

const canvas = document.getElementById("main-canvas");
canvas.width = window.innerWidth / 1.7;
canvas.height = window.innerHeight / 1.3;

const BUTTON_WIDTH = canvas.width - 100;
const BUTTON_HEIGHT = 60;
const BUTTON_SPACING = 30;
const TOP_MARGIN = 200;
const BACKGROUND_COLOR = "#f5ab45"

let ctx = canvas.getContext("2d");
let points = 0;
let x = getRandomInt(60, canvas.width - 60);
let y = getRandomInt(60, canvas.height - 60);

class MenuButton {
    constructor(index, text, color, highlightColor, func) {
        this.index = index;
        this.text = text;
        this.color = color;
        this.hightlightColor = highlightColor;
        this.func = func;
        this.x = canvas.width / 2 - BUTTON_WIDTH / 2;
        this.y = (BUTTON_HEIGHT + BUTTON_SPACING) * this.index + TOP_MARGIN;
        this.highlighted = false;
    }

    draw() {
        ctx.fillStyle = this.highlighted ? this.hightlightColor : this.color;
        ctx.fillRect(this.x, this.y, BUTTON_WIDTH, BUTTON_HEIGHT);
        ctx.fillStyle = "white";
        const fontSize = BUTTON_HEIGHT - 20;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(
            this.text,
            canvas.width / 2,
            this.y + (BUTTON_HEIGHT / 2 + fontSize / 2 - fontSize / 7)
        );
    }

    cursorInside(x, y) {
        return (
            x >= this.x &&
            x <= this.x + BUTTON_WIDTH &&
            y >= this.y &&
            y <= this.y + BUTTON_HEIGHT
        );
    }
}

const testFunc = (text) => {
    console.log(text);
};

const drawMenu = () => {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawLogo();
    drawCrosshair(canvas.width / 2, 100);
    menuButtons.forEach((button) => button.draw());
};

const drawLogo = () => {
    ctx.fillStyle = "black";
    const fontSize = BUTTON_HEIGHT - 20;
    ctx.font = "100px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "AIM",
        canvas.width / 4,
        150
    )
    ctx.font = "70px Arial";

    ctx.fillText(
        "TRAINER",
        canvas.width - 170,
        140
    )
}

const drawCrosshair = (x, y) => {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, 2 * Math.PI);
    ctx.stroke()
    ctx.fillRect(x - 65, y - 5, 30, 10);
    ctx.fillRect(x + 35, y - 5, 30, 10);
    ctx.fillRect(x - 5, y - 65, 10, 30);
    ctx.fillRect(x - 5, y + 35, 10, 30);
}

const checkButtonHighlight = (x, y) => {
    menuButtons.forEach(button => {
        button.highlighted = button.cursorInside(x, y);
    });
};

const checkButtonClick = (x, y) => {
    menuButtons.forEach(button => {
        if (button.cursorInside(x, y))
            button.func(button.text);
    });
}

const runMode = () => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("click", handleButtonClick);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener("mousedown", handleMouseDown);
    x = getRandomInt(60, canvas.width - 60);
    y = getRandomInt(60, canvas.height - 60);
    drawTarget(x, y);
    setTimeout(endMode, 5000);
}

function endMode() {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleButtonClick);
    drawMenu();
    greet(points.toString());
    points = 0;
}

const menuButtons = [
    new MenuButton(0, "Tryb 1", "#FF0000", "#AA0000", runMode),
    new MenuButton(1, "Tryb 2", "#0000FF", "#0000AA", testFunc),
    new MenuButton(2, "Tryb 3", "#008000", "#004000", testFunc),
    new MenuButton(3, "Tryb 4", "#000000", "#333333", testFunc),
];

function handleMouseMove(event) {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const x = (event.clientX - boundingRect.left) * scaleX;
    const y = (event.clientY - boundingRect.top) * scaleY;

    checkButtonHighlight(x, y);
    drawMenu();
}

function handleMouseDown(event) {
    getMousePosition(canvas, event);
}

function handleButtonClick(event) {
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const x = (event.clientX - boundingRect.left) * scaleX;
    const y = (event.clientY - boundingRect.top) * scaleY;

    checkButtonClick(x, y);
}

function fillCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
function drawTarget(x, y) {
    fillCircle(x, y, 60, 'red');
    fillCircle(x, y, 40, 'white');
    fillCircle(x, y, 20, 'red');
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let mx = event.clientX - rect.left;
    let my = event.clientY - rect.top;
    if (Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2)) <= 60) {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        x = getRandomInt(60, canvas.width - 60);
        y = getRandomInt(60, canvas.height - 60);
        drawTarget(x, y);
        points++
    }
}

canvas.addEventListener("mousemove", handleMouseMove)
canvas.addEventListener("click", handleButtonClick);

drawMenu();
