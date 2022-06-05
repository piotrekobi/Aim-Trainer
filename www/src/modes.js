import { message, randint } from "aim-trainer";
import { MenuButton, Logo, Target } from "./drawables";
import { game } from "./index"

const NO_CLICK_BACKGROUND_COLOR = "#FF0000"
const CLICK_BACKGROUND_COLOR = "#33FF36"

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
            new MenuButton(0, "Time Trial", "#FF0000", "#AA0000", TimeMode, [20]),
            new MenuButton(1, "Survival", "#0000FF", "#0000AA", SurvivalMode, [3, 0.5, 30]),
            new MenuButton(2, "Flick Training", "#008000", "#004000", FlickMode, [3, 1, 3]),
            new MenuButton(3, "Reaction Time", "#000000", "#333333", ReactionMode, [6, 3, 7]),
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


class TimeMode extends Mode {
    constructor(timeToEnd) {
        super();
        this.startTime = Date.now();
        this.timeToEnd = timeToEnd * 1000;
        this.target = new Target(randint(60, game.canvas.width - 60), randint(60, game.canvas.height - 60), 60, 99999);
    }

    draw() {
        game.drawBackground();
        this.target.draw();
        if (Date.now() > this.startTime + this.timeToEnd) {
            this.end(`Your score: ${this.points}`);
        }
        this.drawPoints();
    }

    drawPoints() {
        game.ctx.fillStyle = "black";
        game.ctx.textAlign = "center";
        game.ctx.fillText(
            `Points: ${this.points}`,
            game.canvas.width / 2,
            game.canvas.height / 2 + 20
        );
        game.ctx.fillText(
            `Time left: ${Math.floor((this.startTime + this.timeToEnd - Date.now()) / 1000)}`,
            game.canvas.width / 2,
            game.canvas.height / 2 - 20
        );
    }

    handleClick(event) {
        const [x, y] = game.getCursorCoords(event);
        if (this.target.hit(x, y)) {
            this.points++;
            this.target = new Target(randint(60, game.canvas.width - 60), randint(60, game.canvas.height - 60), 60, 99999);
        }
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
        game.drawBackground();
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
        const [x, y] = game.getCursorCoords(event);
        this.targets.forEach(target => {
            if (target.hit(x, y)) {
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
        this.waitingTarget = new Target(game.canvas.width / 2, game.canvas.height / 2, 60, 99999);
        this.mainTarget = new Target(game.canvas.width / 2, game.canvas.height / 2, 60, 99999);
    }

    draw() {
        game.drawBackground();
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
        const [x, y] = game.getCursorCoords(event);

        if (this.flickEvent == true) {
            if (this.mainTarget.hit(x, y)) {
                this.flickEvent = false
                this.rounds--;
                if (this.rounds == 0) {
                    this.end();
                }
            }
        }
        else {
            if (this.waitingTarget.hit(x, y)) {
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

class ReactionMode extends Mode {
    constructor(iterations, minWaitTime, maxWaitTime) {
        super();
        this.iterations = iterations;
        this.doneIterations = 0;
        this.minWaitTime = minWaitTime * 1000;
        this.maxWaitTime = maxWaitTime * 1000;
        this.waitTime = randint(this.minWaitTime, this.maxWaitTime);
        this.canIClick = 0;
        this.curTime = 0;
        this.clickTime = 0;
        this.startTime = 0;
        this.lastReaction = 0
    }

    draw() {
        game.drawBackground(NO_CLICK_BACKGROUND_COLOR);
        if (this.curTime > this.waitTime) {
            game.drawBackground(CLICK_BACKGROUND_COLOR);
            if (this.canIClick == 0) {
                this.startTime = Date.now();
            }
            this.canIClick = 1;
        }
        this.drawPoints();
        this.curTime += 10;
    }

    drawPoints() {
        game.ctx.fillStyle = "black";
        game.ctx.textAlign = "center";
        game.ctx.fillText(
            `Points: ${this.points}`,
            game.canvas.width / 2,
            game.canvas.height / 2
        );
        game.ctx.fillText(
            `Tries left: ${this.iterations - this.doneIterations}`,
            game.canvas.width / 2,
            game.canvas.height / 2 - 35
        );
        game.ctx.fillText(
            `Last reaction time: ${this.lastReaction}`,
            game.canvas.width / 2,
            game.canvas.height / 2 + 35
        );
    }

    handleClick(event) {
        this.curTime = 0;
        if (this.canIClick) {
            this.wait_time = randint(this.minWaitTime, this.maxWaitTime);
            this.canIClick = 0;
            this.doneIterations += 1;
            let currentDate = Date.now();
            this.lastReaction = currentDate - this.startTime
            let temp = 1000 - currentDate + this.startTime;
            if (temp > 0) {
                this.points += temp;
            }
            this.startTime = Date.now();
            if (this.doneIterations == this.iterations) {
                this.end(`Your score: ${this.points}`)
            }
        }
    }
}

export { Menu };