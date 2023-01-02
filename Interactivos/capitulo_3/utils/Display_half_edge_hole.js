let dcel = new DCEL();
let touched = false;
let selectedPoint = 0;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 30;

  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializePoints(15);
}

function initializePoints(num_of_points) {
  startingP = createVector(WINDOW_BORDER, WINDOW_BORDER);
  endingP = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  console.log("initialize");
  let vertices = getVerticesForDCEL_hole(startingP, endingP);
  let halfEdges = getEdgesForDCEL_hole(vertices);
  dcel = new DCEL(vertices, halfEdges);
}

function mouseClicked() {
  let points = dcel.getVertices();
  console.log(points);
  for (let [i, i_vertex] of points) {
    let mouseVector = createVector(mouseX, mouseY);
    let i_vector = createVector(i_vertex.getX(), i_vertex.getY());
    if (distance(i_vector, mouseVector) < POINT_SIZE / 2) {
      selectedPoint = i;
      dcel.setActiveVertex(i);
      return;
    }
  }
}

function draw() {
  background(255);
  console.log(selectedPoint);
  dcel.drawPoints("green", "red", POINT_SIZE / 2);
  dcel.drawHalfEdges("black", "blue", POINT_SIZE / 2);
}
