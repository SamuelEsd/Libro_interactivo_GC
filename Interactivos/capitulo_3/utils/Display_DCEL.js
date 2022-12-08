let dcel = new DCEL();
let touched = false;
let selectedPoint = -1;

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
  let vertices = getVerticesForDCEL(startingP, endingP);
  let halfEdges = getEdgesForDCEL(vertices);
  console.log(halfEdges);
  dcel = new DCEL(vertices, halfEdges);
}

function touchMoved() {
  touched = true;
  for (i = 0; i < pointSet.points.length; i++) {
    mouseVector = createVector(mouseX, mouseY);
    if (touched && selectedPoint == -1) {
      if (distance(pointSet.points[i], mouseVector) < POINT_SIZE) {
        selectedPoint = i;
        return;
      }
    }
  }
}

function touchEnded() {
  touched = false;
  selectedPoint = -1;
}

function draw() {
  background(0);
  dcel.drawPoints("green", POINT_SIZE / 2);
  dcel.drawHalfEdges("green", POINT_SIZE / 2);
}
