document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const ballRadius = 10;
    const paddleHeight = 10, paddleWidth = 75;
    const brickRowCount = 3, brickColumnCount = 5;
    const brickWidth = 75, brickHeight = 20, brickPadding = 10;
    const brickOffsetTop = 30, brickOffsetLeft = 30;

    let x = canvas.width/2, y = canvas.height-30;
    let dx = 1, dy = -1;    // x,y speeds
    let paddleX = (canvas.width-paddleWidth)/2;
    let rightPressed = false, leftPressed = false, mousePressed = false;
    let isPaused = false;
    let bricks = [], nbBricks = 0;
    let score = 0, level = 1;

    function keyDownHandler(e) {
        if (e.key==="Right" || e.key==="ArrowRight") {
            rightPressed = true;
            isPaused = false;
        }
        else if (e.key==="Left" || e.key==="ArrowLeft") {
            leftPressed = true;
            isPaused = false;
        }
    }

    function keyUpHandler(e) {
        if (e.key==="Right" || e.key==="ArrowRight") rightPressed = false;
        else if (e.key==="Left" || e.key==="ArrowLeft") leftPressed = false;
    }

    /* function mouseMoveHandler(e) {
        if (mousePressed) {
            const relativeX = e.clientX-canvas.offsetLeft;
            if (relativeX>0 && relativeX<canvas.width) paddleX = relativeX-paddleWidth/2;
        }
    } */

    function togglePause() {
        if (isPaused) {
            document.getElementById("pause-button").innerHTML = '<img src="img/pause.png" alt="Pause">';
        } else {
            document.getElementById("pause-button").innerHTML = '<img src="img/play.png" alt="Play">';
        }
        isPaused = !isPaused;
    }

    function collisionDetection() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                let b=bricks[c][r];
                if(b.status===1) {
                    if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        nbBricks -= 1;
                        score++;
                        document.getElementById("score").innerText = "Score: "+score;
                    }
                }
            }
        }
    }

    function initBricks() {
        for(let c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(let r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x:0, y:0, status:1 };
            }
        }
        nbBricks = brickColumnCount*brickRowCount;
    }

    function drawBricks() {
        for(let c=0; c<brickColumnCount; c++) {
            for(let r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status===1) {
                    let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                    let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX,brickY,brickWidth,brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x,y,ballRadius,0,Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();
            if (x+dx>canvas.width-ballRadius || x+dx<ballRadius) dx = -dx;
            if (y+dy<ballRadius) dy = -dy;
            else if (y+dy>canvas.height-ballRadius) {
                if (x>paddleX && x<paddleX+paddleWidth) dy = -dy;
                else document.location.reload();
            }
            if (rightPressed && paddleX<canvas.width-paddleWidth) paddleX += 7;
            else if (leftPressed && paddleX>0) paddleX -= 7;
            x += dx;
            y += dy;
            if (nbBricks===0) {
                level++;
                document.getElementById("level").innerText = "Level: "+level;
                dx = Math.sign(dx)*Math.log2(level+1);
                dy = Math.sign(dy)*Math.log2(level+1);
                initBricks();
            }
        }
        requestAnimationFrame(draw);
    }

    function initDraw() {
        initBricks();
        draw();
        isPaused = true;
        document.getElementById("pause-button").innerHTML = '<img src="img/play.png" alt="Play">';
    }

    initDraw();

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    /* canvas.addEventListener("mousemove", mouseMoveHandler, false);
    canvas.addEventListener("mousedown", (e) => { mousePressed = true; });
    canvas.addEventListener("mouseup", (e) => { mousePressed = false; }); */

    document.getElementById("pause-button").addEventListener("click", togglePause);
    document.addEventListener("keydown", function(event) {
        if (event.code==="Space") {
            togglePause();
            event.preventDefault();
        }
    });
});
