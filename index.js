const size = 4;
const padding = 2;
let delta = 0;
let offset = size * 3 + padding;

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

function indexOfEdge(edges, other) {
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];

        if (
            edge[0] === other[0]
            && edge[1] === other[1]
            && edge[0] + edge[2] === other[0] + other[2]
            && edge[1] + edge[3] === other[1] + other[3]
        ) {
            return i;
        }

        if (
            edge[0] === other[0] + other[2]
            && edge[1] === other[1] + other[3]
            && edge[0] + edge[2] === other[0]
            && edge[1] + edge[3] === other[1]
        ) {
            return i;
        }
    }

    return -1;
}

function isMass(edges, point) {
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];

        if (edge[0] === point[0] && edge[1] === point[1]) {
            return [i, 1];
        }

        if (edge[0] + edge[2] === point[0] && edge[1] + edge[3] === point[1]) {
            return [i, 2];
        }
    }

    return [-1, 0];
}

function equalPoint(point1, point2) {
    return point1[0] === point2[0] && point1[1] == point2[1];
}

function isConnected(edges, point1, point2, beens) {
    if (equalPoint(point1, point2)) {
        return true;
    }

    if (beens === undefined) {
        beens = [];
    }

    // check been
    for (let i = 0; i < beens.length; i++) {
        if (equalPoint(beens[i], point1)) {
            return false;
        }
    }

    // dfs
    beens.push(point1);
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];

        let start = [edge[0], edge[1]];
        let end = [edge[0] + edge[2], edge[1] + edge[3]];

        if (
            equalPoint(point1, start)
            && isConnected(edges, end, point2, beens)
        ) {
            return true;
        }

        if (
            equalPoint(point1, end)
            && isConnected(edges, start, point2, beens)
        ) {
            return true;
        }
    }

    return false;
}

function removeNode(edges, node) {
    let index = indexOfEdge(edges, node);

    if (index === -1) {
        return edges;
    }

    edges.splice(index, 1);
    return edges;
}

function draw(letter) {
    let charCode = letter.charCodeAt(0);

    let path;

    // -- lines
    let edges = [];

    drawPart(edges, (charCode >> 12) & 0xff, 1, 0);
    drawPart(edges, (charCode >> 8) & 0xff, 2, 1);
    drawPart(edges, (charCode >> 4) & 0xff, 0, 1);
    drawPart(edges, (charCode >> 0) & 0xff, 1, 2);

    // -- x
    let exes = [];
    // - 1. connect masses
    let ul = [delta + size, size, size*0.5, size*0.5];
    let dr = [delta + 1.5*size, 1.5*size, size*0.5, size*0.5];
    if (
        isMass(edges, [delta + size, size])[0] !== -1
        && isMass(edges, [delta + 2*size, 2*size])[0] !== -1
    ) {
        exes.push(ul);
        exes.push(dr);
    }
    let ur = [delta + 2*size, size, -size*0.5, size*0.5]
    let dl = [delta + 1.5*size, 1.5*size, -size*0.5, size*0.5];
    if (
        isMass(edges, [delta + 2*size, size])[0] !== -1
        && isMass(edges, [delta + size, 2*size])[0] !== -1
    ) {
        exes.push(ur);
        exes.push(dl);
    }

    // - 2. remove cycle by diagonals
    if (isConnected(edges, [delta + size, size], [delta + 2*size, 2*size])) {
        exes = removeNode(exes, ul);
        exes = removeNode(exes, dr);
    }
    if (isConnected(edges, [delta + size, 2*size], [delta + 2*size, size])) {
        exes = removeNode(exes, ur);
        exes = removeNode(exes, dl);
    }

    // - 3. remove small triangles
    // u
    if (
        indexOfEdge(edges, [delta + size, size, size, 0]) !== -1
        && indexOfEdge(exes, ul) !== -1
        && indexOfEdge(exes, ur) !== -1
    ) {
        exes = removeNode(exes, ul);
    }
    // l
    if (
        indexOfEdge(edges, [delta + size, size, 0, size]) !== -1
        && indexOfEdge(exes, ul) !== -1
        && indexOfEdge(exes, dl) !== -1
    ) {
        exes = removeNode(exes, ul);
    }
    // d
    if (
        indexOfEdge(edges, [delta + 2*size, 2*size, -size, 0]) !== -1
        && indexOfEdge(exes, dl) !== -1
        && indexOfEdge(exes, dr) !== -1
    ) {
        exes = removeNode(exes, dr);
    }
    // r
    if (
        indexOfEdge(edges, [delta + 2*size, 2*size, 0, -size]) !== -1
        && indexOfEdge(exes, ur) !== -1
        && indexOfEdge(exes, dr) !== -1
    ) {
        exes = removeNode(exes, dr);
    }

    // - 4. add exes to the edges
    for (let i = 0; i < exes.length; i++) {
        edges.push(exes[i]);
    }

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

    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (let i = 0; i < edges.length; i++) {
        let x1 = edges[i][0];
        let y1 = edges[i][1];
        let x2 = edges[i][2];
        let y2 = edges[i][3];

        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M${x1},${y1}l${x2},${y2}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#000');
        g.appendChild(path);
    }
    svg.appendChild(g);

    delta += offset;
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
