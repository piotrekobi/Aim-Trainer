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
        this.points = 0;
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    run() {
        game.canvas.addEventListener("click", this.handleClick);
        game.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.drawTimer = setInterval(this.draw.bind(this), 10);
    }

    end(message_text = null) {
        game.canvas.removeEventListener("click", this.handleClick);
        game.canvas.removeEventListener("mousemove", this.handleMouseMove);
        clearInterval(this.drawTimer);
        if (message_text)
            message(message_text);

        if (!(game.currentMode instanceof Menu)) {
            game.currentMode = new Menu();
            game.currentMode.run();
        }

    }

    handleClick(event) {
    }

    handleMouseMove(event) {
    }

}

class Menu extends Mode {
    constructor() {
        super();
        this.buttons = [
            new MenuButton(0, "Time Trial", "#FF0000", "#AA0000", "TimeMode", []),
            new MenuButton(1, "Survival", "#0000FF", "#0000AA", SurvivalMode, [3, 0.5, 30]),
            new MenuButton(2, "Flick Training", "#008000", "#004000", FlickMode, [3, 1, 3]),
            new MenuButton(3, "Reaction Time", "#000000", "#333333", "ReactionMode", []),
        ];
        this.logo = new Logo();

    }
    draw() {
        game.drawBackground();
        this.logo.draw();
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
            if (button.cursorInside(x, y)) {
                this.end();
                game.currentMode = new button.mode(...button.modeArgs);
                game.currentMode.run()
            }

        });
    }
    drawButtons() {
        this.buttons.forEach((button) => button.draw());
    }
}
class Drawable {
    constructor() {
    }
    draw() {
        throw new Error("Abstract method has no implementation");
    }
}

class MenuButton extends Drawable {
    constructor(index, text, color, highlightColor, mode, modeArgs) {
        super();
        this.index = index;
        this.text = text;
        this.color = color;
        this.hightlightColor = highlightColor;
        this.mode = mode;
        this.modeArgs = modeArgs;
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


class Target extends Drawable {
    constructor(x, y, size, lifeTime = null) {
        super();
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
        this.fillCircle(this.x, this.y, this.size * this.sizeRatio, 'red');
        this.fillCircle(this.x, this.y, this.size * 2 / 3 * this.sizeRatio, 'white');
        this.fillCircle(this.x, this.y, this.size * 1 / 3 * this.sizeRatio, 'red');
    }

    fillCircle(x, y, radius, color) {
        game.ctx.fillStyle = color;
        game.ctx.beginPath();
        game.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        game.ctx.fill();
    }

    hit(x, y) {
        return (Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)) <= this.size * this.sizeRatio)
    }
}

class Logo extends Drawable {
    draw() {
        this.drawBackground()
        this.drawCrosshair()
    }

    drawCrosshair() {
        game.ctx.lineWidth = 5;
        game.ctx.strokeStyle = "red";
        game.ctx.fillStyle = "red";
        game.ctx.beginPath();
        let a = game.canvas.width / 2;
        let b = 100;
        game.ctx.arc(a, b, 50, 0, 2 * Math.PI);
        game.ctx.stroke()
        game.ctx.fillRect(a - 65, b - 5, 30, 10);
        game.ctx.fillRect(a + 35, b - 5, 30, 10);
        game.ctx.fillRect(a - 5, b - 65, 10, 30);
        game.ctx.fillRect(a - 5, b + 35, 10, 30);
    }
    drawBackground() {
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
}
class SurvivalMode extends Mode {
    constructor(lives, interval, maxSize) {
        super();
        this.lives = lives;
        this.startTime = Date.now();
        this.interval = interval * 1000;
        this.maxSize = maxSize;
        this.lastTargetTime = Date.now() - this.interval;
        this.targets = [];
    }

    draw() {
        game.ctx.fillStyle = BACKGROUND_COLOR;
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
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
            this.end(`Time survived: ${(Date.now() - this.startTime) / 1000} seconds`);

    }

    drawLives() {
        game.ctx.fillStyle = "black";
        game.ctx.textAlign = "center";
        game.ctx.fillText(
            `Lives: ${this.lives}`,
            game.canvas.width / 2,
            game.canvas.height / 5
        );
    }

    handleClick(event) {
        let rect = game.canvas.getBoundingClientRect();
        let mx = event.clientX - rect.left;
        let my = event.clientY - rect.top;
        this.targets.forEach(target => {
            if (target.hit(mx, my)) {
                target.destroyed = true;
            }
        });
        this.targets = this.targets.filter(target => target.destroyed == false);
    }
}

class FlickMode extends Mode {
    constructor(rounds, timeMin, timeMax) {
        super();
        this.rounds = rounds;
        this.timeMin = timeMin;
        this.timeMax = timeMax;
        this.flickEvent = false;
        this.waitingTarget = new Target(game.canvas.width/2, game.canvas.height/2, 60, 99999);
        this.mainTarget = new Target(game.canvas.width/2, game.canvas.height/2, 60, 99999);
    }

    draw() {
        game.ctx.fillStyle = BACKGROUND_COLOR;
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        if (this.flickEvent == false) {
            this.waitingTarget.draw();
        }
        else {
            this.mainTarget.draw();
        }
    }

    run() {
        game.canvas.addEventListener("click", this.handleClick);
        this.drawTimer = setInterval(this.draw.bind(this), 10);
    }

    handleClick(event) {
        let rect = game.canvas.getBoundingClientRect();
        let mx = event.clientX - rect.left;
        let my = event.clientY - rect.top;

        if (this.flickEvent == true) {
            if (this.mainTarget.hit(mx, my)) {
                this.flickEvent = false
                this.rounds --;
                if (this.rounds == 0) {
                    this.end();
                }
            }
        }
        //flickEvent == false
        else {
            if (this.waitingTarget.hit(mx, my)) {
                let timeToWait = randint(3000, 5000)
                setTimeout(this.setFlickEvent(), timeToWait);
                this.mainTarget = new Target(randint(60, game.canvas.width - 60), randint(60, game.canvas.height - 60), 60);
                
            }
        }
    }

    setFlickEvent() {
        this.flickEvent = true;
    }

    end(message_text = null) {
        game.canvas.removeEventListener("click", this.handleClick);
        clearInterval(this.drawTimer);
        if (message_text)
            message(message_text);

        if (!(game.currentMode instanceof Menu)) {
            game.currentMode = new Menu();
            game.currentMode.run();
        }

    }

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