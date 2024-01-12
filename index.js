const svg = document.querySelector('#svg')
const copier = document.querySelector('#copier')
const input = document.querySelector('#input')

function drawPart(id, x, y) {
    if (id & 0b1000) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${x},${y}l1,0`);
        svg.appendChild(path);
    }

    if (id & 0b0100) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${x+1},${y}l0,1`);
        svg.appendChild(path);
    }

    if (id & 0b0010) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${x},${y}l0,1`);
        svg.appendChild(path);
    }

    if (id & 0b0001) {
        let path = document.createElement('path');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('d', `M${x},${y+1}l1,0`);
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
    path.setAttribute('d', 'M1,1l1,1');
    svg.appendChild(path);

    path = document.createElement('path');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', 'M2,1l-1,1');
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
