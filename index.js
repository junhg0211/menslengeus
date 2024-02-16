const size = 4;
const padding = 2;
let delta = 0;

function drawPart(edges, id, x, y) {
    if (id & 0b1000) {
        edges.push([size*x + delta, size*y, size, 0]);
    }

    if (id & 0b0100) {
        edges.push([size*(x+1) + delta, size*y, 0, size]);
    }

    if (id & 0b0010) {
        edges.push([size*x + delta, size*y, 0, size]);
    }

    if (id & 0b0001) {
        edges.push([size*x + delta, size*(y+1), size, 0]);
    }
}

function draw(letter) {
    let charCode = letter.charCodeAt(0);

    let path;

    // -- x
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

    // -- lines
    let edges = [];

    drawPart(edges, (charCode >> 12) & 0xff, 1, 0);
    drawPart(edges, (charCode >> 8) & 0xff, 2, 1);
    drawPart(edges, (charCode >> 4) & 0xff, 0, 1);
    drawPart(edges, (charCode >> 0) & 0xff, 1, 2);

    // join connected lines
    while (true) {
        let changed = false;
        for (let i = 0; i < edges.length; i++) {
            let x1 = edges[i][0];
            let y1 = edges[i][1];
            let x2 = x1 + edges[i][2];
            let y2 = y1 + edges[i][3];
            let direction1 = Math.atan2(y2-y1, x2-x1);

            for (let j = 0; j < edges.length; j++) {
                if (i == j) {
                    continue;
                }

                let x3 = edges[j][0];
                let y3 = edges[j][1];
                let x4 = x3 + edges[j][2];
                let y4 = y3 + edges[j][3];
                let direction2 = Math.atan2(y4-y3, x4-x3);

                let distance = Math.hypot(x2-x3, y2-y3);
                let direction_delta = direction2 - direction1;

                if (distance < 0.1 && Math.abs(direction_delta) < 0.1) {
                    if (j > i) {
                        edges.splice(j, 1);
                        edges.splice(i, 1);
                    } else {
                        edges.splice(i, 1);
                        edges.splice(j, 1);
                    }
                    edges.push([x1, y1, x4-x1, y4-y1]);
                    changed = true;
                }
            }
        }

        if (!changed) {
            break;
        }
    }

    for (let i = 0; i < edges.length; i++) {
        let x1 = edges[i][0];
        let y1 = edges[i][1];
        let x2 = edges[i][2];
        let y2 = edges[i][3];

        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${x1},${y1}l${x2},${y2}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000');
        svg.appendChild(path);
    }

    delta += size * 3 + padding;
}

function copy() {
    navigator.clipboard.writeText(copier.innerHTML);
}

function insert() {
    while (input.value !== "") {
        draw(input.value);
        input.value = input.value.substring(1);
    }
}

function empty() {
    svg.innerHTML = '';
    delta = 0;
}
