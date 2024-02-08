const context = menslengeusArea.getContext('2d');

let letter = 0x0000;

let mouseX;
let mouseY;
let mouseButtonDown = false;

function getClosestPoint() {
    let closest = 0;
    let closestDistance = Infinity;
    for (let i = 0; i < points.length; i++) {
        let distance = Math.hypot(
            mouseX - points[i][0],
            mouseY - points[i][1]
        );

        if (distance < closestDistance) {
            closest = i;
            closestDistance = distance;
        }
    }

    return closest;
}

let closest;
let previousClosest;
const nodes = [
    [0, 1, 0x8000],
    [1, 4, 0x4000],
    [0, 3, 0x2000],
    [3, 4, 0x1000],

    [4, 5, 0x0800],
    [5, 9, 0x0400],
    [4, 8, 0x0200],
    [8, 9, 0x0100],

    [2, 3, 0x0080],
    [3, 7, 0x0040],
    [2, 6, 0x0020],
    [6, 7, 0x0010],

    [7, 8, 0x0008],
    [8, 11, 0x0004],
    [7, 10, 0x0002],
    [10, 11, 0x0001],
];
function tick() {
    closest = getClosestPoint();

    // connect
    if (previousClosest !== closest && mouseButtonDown) {
        let [a, b] = [previousClosest, closest];
        if (a > b) {
            [a, b] = [b, a];
        }

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i][0] === a && nodes[i][1] === b) {
                letter ^= nodes[i][2];
            }
        }
    }

    previousClosest = closest;
}

function render() {
    context.fillStyle = "#f7f7f9";
    context.fillRect(0, 0, screenSize, screenSize);

    // -- draw frame for the letter
    context.lineWidth = 1 * window.devicePixelRatio;
    context.strokeStyle = "#bbbbbb";
    context.beginPath();

    for (let i = 0; i < nodes.length; i++) {
        context.moveTo(points[nodes[i][0]][0], points[nodes[i][0]][1]);
        context.lineTo(points[nodes[i][1]][0], points[nodes[i][1]][1]);
    }

    context.moveTo(mouseX, mouseY);
    context.lineTo(points[closest][0], points[closest][1]);

    context.stroke();

    // -- draw letter
    context.strokeStyle = "#19191e";
    context.lineWidth = 8 * window.devicePixelRatio;
    context.lineCap = 'round';
    context.beginPath();

    for (let i = 0; i < nodes.length; i++) {
        if (letter & nodes[i][2]) {
            context.moveTo(points[nodes[i][0]][0], points[nodes[i][0]][1]);
            context.lineTo(points[nodes[i][1]][0], points[nodes[i][1]][1]);
        }
    }

    context.stroke();

    // draw now cursor
    context.beginPath();
    context.arc(points[closest][0], points[closest][1], context.lineWidth * 2, 0, Math.PI * 2);
    context.stroke();
}

setInterval(() => {
    tick();
    render();
}, 1000 / 30);

menslengeusArea.width = 250 * window.devicePixelRatio;
menslengeusArea.height = 250 * window.devicePixelRatio;
let screenSize = 250 * window.devicePixelRatio;
let unit = screenSize / 5;
let points = [
                      [unit*2, unit*1], [unit*3, unit*1],
    [unit*1, unit*2], [unit*2, unit*2], [unit*3, unit*2], [unit*4, unit*2],
    [unit*1, unit*3], [unit*2, unit*3], [unit*3, unit*3], [unit*4, unit*3],
                      [unit*2, unit*4], [unit*3, unit*4],
];


window.addEventListener('resize', () => {
    menslengeusArea.width = 250 * window.devicePixelRatio;
    menslengeusArea.height = 250 * window.devicePixelRatio;
    screenSize = 250 * window.devicePixelRatio;
    unit = screenSize / 5;
    points = [
                          [unit*2, unit*1], [unit*3, unit*1],
        [unit*1, unit*2], [unit*2, unit*2], [unit*3, unit*2], [unit*4, unit*2],
        [unit*1, unit*3], [unit*2, unit*3], [unit*3, unit*3], [unit*4, unit*3],
                          [unit*2, unit*4], [unit*3, unit*4],
    ];
});

menslengeusArea.addEventListener('mousemove', e => {
    mouseX = e.offsetX * window.devicePixelRatio;
    mouseY = e.offsetY * window.devicePixelRatio;
});

menslengeusArea.addEventListener('mousedown', e => {
    mouseButtonDown = true;
});

menslengeusArea.addEventListener('mouseup', e => {
    mouseButtonDown = false;
});

function insertMenslengeus() {
    input.value = input.value + String.fromCharCode(letter);
    letter = 0;
}
