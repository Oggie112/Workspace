// canvas variables;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let scale = window.devicePixelRatio;
let w = 500;
let h = 500;
canvas.style.width = w;
canvas.style.height = h;
canvas.width = w * scale;
canvas.height = h * scale;
ctx.scale(scale, scale);
let interval = 0;
let score = 0;
// scale issue arise from using scaled values in script rather than original 
// ball variables;
let x = (Math.random() * (w - 100)) + 10;
let y = (Math.random() * (h - 200)) + 10;
let dx = 1;
let dy = 1;
let bSpeed = 1;
let bR = 8;
//paddle variables;
let paddleHeight = 10;
let paddleWidth = w / 5;
let pY = h - paddleHeight;
let pX = (w - paddleWidth) / 2;
let leftPress = false;
let rightPress = false;

// functions
function game() {
    let mode = document.querySelector('input[name="mode"]:checked').value; // Allows for more resuable code;
    if (mode === "1P") {
        return draw1(mode);
    } else if (mode === "2P") {
        return draw2(mode);
    } else if (mode === "Block Breaker") {
        return drawBB(mode);
    }
}
const draw1 = (mode) => {
    ctx.clearRect(0, 0 , w, h)
    inside(mode);
    drawBall();
    drawPaddle();
    movePaddle();
    x += dx;
    y += dy;
};
const draw2 = (mode) => {
    ctx.clearRect(0, 0 , w, h)
    inside(mode); 
    drawBall();
    drawPaddle();
    movePaddle();
    drawPaddle2();
    movePaddle2();
    x += dx;
    y += dy;
};
const drawBB = (mode) => {
    ctx.clearRect(0, 0 , w, h);
    drawBricks();
    brickCollision();
    drawBall();
    drawPaddle();
    movePaddle();
    inside(mode);
    
    x += dx;
    y += dy;
};
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, bR, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function inside(mode) {
    if (mode === "2P") {
    switch (true) {
        case x + dx + bR > w || x + dx - bR < 0 : dx = -dx;
        break;
        case y + dy - bR < pY2 + paddleHeight && (x + bR) > pX2 && (x - bR) < (pX2 + paddleWidth)  : paddleRebound2();
        break;
        case y + dy + bR > pY && (x + bR) > pX && (x - bR) < (pX + paddleWidth) : paddleRebound();
        break;
        case y - bR > h || y + bR < 0 : gameOver(mode);
        default: return true;
    };
} else {
    switch (true) {
    case x + dx + bR > w || x + dx - bR < 0 : dx = -dx;
    break;
    case y + dy - bR < 0 : topWall();
    break;
    case y + dy + bR > pY && (x + bR) > pX && (x - bR) < (pX + paddleWidth) : paddleRebound();
    break;
    case y - bR > h : gameOver();
    default: return true;
};
};
};
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(pX, pY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
};
function movePaddle() {
    if (leftPress && pX > 0) {
        pX -= 3;
    } else if (rightPress && pX + paddleWidth < w) {
        pX += 3;
    }
}
function paddleRebound() {
    console.log(bSpeed)
    let intersect = (pX + (paddleWidth / 2)) - x;
    let maxAngle = 5 * Math.PI / 12;
    let angle = (intersect / (paddleWidth / 2)) * maxAngle;
    bSpeed < 4 ? bSpeed += 0.1 : null;
    dy =  bSpeed * -Math.cos(angle)
    dx = bSpeed * -Math.sin(angle);
};
function topWall() {
    dy = -dy;
    score += 1;
    let scoreBox = document.getElementById("scoreBox");
    scoreBox.textContent = "Score: " + score;
};
function gameOver(mode) {
    mode !== "2P" ? alert("Game Over") : y + bR < 0 ? alert("Player 1 wins!") : alert("Player 2 wins!");
    document.location.reload();
    window.clearInterval(interval);
};

// 2 Player

let pY2 = 0;
let pX2 = (w - paddleWidth) / 2;
let leftPress2 = false;
let rightPress2 = false;

function drawPaddle2() {
    ctx.beginPath();
    ctx.rect(pX2, pY2, paddleWidth, paddleHeight);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
};
function movePaddle2() {
    if (leftPress2 && pX2 > 0) {
        pX2 -= 3;
    } else if (rightPress2 && pX2 + paddleWidth < w) {
        pX2 += 3;
    };
};
function paddleRebound2() {
    let intersect = (pX2 + (paddleWidth / 2)) - x;
    let maxAngle = 5 * Math.PI / 12;
    let angle = (intersect / (paddleWidth / 2)) * maxAngle;
    bSpeed < 4 ? bSpeed += 0.1 : null;
    dy =  bSpeed * Math.cos(angle)
    dx = bSpeed * -Math.sin(angle);
};
// Brick variables
let brickPadding = 10;
let brickTopOff = 25;

let brickWidth = 70;
let brickHeight = 20;
let rows = 3;
let cols = Math.floor(w / 90);
let check = w / Math.floor(w / 90)
let brickLeftOff = check / 2;

// Brick functions
function createBricks() {
    let bricksArr = [];
    for (let c = 0; c < cols; c++) {
        bricksArr[c] = [];
        for (let r = 0; r < rows; r++) {
            bricksArr[c][r] = {x: 0, y: 0, lives: 1};
        };
    };
    return bricksArr
};
let bricks = createBricks();
function drawBricks() {
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            if (bricks[c][r].lives > 0) {
            brickX = c * (brickWidth + brickPadding) + brickLeftOff;
            brickY = r * (brickHeight + brickPadding) + brickTopOff;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#00000";
            ctx.fill();
            ctx.closePath();
            };
        };
    };
};
function brickCollision() {
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            let brick = bricks[c][r];
            if (x + dx + bR > brick.x && x + dx - bR < (brick.x + brickWidth) && y + dy - bR < (brick.y + brickHeight) && y + dy + bR > brick.y && brick.lives > 0) {
                brick.lives -= 1;
                if (y <= brick.y || y >= brick.y + brickHeight) {
                    dy = -dy;
                } else {
                    dx = -dx;
                }
            } 
        };
    };
};

// event listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
function keyDownHandler(event) {
    event.preventDefault();
    if (event.key === "ArrowLeft") {
        leftPress = true;
    } else if (event.key === "ArrowRight") {
        rightPress = true;
    };
    if (event.key === "a") {
        leftPress2 = true;
    } else if (event.key === "d") {
        rightPress2 = true;
    }
};
function keyUpHandler(event) {
    event.preventDefault();
    if (event.key === "ArrowLeft") {
        leftPress = false;
    } else if (event.key === "ArrowRight") {
        rightPress = false;
    };
    if (event.key === "a") {
        leftPress2 = false;
    } else if (event.key === "d") {
        rightPress2 = false;
    };
};

// ancillary & start
function start() {
    interval = setInterval(game, 10);
};
let button = document.getElementById("startButton");
button.addEventListener("click", function() {
    start();
    this.disabled = true;
    document.getElementById("form").mode.forEach((e) => e.disabled = true);
});

