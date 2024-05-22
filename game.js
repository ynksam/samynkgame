const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let balls = [];
let score = 0;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

const ballSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#ff0000"/>
</svg>`;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let isDragging = false;
let lastX, lastY;

class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.image = new Image();
        this.image.src = 'data:image/svg+xml;base64,' + btoa(ballSVG);
    }

    draw() {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update() {
        this.y += this.speed;
        if (this.y - this.radius > canvasHeight) {
            this.y = -this.radius;
            this.x = Math.random() * canvasWidth;
        }
    }
}

function spawnBall() {
    const radius = Math.random() * 30 + 10;
    const x = Math.random() * (canvasWidth - radius * 2) + radius;
    const y = Math.random() * -canvasHeight;
    const speed = Math.random() * 3 + 2;
    balls.push(new Ball(x, y, radius, speed));
}

function init() {
    for (let i = 0; i < 10; i++) {
        spawnBall();
    }
}

function update() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

function checkCollision(x1, y1, x2, y2, r) {
    return Math.hypot(x2 - x1, y2 - y1) < r;
}

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    balls.forEach((ball, index) => {
        if (checkCollision(lastX, lastY, ball.x, ball.y, ball.radius) || checkCollision(currentX, currentY, ball.x, ball.y, ball.radius)) {
            balls.splice(index, 1);
            spawnBall();
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
        }
    });

    lastX = currentX;
    lastY = currentY;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

init();
gameLoop();
