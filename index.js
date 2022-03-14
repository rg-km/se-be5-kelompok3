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

var audioEat = new Audio('assets/eat.wav');
var audioLevelUp = new Audio('assets/level.mp3');
var audioGameOver = new Audio('assets/game-over.mp3');
var audioDefeat = new Audio('assets/defeat.mp3');
var audioNyawa = new Audio('assets/nyawa.wav');


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

var wallX = [];
var wallY = [];
var levelWall2 = [
  {
    x1: 2,
    x2: 15,
    y: 5,
  },
];
var levelWall3 = [
  {
    x: 4,
    y1: 15,
    y2: 30,
  },
];
var levelWall4 = [
  {
    x1: 8,
    x2: 22,
    y: 20,
  },
];
var levelWall5 = [
  {
    x1: 0,
    x2: 30,
    y: 0,
  }, 
  {
    x1: 0,
    x2: 30,
    y: 29,
  }, 
  {
    y1: 0,
    y2: 30,
    x: 0,
  },
  {
    y1: 0,
    y2: 30,
    x: 29,
  }
];

function initWall2() {
    for (let i = 0; i < levelWall2.length; i++) {
      for (let j = levelWall2[i].x1; j <= levelWall2[i].x2; j++) {
        wallX.push(j);
        wallY.push(levelWall2[i].y);
      }
    }
  }
  
  function initWall3() {
    for (let i = 0; i < levelWall3.length; i++) {
      for (let j = levelWall3[i].y1; j <= levelWall3[i].y2; j++) {
        wallY.push(j);
        wallX.push(levelWall3[i].x);    
      }
    }
  }
  
  function initWall4() {
    for (let i = 0; i < levelWall4.length; i++) {
      for (let j = levelWall4[i].x1; j <= levelWall4[i].x2; j++) {
        wallX.push(j);
        wallY.push(levelWall4[i].y);
      }
    }
  }
  
  function initWall5() {
    for (let i = 0; i < levelWall5.length; i++) {
      for (let j = levelWall5[i].x1; j <= levelWall5[i].x2; j++) {
        wallX.push(j);
        wallY.push(levelWall5[i].y);
      }
    }
    for (let i = 0; i < levelWall5.length; i++) {
      for (let j = levelWall5[i].y1; j <= levelWall5[i].y2; j++) {
        wallY.push(j);
        wallX.push(levelWall5[i].x);
      }
    }
  }

  function createWall() {
    let wallCanvas = document.getElementById("snakeBoard");
    let ctx = wallCanvas.getContext("2d");
    for (let i = 0; i < wallX.length; i++) {
      drawWall(ctx, wallX[i], wallY[i], "#808080");
    }
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

function drawWall(ctx, x, y, color){
    ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        var snakeHeadImg = document.getElementById("snakeHead");
        var snakeBodyImg = document.getElementById("snakeBody");

        ctx.drawImage(snakeHeadImg, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

        for (let i = 1; i < snake.body.length; i++) {
            ctx.drawImage(snakeBodyImg, snake.body[i].x * CELL_SIZE, snake.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

        }

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

        createWall();
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

        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            audioEat.play();
            apple.position = initPosition();
            if(apple.position.x == wallX && apple.position.y == wallY){
                apple.position = initPosition();
            }
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});

            if(snake.score%5==0 && snake.level <= 5){
                audioLevelUp.play();
                snake.level++;
                MOVE_INTERVAL-=30;
                if (snake.level == 2) {
                    initWall2();
                  } else if (snake.level == 3) {
                    initWall3();
                  } else if (snake.level == 4) {
                    initWall4();
                  } else if (snake.level == 5) {
                      wallX = [];
                      wallY = [];
                    initWall5();
                  }
                // nextLevel();
            }
        }
    }
}

function dapatNyawa(snake, nyawa) {

    if (snake.head.x == nyawa.position.x && snake.head.y == nyawa.position.y) {
        audioNyawa.play();
        nyawa.position = initPosition();
        snake.score++;
        snake.nyawa++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        if (snake.level == 2) {
            initWall2();
          } else if (snake.level == 3) {
            initWall3();
          } else if (snake.level == 4) {
            initWall4();
          } else if (snake.level == 5) {
            initWall5();
            wallX = [];
            wallY = [];
          }
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

    for (let i = 0; i < wallX.length; i++) {
        if (
        snake.head.x === wallX[i] &&
          (snake.direction == 2 || snake.direction == 3)
        ) {
          if (
          snake.head.y - 1 === wallY[i] ||
          snake.head.y + 1 === wallY[i]
          ) {
            isCollide = true;
            snake.direction = (Math.random() < 5) ? 0 : 1;
        }
    }
    
    if (
        snake.head.y === wallY[i] &&
        (snake.direction == 0 || snake.direction == 1)
        ) {
            if (
                snake.head.x - 1 === wallX[i] ||
                snake.head.x + 1 === wallX[i]
                ) {
                    isCollide = true;
                    snake.direction = (Math.random() < 5) ? 2 : 3;
          }
        }
      }
    if (isCollide) {

        snake.nyawa--;
        if(snake.nyawa!=0){
            audioGameOver.play();
            alert("Upss.... kamu masih memiliki " + snake.nyawa + " kesempatan");
        }

        if(snake.nyawa == 0){
            audioDefeat.play();
            alert("HUUU... KAMU KALAH... Mulai Dari Awal");
            snake = initSnake("blue");
            wallX = [];
            wallY = [];
            MOVE_INTERVAL = 150;

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