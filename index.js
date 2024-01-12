const svg = document.querySelector('#svg')
const copier = document.querySelector('#copier')
const input = document.querySelector('#input')

let size = 4;

function drawPart(id, x, y) {
    if (id & 0b1000) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${size*x},${size*y}l${size},0`);
        svg.appendChild(path);
    }

    if (id & 0b0100) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${size*(x+1)},${size*y}l0,${size}`);
        svg.appendChild(path);
    }

    if (id & 0b0010) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${size*x},${size*y}l0,${size}`);
        svg.appendChild(path);
    }

    if (id & 0b0001) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${size*x},${size*(y+1)}l${size},0`);
        svg.appendChild(path);
    }
}

function draw(letter) {
    let charCode = letter.charCodeAt(0);
    svg.innerHTML = '';

    let path;

    path = document.createElement('path');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', `M${size},${size}l${size},${size}`);
    svg.appendChild(path);

    path = document.createElement('path');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', `M${2*size},${size}l${-size},${size}`);
    svg.appendChild(path);

    part = drawPart((charCode >> 12) & 0xff, 1, 0);
    part = drawPart((charCode >> 8) & 0xff, 2, 1);
    part = drawPart((charCode >> 4) & 0xff, 0, 1);
    part = drawPart((charCode >> 0) & 0xff, 1, 2);
}

function copy() {
    navigator.clipboard.writeText(copier.innerHTML);
}

function action() {
    draw(input.value);
    copy();

    input.value = input.value.substring(1);
}
