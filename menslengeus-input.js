const context = menslengeusArea.getContext('2d');

let letter = 0x0000;

let screenSize;

function render() {
    context.fillStyle = "#f7f7f9";
    context.fillRect(0, 0, screenSize, screenSize);

    // -- draw frame for the letter
    context.lineWidth = 1;
    context.strokeStyle = "#2c2c2c";
    context.beginPath();

    context.moveTo(2*unit, unit);
    context.lineTo(2*unit, 4*unit);
    context.lineTo(3*unit, 4*unit);
    context.lineTo(3*unit, unit);
    context.lineTo(2*unit, unit);

    context.moveTo(unit, 2*unit);
    context.lineTo(4*unit, 2*unit);
    context.lineTo(4*unit, 3*unit);
    context.lineTo(unit, 3*unit);
    context.lineTo(unit, 2*unit);

    context.stroke();

    // -- draw letter
    context.strokeStyle = "#19191e";
    context.lineWidth = 20;
    context.lineCap = 'round';
    context.beginPath();

    if (letter & 0x8000) {
        context.moveTo(2*unit, 1*unit);
        context.lineTo(3*unit, 1*unit);
    }
    if (letter & 0x4000) {
        context.moveTo(3*unit, 1*unit);
        context.lineTo(3*unit, 2*unit);
    }
    if (letter & 0x2000) {
        context.moveTo(2*unit, 1*unit);
        context.lineTo(2*unit, 2*unit);
    }
    if (letter & 0x1000) {
        context.moveTo(2*unit, 2*unit);
        context.lineTo(3*unit, 2*unit);
    }

    if (letter & 0x0800) {
        context.moveTo(3*unit, 2*unit);
        context.lineTo(4*unit, 2*unit);
    }
    if (letter & 0x0400) {
        context.moveTo(4*unit, 2*unit);
        context.lineTo(4*unit, 3*unit);
    }
    if (letter & 0x0200) {
        context.moveTo(3*unit, 2*unit);
        context.lineTo(3*unit, 3*unit);
    }
    if (letter & 0x0100) {
        context.moveTo(3*unit, 3*unit);
        context.lineTo(4*unit, 3*unit);
    }

    if (letter & 0x0080) {
        context.moveTo(1*unit, 2*unit);
        context.lineTo(2*unit, 2*unit);
    }
    if (letter & 0x0040) {
        context.moveTo(2*unit, 2*unit);
        context.lineTo(2*unit, 3*unit);
    }
    if (letter & 0x0020) {
        context.moveTo(1*unit, 2*unit);
        context.lineTo(1*unit, 3*unit);
    }
    if (letter & 0x0010) {
        context.moveTo(1*unit, 3*unit);
        context.lineTo(2*unit, 3*unit);
    }

    if (letter & 0x0008) {
        context.moveTo(2*unit, 3*unit);
        context.lineTo(3*unit, 3*unit);
    }
    if (letter & 0x0004) {
        context.moveTo(3*unit, 3*unit);
        context.lineTo(3*unit, 4*unit);
    }
    if (letter & 0x0002) {
        context.moveTo(2*unit, 3*unit);
        context.lineTo(2*unit, 4*unit);
    }
    if (letter & 0x0001) {
        context.moveTo(2*unit, 4*unit);
        context.lineTo(3*unit, 4*unit);
    }

    context.stroke();
}

setInterval(() => {
    render();
}, 1000 / 30);

menslengeusArea.width = 250 * window.devicePixelRatio;
menslengeusArea.height = 250 * window.devicePixelRatio;
screenSize = 250 * window.devicePixelRatio;

window.addEventListener('resize', () => {
    menslengeusArea.width = 250 * window.devicePixelRatio;
    menslengeusArea.height = 250 * window.devicePixelRatio;
    screenSize = 250 * window.devicePixelRatio;
});

let mouseX;
let mouseY;

menslengeusArea.addEventListener('mousemove', e => {
    mouseX = e.offsetX * window.devicePixelRatio;
    mouseY = e.offsetY * window.devicePixelRatio;
});

const unit = screenSize / 5;
const areas = [
    [2.5*unit, 1.0*unit, 0x8000],
    [3.0*unit, 1.5*unit, 0x4000],
    [2.0*unit, 1.5*unit, 0x2000],
    [2.5*unit, 2.0*unit, 0x1000],
    [3.5*unit, 2.0*unit, 0x0800],
    [4.0*unit, 2.5*unit, 0x0400],
    [3.0*unit, 2.5*unit, 0x0200],
    [3.5*unit, 3.0*unit, 0x0100],
    [1.5*unit, 2.0*unit, 0x0080],
    [2.0*unit, 2.5*unit, 0x0040],
    [1.0*unit, 2.5*unit, 0x0020],
    [1.5*unit, 3.0*unit, 0x0010],
    [2.5*unit, 3.0*unit, 0x0008],
    [3.0*unit, 3.5*unit, 0x0004],
    [2.0*unit, 3.5*unit, 0x0002],
    [2.5*unit, 4.0*unit, 0x0001],
];
menslengeusArea.addEventListener('mouseup', e => {
    let closest;
    let closestDistance = Infinity;
    for (let i = 0; i < areas.length; i++) {
        let distance = Math.hypot(areas[i][0] - mouseX, areas[i][1] - mouseY);

        if (distance <= closestDistance) {
            closest = i;
            closestDistance = distance;
        }
    }

    letter ^= areas[closest][2];
});

function insertMenslengeus() {
    input.value = input.value + String.fromCharCode(letter);
    letter = 0;
}
