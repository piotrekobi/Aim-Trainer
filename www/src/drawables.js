import { cursor_inside, is_hit } from "aim-trainer";
import { game } from "./index"

const BUTTON_SPACING = 30;
const TOP_MARGIN = 200;

class MenuButton {
    constructor(index, text, color, highlightColor, mode, modeArgs) {
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
        return (is_hit(x, y, this.x, this.y, this.size, this.sizeRatio))
    }
}

class Logo {
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

export { MenuButton, Logo, Target };
