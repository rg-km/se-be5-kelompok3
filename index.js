const CELL_SIZE = 20;
// Soal no 1: Set canvas size menjadi 600
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 10;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

let MOVE_INTERVAL = 150;
let nyawasnake = 3;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        nyawa: 3,
        // menambahkan level snake
        level: 1
    }
}
let snake = initSnake("blue");

// make apples 
let apples = [{
    color: "red",
    position: initPosition(),
},
{
    color: "green",
    position: initPosition(),
}]

let nyawa = {
    position: initPosition()
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// level board
function drawLevel(snake) {
    let levelCanvas;
    levelCanvas = document.getElementById("levelBoard");
    let levelCtx = levelCanvas.getContext("2d");

    levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    levelCtx.font = "30px Arial";
    levelCtx.fillText("Level " + snake.level, 10, levelCanvas.scrollHeight / 2);
}

// nyawa board
function drawNyawa(snake) {
    let NyawaCanvas;
    NyawaCanvas = document.getElementById("nyawaBoard");
    let NyawaCtx = NyawaCanvas.getContext("2d");
    let nyawaX = 10;
    let nyawaY = 5;
    let cell = 15;
    NyawaCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    for(let i = 1; i <= snake.nyawa; i++){
        var img = document.getElementById("nyawa");
        if(i%11==0){
            nyawaY+=25;
            nyawaX = 10
        }
        NyawaCtx.drawImage(img, nyawaX, nyawaY, cell, cell);
        nyawaX+=20;
    }
}

// ScoreBoard
function drawScore(snake) {
    let scoreCanvas;
    scoreCanvas = document.getElementById("score2Board");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillText("Score", 25, 20);
    scoreCtx.font = "25px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 40, scoreCanvas.scrollHeight / 2);
    scoreCtx.font = "15px Arial";
    scoreCtx.fillText("Kecepatan", 15, 65);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(MOVE_INTERVAL + "ms", 20, 90);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
        drawCell(ctx, snake.head.x, snake.head.y, snake.color);
        for (let i = 1; i < snake.body.length; i++) {
            drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
        }

        // for (let i = 1; i < 10; i++) {
        //     drawCell(ctx, i, i, snake.color);
        // }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        let prima = 0;
        for(let k = 1; k <= snake.score; k++){
            if(snake.score%k==0){
                prima++;
            }
        }
        if(prima == 2){
            var img = document.getElementById("nyawa");
            ctx.drawImage(img, nyawa.position.x * CELL_SIZE, nyawa.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);    
        }

        drawLevel(snake);
        drawScore(snake);
        drawNyawa(snake);
        
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        var audio = new Audio('/assets/eat.wav');
        var audiolevel = new Audio('/assets/level.mp3');
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            audio.play();
            apple.position = initPosition();
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});

            if(snake.score%5==0 && snake.level < 5){
                audiolevel.play();
                snake.level++;
                MOVE_INTERVAL-=40;
            }
        }
    }
}

function dapatNyawa(snake, nyawa) {
    var audio = new Audio('/assets/nyawa.wav');
    if (snake.head.x == nyawa.position.x && snake.head.y == nyawa.position.y) {
        audio.play();
        nyawa.position = initPosition();
        snake.score++;
        snake.nyawa++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
}


function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
    dapatNyawa(snake, nyawa);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
    dapatNyawa(snake, nyawa);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
    dapatNyawa(snake, nyawa);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
    dapatNyawa(snake, nyawa);
}

function checkCollision(snakes) {
    let isCollide = false;
    for (let j = 0; j < snakes.length; j++) {
        for (let k = 1; k < snakes[j].body.length; k++) {
            if (snakes[j].head.x == snakes[j].body[k].x && snakes[j].head.y == snakes[j].body[k].y) {
                isCollide = true;
            }
        }
    }
    if (isCollide) {
        var audio = new Audio('/assets/game-over.mp3');
        var audioDefeat = new Audio('/assets/defeat.mp3');
        snake.nyawa--;
        if(snake.nyawa!=0){
            audio.play();
            alert("Upss.... kamu masih memiliki " + snake.nyawa + " kesempatan");
        }

        if(snake.nyawa == 0){
            audioDefeat.play();
            alert("HUUU... KAMU KALAH... Mulai Dari Awal");
            snake = initSnake("blue");
            MOVE_INTERVAL = 150
        }
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {

    if (event.key === "a") {
        turn(snake, DIRECTION.LEFT);
    } else if (event.key === "d") {
        turn(snake, DIRECTION.RIGHT);
    } else if (event.key === "w") {
        turn(snake, DIRECTION.UP);
    } else if (event.key === "s") {
        turn(snake, DIRECTION.DOWN);
    }

})

function initGame() {
    move(snake);
}

initGame();