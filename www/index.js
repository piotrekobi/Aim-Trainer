import { Target } from "aim-trainer";

const canvas = document.getElementById("main-canvas");
canvas.width = window.innerWidth / 1.7;
canvas.height = window.innerHeight / 1.3;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "lightblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 50;
const BUTTON_SPACING = 30;
const TOP_MARGIN = 50;

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
    console.log(window.innerWidth, window.innerHeight);
    ctx.fillStyle = this.highlighted ? this.hightlightColor : this.color;
    ctx.fillRect(this.x, this.y, BUTTON_WIDTH, BUTTON_HEIGHT);
    ctx.fillStyle = "white";
    const fontSize = BUTTON_HEIGHT - 20;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(
      this.text,
      canvas.width / 2,
      this.y + (BUTTON_HEIGHT / 2 + fontSize / 2)
    );
  }
}

const drawMenu = () => {
  menuButtons.forEach((button) => button.draw());
};

const checkButtonHighlight = (x, y) => {
  menuButtons.forEach((button) => {
    if (
      x >= button.x &&
      x <= button.x + BUTTON_WIDTH &&
      y >= button.y &&
      y <= button.y + BUTTON_HEIGHT
    ) {
      button.highlighted = true;
    } else {
      button.highlighted = false;
    }
  });
};

canvas.addEventListener("mousemove", (event) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const x = (event.clientX - boundingRect.left) * scaleX;
  const y = (event.clientY - boundingRect.top) * scaleY;

  checkButtonHighlight(x, y);
  drawMenu();
});

const menuButtons = [
  new MenuButton(0, "Tryb 1", "#FF0000", "#AA0000", null),
  new MenuButton(1, "Tryb 2", "#0000FF", "#0000AA", null),
  new MenuButton(2, "Tryb 3", "#008000", "#004000", null),
  new MenuButton(3, "Tryb 4", "#FFA500", "#FF8C00", null),
];

drawMenu();
