const svg = document.querySelector('#svg');
const copier = document.querySelector('#copier');
const input = document.querySelector('#input');

const size = 4;
const padding = 2;
let delta = 0;

function drawPart(id, x, y) {
    if (id & 0b1000) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${size*x + delta},${size*y}l${size},0`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000');
        svg.appendChild(path);
    }

    if (id & 0b0100) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${size*(x+1) + delta},${size*y}l0,${size}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000');
        svg.appendChild(path);
    }

    if (id & 0b0010) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${size*x + delta},${size*y}l0,${size}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000');
        svg.appendChild(path);
    }

    if (id & 0b0001) {
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${size*x + delta},${size*(y+1)}l${size},0`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000');
        svg.appendChild(path);
    }
}

function draw(letter) {
    let charCode = letter.charCodeAt(0);

    let path;

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${size + delta},${size}l${size},${size}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#000');
    svg.appendChild(path);

    path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${2*size + delta},${size}l${-size},${size}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#000');
    svg.appendChild(path);

    part = drawPart((charCode >> 12) & 0xff, 1, 0);
    part = drawPart((charCode >> 8) & 0xff, 2, 1);
    part = drawPart((charCode >> 4) & 0xff, 0, 1);
    part = drawPart((charCode >> 0) & 0xff, 1, 2);

    delta += size * 3 + padding;
}

function copy() {
    navigator.clipboard.writeText(copier.innerHTML);
}

function action() {
    draw(input.value);
    copy();

    input.value = input.value.substring(1);
}
