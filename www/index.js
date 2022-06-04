import { message, cursor_inside, randint } from "aim-trainer";

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
let x = randint(60, canvas.width - 60);
let y = randint(60, canvas.height - 60);
let time_start = 0;
let time_to_wait = 3 * 1000;
let rounds = 3;

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
        return cursor_inside(x, y, this.x, this.y, BUTTON_WIDTH, BUTTON_HEIGHT);
    }
}


class Target {
    constructor(x, y, size, lifeTime = null) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.sizeRatio = 1;
        this.destroyed = 0;
        this.addTime = Date.now();
        if (lifeTime != null)
            this.lifeTime = lifeTime * 1000;
    }

    draw() {
        fillCircle(this.x, this.y, this.size * this.sizeRatio, 'red');
        fillCircle(this.x, this.y, this.size * 2 / 3 * this.sizeRatio, 'white');
        fillCircle(this.x, this.y, this.size * 1 / 3 * this.sizeRatio, 'red');
    }

    hit(x, y) {
        return (Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) <= this.size)
    }
}
class SurvivalMode {
    constructor(lives, interval, maxSize) {
        this.lives = lives;
        this.startTime = Date.now();
        this.interval = interval * 1000;
        this.maxSize = maxSize;
        this.lastTargetTime = Date.now() - this.interval;
        this.targets = [];
        this.updateTimer = setInterval(this.update.bind(this), 10);
        this.handleClick = this.handleClick.bind(this);
    }

    update() {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawLives();
        if (Date.now() - this.lastTargetTime > this.interval) {
            this.lastTargetTime = Date.now();
            this.targets.push(new Target(randint(0 + this.maxSize, canvas.width - this.maxSize), randint(0 + this.maxSize, canvas.height - this.maxSize), this.maxSize, 4.0));
        }
        this.targets.forEach(target => {
            if (!target.destroyed) {
                let currentLifeTime = Date.now() - target.addTime;
                if (currentLifeTime > target.lifeTime) {
                    target.destroyed = true;
                    this.lives -= 1;
                }
                target.sizeRatio = 1 - Math.abs((((currentLifeTime) / (target.lifeTime / 2)) % 2) - 1);
                target.draw()
            }
        });
        if (!this.lives > 0)
            this.end();

    }

    drawLives() {
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(
            `Lives: ${this.lives}`,
            canvas.width / 2,
            canvas.height / 5
        );
    }

    handleClick(event) {
        let rect = canvas.getBoundingClientRect();
        let mx = event.clientX - rect.left;
        let my = event.clientY - rect.top;
        for (let i = 0; i < this.targets.length; i++) {
            if (this.targets[i].hit(mx, my)) {
                console.log("a")
                this.targets[i].destroyed = true;
                break;
            }
        }
    }

    end() {
        clearInterval(this.updateTimer);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("click", handleButtonClick);
        drawMenu();
        message(`Time survived: ${(Date.now() - this.startTime) / 1000} seconds`);
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
    x = randint(60, canvas.width - 60);
    y = randint(60, canvas.height - 60);
    drawTarget(x, y);
    setTimeout(endMode, 5000);
}


const runMode2 = () => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("click", handleButtonClick);
    let mode = new SurvivalMode(3, 0.5, 30);
    canvas.addEventListener("click", mode.handleClick);

    // ctx.fillStyle = BACKGROUND_COLOR;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function endMode() {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleButtonClick);
    drawMenu();
    var xhr = new XMLHttpRequest();


    const a1gamer = 'http://localhost:8000/user_data/?nick=a1&timestamp=' + Math.floor(Date.now() / 1000) + '&mode=1&result=' + points.toString();


    xhr.open("POST", a1gamer, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({

        nick: ""

    }));
    message(`Score: ${points}`);
    points = 0;
}

const runMode3 = () => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("click", handleButtonClick);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener("click", handleMouseClick3);
    points = 0;
    rounds = 3;
    x = canvas.width / 2;
    y = canvas.height / 2;
    drawTarget(x, y)

}


function endMode3() {
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleButtonClick);
    drawMenu();
    var xhr = new XMLHttpRequest();


    const a1gamer = 'http://localhost:8000/user_data/?nick=a1&timestamp=' + Math.floor(Date.now() / 1000) + '&mode=3&result=' + points.toString();


    xhr.open("POST", a1gamer, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({

        nick: ""

    }));
    message(`Score: ${points}`);
    points = 0;
}
const menuButtons = [
    new MenuButton(0, "Tryb 1", "#FF0000", "#AA0000", runMode),
    new MenuButton(1, "Tryb 2", "#0000FF", "#0000AA", runMode2),
    new MenuButton(2, "Tryb 3", "#008000", "#004000", runMode3),
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

function handleMouseClick3(event) {
    let rect = canvas.getBoundingClientRect();
    let mx = event.clientX - rect.left;
    let my = event.clientY - rect.top;
    if (Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2)) <= 60) {
        canvas.removeEventListener("click", handleMouseClick3);
        let time_to_wait = randint(3000, 7000)
        setTimeout(handleFlickStart, time_to_wait);
    }
}

function handleFlickStart() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    time_start = Date.now();
    canvas.addEventListener("click", handleClick3Flick);
    x = randint(60, canvas.width - 60);
    y = randint(60, canvas.height - 60);
    drawTarget(x, y);
}

function handleClick3Flick(event) {
    let rect = canvas.getBoundingClientRect();
    let mx = event.clientX - rect.left;
    let my = event.clientY - rect.top;
    if (Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2)) <= 60) {
        points = points + Date.now() - time_start;
        rounds--;
        canvas.removeEventListener("click", handleClick3Flick);
        if (rounds < 1) {
            endMode3();
        }
        else {
            ctx.fillStyle = BACKGROUND_COLOR;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            x = canvas.width / 2;
            y = canvas.height / 2;
            drawTarget(x, y);
            canvas.addEventListener("click", handleMouseClick3);

        }
    }
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

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let mx = event.clientX - rect.left;
    let my = event.clientY - rect.top;
    if (Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2)) <= 60) {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        x = randint(60, canvas.width - 60);
        y = randint(60, canvas.height - 60);
        drawTarget(x, y);
        points++
    }
}

canvas.addEventListener("mousemove", handleMouseMove)
canvas.addEventListener("click", handleButtonClick);

drawMenu();
