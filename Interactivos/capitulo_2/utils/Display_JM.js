let points = [];
let convexHull = [];
let currPoint = null;
let prevVertex = null;

let take_step = false;
let completed = false;
let button;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 30;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeButton();
}

function initializePoints(num_of_points) {
  startingP = createVector(WINDOW_BORDER, WINDOW_BORDER);
  endingP = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  points = getRandomPointsInArea(num_of_points, startingP, endingP);
}

function initializeButton() {
  button = createButton("Siguiente");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
}

async function step() {
  // initialize alg
  if (points.length == 0) {
    initializePoints(15);
  }
  // alg steps
  if (!completed) {
    // add first point
    if (convexHull.length == 0) {
      let minYPoint = points[0];
      for (let point of points) {
        if (
          point.y > minYPoint.y ||
          (point.y == minYPoint.y && point.x > minYPoint.x)
        ) {
          minYPoint = point;
        }
      }
      convexHull.push(minYPoint);
    }
    // add the next corresponding point to the convex hull
    else {
      prevVertex = convexHull[convexHull.length - 1];
      let rightmostVertex = null;
      for (let point of points) {
        currPoint = point
        await sleep(50)
        if (point == prevVertex) continue;
        // Take any point diferent to last vertex on hull
        // as rightmost
        if (rightmostVertex == null) {
          rightmostVertex = point;
          continue;
        }

        let td = turnDirection(prevVertex, rightmostVertex, point);
        let isColinear = td == 0;
        let isLeftTurn = td == 1;
        let pointIsFarder =
          distance(prevVertex, rightmostVertex) < distance(prevVertex, point);
        // If there's a point more to the right or colinear but farder
        // that will be our new rightmost
        if ((isColinear && pointIsFarder) || isLeftTurn) {
          rightmostVertex = point;
        }
      }

      // If we reach the start it's time to finish
      if (rightmostVertex == convexHull[0]) {
        completed = true;
        currPoint = null;
        prevVertex = null;
      }
      // It not, add rightmost vertex to hull and take it as the new
      // vertex to compare with
      else {
        convexHull.push(rightmostVertex);
        prevVertex = rightmostVertex;
        currPoint = null;
        prevVertex = null;
      }
    }
  }
  // reset alg
  else {
    completed = false;
    convexHull = [];
    points = [];
  }
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(0);
  drawArrows(convexHull, completed);
  drawPoints(points, 256);
  drawPoints(convexHull, "blue");
  if( currPoint != null){
    drawArrow(prevVertex, currPoint, "white");
  }
}
