let graph = [];
let startingNode;
let endNode;

// creates the grid, runs when html body loads
function createGrid() {
    let grid = document.getElementById("grid");
    const w = grid.offsetWidth;
    const h = grid.offsetHeight;
    // every auto is another column in grid
    for (let i = 0; i < w / 10; i++) {
        grid.style.gridTemplateColumns += " auto";
    }
    // create (w/10 * h/10) squares
    for (let i = 0; i < h / 10; i++) {
        graph[i] = [];
        for (let j = 0; j < w / 10; j++) {
            // add this node to graph
            graph[i][j] = {
                visited: false,
                cameFrom: null,
                usable: true
            };
            // create a square in grid and set its attributes
            var square = document.createElement("div");
            square.id = i.toString() + " " + j.toString();
            square.classList.add("grid-item");
            grid.appendChild(square);
            // add event listener for selecting obstacle node with right click
            square.addEventListener('mousemove', selectObstacle, false);
            square.addEventListener("mousedown", selectObstacle);
            square.addEventListener("contextmenu", (ev) => ev.preventDefault()); // prevent context menu pop up when right clicked
            // add click event listener for selecting starting node
            square.addEventListener("click", selectStartingNode);
        }
    }
}

// BFS search alghritm
async function bfs() {
    let distances = []; // distance of all nodes from the starting node
    // set all node's distance from starting node as a large value
    for (let i = 0; i < graph.length; i++) {
        distances.push([]);
        for (let j = 0; j < graph[0].length; j++) {
            distances[i].push(100000000);
        }
    }
    // starting node distance is zero
    distances[startingNode.split(" ")[0]][startingNode.split(" ")[1]] = 0;
    // start bfs search
    let queue = new Queue();
    queue.push(startingNode);
    let count = 0;
    let found = false;
    while (queue.length != 0) {
        // wait for 1 ms every 10 loop so that algorithm can be demonstrated
        if (count % 10 == 0) {
            await new Promise(r => setTimeout(r, 1));
        }
        let currentNode = queue.shift();
        if (currentNode == endNode) {
            found = true;
            document.getElementById("instruction").innerText = "Found";
            break;
        }
        let row = currentNode.split(" ")[0];
        let col = currentNode.split(" ")[1];
        if (currentNode != startingNode) {
            document.getElementById(currentNode).style.backgroundColor = "purple";
        }

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (j != 0 && i != 0) continue; // don't search diagonal nodes
                let x = parseInt(row) + i;
                let y = parseInt(col) + j;
                if (x >= 0 && y >= 0 && x < graph.length && y < graph[x].length) {
                    let next = graph[x][y];
                    if (next.usable && !next.visited) {
                        next.cameFrom = currentNode;
                        distances[x][y] = distances[x - i][y - j] + 1;
                        next.visited = true;
                        queue.push(x + " " + y);
                    }
                }
            }
        }
        count++;
    }
    if (found) {
        let distance = distances[endNode.split(" ")[0]][endNode.split(" ")[1]];
        let currentNode = endNode;
        for (let i = 0; i < distance; i++) {
            document.getElementById(currentNode).style.backgroundColor = "yellow";
            currentNode = graph[currentNode.split(" ")[0]][currentNode.split(" ")[1]].cameFrom;
        }
    } else {
        document.getElementById("instruction").innerText = "No path";
    }
}

async function dfs() {
    let queue = [];
    queue.push(startingNode);
    let count = 0;
    let found = false;
    while (queue.length != 0) {
        if (count % 10 == 0) {
            await new Promise(r => setTimeout(r, 1));
        }
        let currentNode = queue.pop();
        if (currentNode == endNode) {
            found = true;
            document.getElementById("instruction").innerText = "Found";
            return;
        }
        let row = currentNode.split(" ")[0];
        let col = currentNode.split(" ")[1];
        if (currentNode != startingNode) {
            document.getElementById(currentNode).style.backgroundColor = "purple";
        }
        let currentNodeObject = graph[row][col];
        currentNodeObject.visited = true;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let x = parseInt(row) + i;
                let y = parseInt(col) + j;
                if (x >= 0 && y >= 0 && x < graph.length && y < graph[x].length) {
                    let next = graph[x][y];
                    if (next.usable && !next.visited) {
                        next.cameFrom = currentNode;
                        queue.push(x + " " + y);
                    }
                }
            }
        }
        count++;
    }
    document.getElementById("instruction").innerText = "No path";
}

async function dijk() {

}

// event listener function for selecting starting node
function selectStartingNode() {
    let coordinates = this.id.split(" ");
    let clickedSquare = graph[coordinates[0]][coordinates[1]]; // copies by reference because it is an object
    if (clickedSquare.usable) {
        this.style.backgroundColor = "green";
        startingNode = this.id;
        let squares = document.getElementsByClassName("grid-item");
        document.getElementById("instruction").innerText = "Select end node";
        for (let i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", selectStartingNode);
            squares[i].addEventListener("click", selectEndNode);
        }
    }
}

// event listener function for selecting end node
function selectEndNode() {
    let coordinates = this.id.split(" ");
    let clickedSquare = graph[coordinates[0]][coordinates[1]]; // copies by reference because it is an object
    if (clickedSquare.usable) {
        this.style.backgroundColor = "red";
        endNode = this.id;
        let squares = document.getElementsByClassName("grid-item");
        document.getElementById("instruction").innerText = "Algorithm is running";
        for (let i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", selectEndNode);
        }
        if (document.getElementById("bfs").checked) {
            bfs();
        } else if (document.getElementById("dfs").checked) {
            dfs();
        } else {
            dijk();
        }
    }
}

function selectObstacle(ev) {
    ev.preventDefault();
    var rightclick;
    var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    let coordinates = this.id.split(" ");
    let clickedSquare = graph[coordinates[0]][coordinates[1]]; // copies by reference because it is an object
    if (clickedSquare.usable && rightclick) {
        this.style.backgroundColor = "black";
        clickedSquare.usable = false;
    }
    return false;
}