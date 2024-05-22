const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let balls = [];
let score = 0;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
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
    const radius = Math.random() * 20 + 10;
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

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    balls.forEach((ball, index) => {
        const dist = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        if (dist < ball.radius) {
            balls.splice(index, 1);
            spawnBall();
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
        }
    });
});

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

init();
gameLoop();
