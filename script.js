const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const DISTANCE = 10;
const RADIUS = 10;

//snake sizes

const sizes = [
    45,
    60,
    60,
    60,
    60,
    60,
    60,
    55,
    55,
    55,
    50,
    50,
    50,
    45,
    45,
    45,
    35,
    35,
    35,
    25,
    25,
    25,
    20,
    20,
    20,
    15,
    15,
    15,
    10,
    10,
    10,
    5,
    5,
    5,
    0
];

const finSize = 220;
const smallerFinSize = 100;
const upperFinSize = 100;

function lerp(start, end, t) {
    return start + (end - start) * t;
}

let mouseDown = false;

const repulsionForce = 0.1;

function applyRepulsion(p0, p1) {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < DISTANCE) {
        p0.x -= dx * repulsionForce;
        p0.y -= dy * repulsionForce;
    }
}


class Point {
    constructor(x, y, size, xSpeed = 0, ySpeed = 0, fin = false, upperFin = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.fin = fin;
        this.upperFin = upperFin;
    }

    draw(index1, index2) {
        if (this.fin && !this.upperFin) {
            const p0 = points[index1];
            const p1 = points[index2];
            ctx.beginPath();
            ctx.fillStyle = '#10FAFA'
            ctx.moveTo(p0.x, p0.y);
            ctx.quadraticCurveTo(this.x, this.y, p1.x, p1.y);
            ctx.moveTo(p1.x, p1.y);
            ctx.fill();
        } else if(this.fin && this.upperFin) {
            const p0 = points[index1];
            const p1 = points[index2];
            ctx.beginPath();
            // make the upper fin overlap the body
            ctx.fillStyle = '#10FAFA'
            ctx.moveTo(p0.x, p0.y);
            ctx.quadraticCurveTo(p0.x * 1.5, p1.y * 1.5, p1.x, p1.y);
            ctx.moveTo(p1.x, p1.y);
            ctx.fill();

        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#00AAEB';
            ctx.fill();
        }
    }
}

const fin1 = new Point(0, 0, finSize, 0, 0, true);
const fin2 = new Point(0, 0, finSize, 0, 0, true);

const smallFin1 = new Point(0, 0, smallerFinSize, 0, 0, true);
const smallFin2 = new Point(0, 0, smallerFinSize, 0, 0, true);
const upperFin = new Point(0, 0, upperFinSize, 0, 0, true, true);
const points = [];

for (let i = 0; i < sizes.length; i++) {
    const x = WIDTH / 2;
    const y = HEIGHT / 2;
    const size = sizes[i];
    const xSpeed = Math.random() * 2 - 1;
    const ySpeed = Math.random() * 2 - 1;
    points.push(new Point(x, y, size, xSpeed, ySpeed));
}

canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (!mouseDown) {
        return;
    }
    points[0].x = mouseX;
    points[0].y = mouseY;
});

canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
});

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false;
});


function update() {
    for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];

        if (!mouseDown) {
            let moveAngle = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);

            p1.x += Math.cos(moveAngle) * 0.5;
            p1.y += Math.sin(moveAngle) * 0.5;
        }

        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        p1.x = lerp(p1.x, p0.x + Math.cos(angle) * DISTANCE, 0.95);
        p1.y = lerp(p1.y, p0.y + Math.sin(angle) * DISTANCE, 0.95);

        if (p1 === points[20]) {
            fin1.x = p1.x + Math.cos(angle - Math.PI / 2) * finSize;
            fin1.y = p1.y + Math.sin(angle - Math.PI / 2) * finSize;

            fin2.x = p1.x + Math.cos(angle + Math.PI / 2) * finSize;
            fin2.y = p1.y + Math.sin(angle + Math.PI / 2) * finSize;
        }

        if (p1 === points[points.length - 1]) {
            smallFin1.x = p1.x + Math.cos(angle - Math.PI / 2) * smallerFinSize;
            smallFin1.y = p1.y + Math.sin(angle - Math.PI / 2) * smallerFinSize;

            smallFin2.x = p1.x + Math.cos(angle + Math.PI / 2) * smallerFinSize;
            smallFin2.y = p1.y + Math.sin(angle + Math.PI / 2) * smallerFinSize;
        }

        if (p1 === points[0]) {
            upperFin.x = p1.x + Math.cos(angle - Math.PI / 2) * upperFinSize;
            upperFin.y = p1.y + Math.sin(angle - Math.PI / 2) * upperFinSize;
        }
    }
}
function drawOutline() {
    ctx.beginPath();

    // Draw the left side of the fish (from head to tail)
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

        // Left side points
        const leftP0 = {
            x: p0.x + Math.cos(angle + Math.PI / 2) * p0.size,
            y: p0.y + Math.sin(angle + Math.PI / 2) * p0.size
        };

        const leftP1 = {
            x: p1.x + Math.cos(angle + Math.PI / 2) * p1.size,
            y: p1.y + Math.sin(angle + Math.PI / 2) * p1.size
        };

        if (i === 0) {
            // Start drawing from the head of the fish
            ctx.moveTo(leftP0.x, leftP0.y);
        }
        ctx.lineTo(leftP1.x, leftP1.y);
    }

    // Draw the right side of the fish (from tail back to head)
    for (let i = points.length - 1; i > 0; i--) {
        const p0 = points[i];
        const p1 = points[i - 1];

        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

        // Right side points
        const rightP0 = {
            x: p0.x + Math.cos(angle - Math.PI / 2) * p0.size,
            y: p0.y + Math.sin(angle - Math.PI / 2) * p0.size
        };

        const rightP1 = {
            x: p1.x + Math.cos(angle - Math.PI / 2) * p1.size,
            y: p1.y + Math.sin(angle - Math.PI / 2) * p1.size
        };

        ctx.lineTo(rightP0.x, rightP0.y);
    }

    ctx.fillStyle = '#00AAEB';
    ctx.closePath();
    ctx.fill();

}


function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    fin1.draw(0, 10);
    fin2.draw(0, 10);

    smallFin1.draw(points.length - 6, points.length - 3);
    smallFin2.draw(points.length - 6, points.length - 3);

    upperFin.draw(0, 10);

    drawOutline();

    for (let i = 0; i < points.length; i++) {
        points[i].draw(i, i + 1);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
