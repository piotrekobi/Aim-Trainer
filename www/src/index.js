import { Menu } from "./modes";

const BACKGROUND_COLOR = "#f5ab45"

class Game {
    constructor(nick = "Default_Nick") {
        this.canvas = document.getElementById("main-canvas");
        this.canvas.width = window.innerWidth / 1.7;
        this.canvas.height = window.innerHeight / 1.3;
        this.buttonWidth = this.canvas.width - 100;
        this.buttonHeight = 60;
        this.ctx = this.canvas.getContext("2d");
        this.nick = nick
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



var game = new Game();
game.currentMode = new Menu();
game.currentMode.run();
export { game };