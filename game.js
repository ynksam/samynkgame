const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let balls = [];
let score = 0;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

const ballImage = new Image();
ballImage.src = 'ball.png'; // PNG dosyasının adını buraya yazın

canvas.width = canvasWidth;
canvas.height = canvasHeight;

class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
    }

    draw() {
        ctx.drawImage(ballImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update() {
        this.y += this.speed;
        if (this.y - this.radius > canvasHeight) {
            this.y = -this.radius;
            this.x = Math.random() * canvasWidth;
        }
    }

    intersectsLine(x1, y1, x2, y2) {
        const dist = Math.abs((y2 - y1) * this.x - (x2 - x1) * this.y + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
        return dist < this.radius;
    }
}

function spawnBall() {
    const radius = Math.random() * 40 + 10;
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

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    balls.forEach((ball, index) => {
        if (ball.intersectsLine(lastX, lastY, x, y)) {
            balls.splice(index, 1);
            spawnBall();
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
        }
    });

    lastX = x;
    lastY = y;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

ballImage.onload = () => {
    init();
    gameLoop();
};
