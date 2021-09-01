let canvas, canvasContext;
let ballX = 400;
let ballY = 400;
let ballSpeedX = 2;
let ballSpeedY = 3;

let paddle1X = 300;

const paddleWidth = 100;
const paddleDistFromEdge = 40;
const paddleThickness = 10;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 3;
const BRICK_COLUMNS = 10;
const BRICK_ROWS = 14;

let playerScore = 0;

let mouseX = 0;
let mouseY = 0;

let playingGame = true;

let brickGrid = new Array(BRICK_COLUMNS * BRICK_ROWS);
let bricksLeft = 0;

const brickReset = () => {
    let i = 0;
    for (i; i < 3 * BRICK_COLUMNS; i++) {
        brickGrid[i] = false;
    }

    for (i; i < BRICK_COLUMNS * BRICK_ROWS; i++) {
        bricksLeft++;
        brickGrid[i] = true;
    }

    // brickGrid[1] = false;
}

window.onload = () => {
    canvas = document.querySelector('#gameCanvas');
    canvasContext = canvas.getContext('2d');

    brickReset();

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener("mousemove", (event) => {
        let mousePos = calculateMousePosition(event);
        paddle1X = mousePos.x - paddleWidth / 2;
    });

    setInterval(runGame, 1000 / 60);
}

const runGame = () => {
    moveEverything();
    drawEverything();
}

const handleMouseClick = () => {
    if (!playingGame) {
        playerScore = 0;
        playingGame = true;
    }
}

const ballReset = () => {
    // TODO: ADD 3 LIVES
    playingGame = false;

    ballSpeedY = 3;
    ballSpeedX = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

const calculateMousePosition = (event) => {
    let gameRect = canvas.getBoundingClientRect();
    let root = document.documentElement;

    mouseX = event.clientX - gameRect.left - root.scrollLeft;
    mouseY = event.clientY - gameRect.top - root.scrollTop;

    // CHEAT CODE TO MOVE BALL WITH MOUSE
    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedX = 1;
    // ballSpeedY = -1;

    return {x: mouseX, y: mouseY};
}

const ballMove = () => {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX < 0) {
        ballSpeedX *= -1;
    }

    if (ballX > canvas.width) {
        ballSpeedX *= -1;
    }

    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY > canvas.height) {
        ballReset();
    }
}

const ballBrickHandle = () => {
    let ballCol = Math.floor(ballX / BRICK_W);
    let ballRow = Math.floor(ballY / BRICK_H);
    let ballArrIndex = rowColToArrayIndex(ballCol, ballRow);

    if (ballCol >= 0 && ballCol < BRICK_COLUMNS &&
        ballRow >= 0 && ballRow < BRICK_ROWS) {
        if (brickGrid[ballArrIndex]) {
            brickGrid[ballArrIndex] = false;
            bricksLeft--

            let prevBallX = ballX - ballSpeedX;
            let prevBallY = ballY - ballSpeedY;
            let prevBallCol = Math.floor(prevBallX / BRICK_W);
            let prevBallRow = Math.floor(prevBallY / BRICK_H);

            if (prevBallRow !== ballRow) {
                ballSpeedY *= -1;
            }

            if (prevBallCol !== ballCol) {
                ballSpeedX *= -1;
            }
        }
    }
}

const ballPaddleHandle = () => {
    let playerPaddleTop = canvas.height - paddleDistFromEdge - paddleThickness;
    let playerPaddleBottom = canvas.height - paddleDistFromEdge;
    let playerPaddleLeft = paddle1X;
    let playerPaddleRight = paddle1X + paddleWidth;

    if (ballY >= playerPaddleTop &&
        ballY <= playerPaddleBottom &&
        ballX >= playerPaddleLeft &&
        ballX <= playerPaddleRight) {
        ballSpeedY = -ballSpeedY;
        let diffX = ballX - (paddle1X + paddleWidth / 2);
        ballSpeedX = diffX * 0.25;
    }
}

const moveEverything = () => {
    if (!playingGame) {
        return;
    }

    ballMove();
    ballBrickHandle();
    ballPaddleHandle();
}

const drawEverything = () => {

    // background
    drawRectangle(0, 0, canvas.width, canvas.height, 'black');

    if (!playingGame) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('click to play again', 400, 300);
        return;
    }

    // ball
    drawCircle(ballX, ballY, 10, 'white');

    // game palette
    drawRectangle(paddle1X, canvas.height - paddleDistFromEdge, paddleWidth, paddleThickness, 'white');

    canvasContext.font = "23px Arial";

    // display player score
    colorText(playerScore, 700, 50, 'white');

    drawBricks();

}

const rowColToArrayIndex = (col, row) => {
    return BRICK_COLUMNS * row + col;
}

const drawBricks = () => {
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let column = 0; column < BRICK_COLUMNS; column++) {
            if (brickGrid[rowColToArrayIndex(column, row)]) {
                drawRectangle(BRICK_W * column, BRICK_H * row, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
            }
        }
    }
}