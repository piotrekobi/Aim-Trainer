import { Target } from "aim-trainer";

const canvas = document.getElementById("main-canvas");
canvas.width = window.innerWidth / 1.7;
canvas.height = window.innerHeight / 1.3;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#f5ab45";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const BUTTON_WIDTH = canvas.width - 100;
const BUTTON_HEIGHT = 60;
const BUTTON_SPACING = 30;
const TOP_MARGIN = 200;

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
    drawLogo();
    drawCrosshair(canvas.width / 2, 100);
  menuButtons.forEach((button) => button.draw());
};

const drawLogo = () => {
    console.log(canvas.width)
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

canvas.addEventListener("mousemove", (event) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const x = (event.clientX - boundingRect.left) * scaleX;
  const y = (event.clientY - boundingRect.top) * scaleY;

  checkButtonHighlight(x, y);
  drawMenu();
});

canvas.addEventListener("click", (event) => {
    const boundingRect = canvas.getBoundingClientRect();
  
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;
  
    const x = (event.clientX - boundingRect.left) * scaleX;
    const y = (event.clientY - boundingRect.top) * scaleY;
  
    checkButtonClick(x, y);
  });

const menuButtons = [
  new MenuButton(0, "Tryb 1", "#FF0000", "#AA0000", testFunc),
  new MenuButton(1, "Tryb 2", "#0000FF", "#0000AA", testFunc),
  new MenuButton(2, "Tryb 3", "#008000", "#004000", testFunc),
  new MenuButton(3, "Tryb 4", "#000000", "#333333", testFunc),
];

drawMenu();
