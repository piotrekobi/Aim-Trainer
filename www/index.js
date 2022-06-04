import { message, cursor_inside, randint } from "aim-trainer";


const BUTTON_SPACING = 30;
const TOP_MARGIN = 200;
const BACKGROUND_COLOR = "#f5ab45"

let points = 0;
let time_start = 0;
let rounds = 3;
class Game {
    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.canvas.width = window.innerWidth / 1.7;
        this.canvas.height = window.innerHeight / 1.3;
        this.buttonWidth = this.canvas.width - 100;
        this.buttonHeight = 60;
        this.ctx = this.canvas.getContext("2d");
    }

    getCursorCoords(event) {
        const boundingRect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / boundingRect.width;
        const scaleY = this.canvas.height / boundingRect.height;

        const x = (event.clientX - boundingRect.left) * scaleX;
        const y = (event.clientY - boundingRect.top) * scaleY;
        return [x, y];
    }

    drawBackground(color = BACKGROUND_COLOR) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Mode {
    constructor() {
        this.targets = [];
        this.points = 0;
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    run() {
        game.canvas.addEventListener("click", this.handleClick);
        game.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.drawTimer = setInterval(this.draw.bind(this), 10);
    }

    end() {
        game.canvas.removeEventListener("click", this.handleClick);
        game.canvas.removeEventListener("mousemove", this.handleMouseMove);
        clearInterval(this.drawTimer);
    }

}

class Menu extends Mode {
    constructor() {
        super();
        this.buttons = [
            new MenuButton(0, "Tryb 1", "#FF0000", "#AA0000", runMode),
            new MenuButton(1, "Tryb 2", "#0000FF", "#0000AA", runMode2),
            new MenuButton(2, "Tryb 3", "#008000", "#004000", runMode3),
            new MenuButton(3, "Tryb 4", "#000000", "#333333", testFunc),
        ];
    }
    draw() {
        game.drawBackground();
        drawLogo();
        drawCrosshair(game.canvas.width / 2, 100);
        this.drawButtons();
    }

    handleClick(event) {
        const [x, y] = game.getCursorCoords(event);
        this.checkButtonClick(x, y);
    }

    handleMouseMove(event) {
        const [x, y] = game.getCursorCoords(event);
        this.checkButtonHighlight(x, y)
    }

    checkButtonHighlight(x, y) {
        this.buttons.forEach(button => {
            button.highlighted = button.cursorInside(x, y);
        });
    }

    checkButtonClick(x, y) {
        this.buttons.forEach(button => {
            if (button.cursorInside(x, y))
                button.func(button.text);
        });
    }

    drawButtons() {
        this.buttons.forEach((button) => button.draw());
    }
}
class MenuButton {
    constructor(index, text, color, highlightColor, func) {
        this.index = index;
        this.text = text;
        this.color = color;
        this.hightlightColor = highlightColor;
        this.func = func;
        this.x = game.canvas.width / 2 - game.buttonWidth / 2;
        this.y = (game.buttonHeight + BUTTON_SPACING) * this.index + TOP_MARGIN;
        this.highlighted = false;
    }

    draw() {
        game.ctx.fillStyle = this.highlighted ? this.hightlightColor : this.color;
        game.ctx.fillRect(this.x, this.y, game.buttonWidth, game.buttonHeight);
        game.ctx.fillStyle = "white";
        const fontSize = game.buttonHeight - 20;
        game.ctx.font = `${fontSize}px Arial`;
        game.ctx.textAlign = "center";
        game.ctx.fillText(
            this.text,
            game.canvas.width / 2,
            this.y + (game.buttonHeight / 2 + fontSize / 2 - fontSize / 7)
        );
    }

    cursorInside(x, y) {
        return cursor_inside(x, y, this.x, this.y, game.buttonWidth, game.buttonHeight);
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
        ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        this.drawLives();
        if (Date.now() - this.lastTargetTime > this.interval) {
            this.lastTargetTime = Date.now();
            this.targets.push(new Target(randint(0 + this.maxSize, game.canvas.width - this.maxSize), randint(0 + this.maxSize, game.canvas.height - this.maxSize), this.maxSize, 4.0));
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
            game.canvas.width / 2,
            game.canvas.height / 5
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


const drawLogo = () => {
    game.ctx.fillStyle = "black";
    const fontSize = game.buttonHeight - 20;
    game.ctx.font = "100px Arial";
    game.ctx.textAlign = "center";
    game.ctx.fillText(
        "AIM",
        game.canvas.width / 4,
        150
    )
    game.ctx.font = "70px Arial";

    game.ctx.fillText(
        "TRAINER",
        game.canvas.width - 170,
        140
    )
}

const drawCrosshair = (x, y) => {
    game.ctx.lineWidth = 5;
    game.ctx.strokeStyle = "red";
    game.ctx.fillStyle = "red";
    game.ctx.beginPath();
    game.ctx.arc(x, y, 50, 0, 2 * Math.PI);
    game.ctx.stroke()
    game.ctx.fillRect(x - 65, y - 5, 30, 10);
    game.ctx.fillRect(x + 35, y - 5, 30, 10);
    game.ctx.fillRect(x - 5, y - 65, 10, 30);
    game.ctx.fillRect(x - 5, y + 35, 10, 30);
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

var game = new Game();
game.currentMode = new Menu();
game.currentMode.run();