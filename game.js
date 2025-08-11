const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PADDLE_MARGIN = 16;
const PLAYER_COLOR = "#4caf50";
const AI_COLOR = "#e91e63";
const BALL_COLOR = "#ffc107";
const NET_COLOR = "#fff";
const NET_WIDTH = 4;
const NET_DASH = 24;
const FPS = 60;

// Paddle objects
const player = {
    x: PADDLE_MARGIN,
    y: canvas.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PLAYER_COLOR,
    dy: 0
};

const ai = {
    x: canvas.width - PADDLE_WIDTH - PADDLE_MARGIN,
    y: canvas.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: AI_COLOR,
    dy: 0,
    speed: 5
};

// Ball object
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: BALL_RADIUS,
    speed: 6,
    dx: 6,
    dy: 3
};

// Draw net
function drawNet() {
    ctx.fillStyle = NET_COLOR;
    for(let y = 0; y < canvas.height; y += NET_DASH * 2) {
        ctx.fillRect(canvas.width/2 - NET_WIDTH/2, y, NET_WIDTH, NET_DASH);
    }
}

// Draw a paddle
function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = BALL_COLOR;
    ctx.fill();
    ctx.closePath();
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    // Randomize direction
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    // Randomize dy
    ball.dy = (Math.random() - 0.5) * 2 * ball.speed * 0.7;
}

// Detect collision with paddle
function collide(paddle) {
    return (
        ball.x + ball.radius > paddle.x &&
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    );
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if(ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy = -ball.dy;
    }
    if(ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -ball.dy;
    }

    // Ball collision with player paddle
    if(collide(player)) {
        ball.x = player.x + player.width + ball.radius;
        ball.dx = -ball.dx;
        // Add some spin based on paddle movement
        let paddleCenter = player.y + player.height / 2;
        ball.dy += (ball.y - paddleCenter) * 0.15;
    }

    // Ball collision with AI paddle
    if(collide(ai)) {
        ball.x = ai.x - ball.radius;
        ball.dx = -ball.dx;
        // Add some spin based on paddle movement
        let paddleCenter = ai.y + ai.height / 2;
        ball.dy += (ball.y - paddleCenter) * 0.15;
    }

    // Ball out of bounds (left or right)
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }

    // AI movement (simple tracking)
    let aiCenter = ai.y + ai.height/2;
    if(ball.y < aiCenter - 15) {
        ai.y -= ai.speed;
    } else if(ball.y > aiCenter + 15) {
        ai.y += ai.speed;
    }
    // Clamp AI paddle within canvas
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Mouse movement controls for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp paddle within canvas
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawPaddle(player);
    drawPaddle(ai);
    drawBall();
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start the game
resetBall();
loop();