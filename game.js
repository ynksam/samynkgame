document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    // Basit bir oyun döngüsü örneği
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let dx = 2;
    let dy = 2;

    function drawBall() {
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    function update() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        x += dx;
        y += dy;

        if (x + dx > canvas.width - 10 || x + dx < 10) {
            dx = -dx;
        }
        if (y + dy > canvas.height - 10 || y + dy < 10) {
            dy = -dy;
        }
    }

    setInterval(update, 10);
});
