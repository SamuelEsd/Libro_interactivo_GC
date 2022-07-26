let left_pointsSet = [];
let right_pointsSet = [];

let left_convexHull = [];
let right_convexHull = [];

let half_point = null
let touched = false
let selectedPoint = -1

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 30;
  half_point = Math.ceil((CUSTOM_WIDTH)/2)

  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializePoints(10);
}

function initializePoints(num_of_points) {
  startingP_left = createVector(WINDOW_BORDER, WINDOW_BORDER);
  endingP_left = createVector(
    half_point-20,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  startingP_right = createVector(half_point+20, WINDOW_BORDER);
  endingP_right = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  left_pointsSet = getRandomPointsInArea(Math.floor(num_of_points/2), startingP_left, endingP_left);
  right_pointsSet = getRandomPointsInArea(Math.ceil(num_of_points/2), startingP_right, endingP_right);
}

async function step() {
  // Initialize points set
  if (pointsSet.length == 0) {
    computeCHs();
    description.html("Generamos un conjunto de puntos aleatorio.")
  }
  // Steps of the Graham scan algorithm
  else if (!completed) {
    // add first point
    if (convexHull.length == 0) {
      let minYPoint = pointsSet[0];
      for (let point of pointsSet) {
        if (
          point.y > minYPoint.y ||
          (point.y == minYPoint.y && point.x > minYPoint.x)
        ) {
          minYPoint = point;
        }
      }
      convexHull.push(minYPoint);
      description.html("Agregamos el punto inferior al conjunto de salida.")
    }
    // add the next corresponding point to the convex hull
    else {
      prevVertex = convexHull[convexHull.length - 1];
      let rightmostVertex = null;
      for (let point of pointsSet) {
        currPoint = point
        await sleep(50)
        if (point == prevVertex) continue;
        // Take any point different to last vertex on hull
        // as rightmost
        if (rightmostVertex == null) {
          rightmostVertex = point;
          continue;
        }

        let td = turnDirection(prevVertex, rightmostVertex, point);
        let isColinear = td == 0;
        let isLeftTurn = td == 1;
        let pointIsFarther =
          distance(prevVertex, rightmostVertex) < distance(prevVertex, point);
        // If there's a point more to the right or colinear but farther
        // that will be our new rightmost
        if ((isColinear && pointIsFarther) || isLeftTurn) {
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
    pointsSet = [];
    description.html('Para iniciar la visualización presione el botón iniciar.')
  }
}

function addIds(points){
  for (i = 0; i < points.length; i++) {
    points[i].z = i+1
  }

}
function computeCHs(){
  left_convexHull = convexHullJM(left_pointsSet);
  addIds(left_convexHull);
  right_convexHull = convexHullJM(right_pointsSet);
  addIds(right_convexHull);
}
function drawCHs(){
  drawLines(left_convexHull,'green');
  drawLines(right_convexHull,'green');

  drawPoints(left_pointsSet, "blue");
  drawPoints(right_pointsSet, "blue");
}

function drawMiddleLine(){
  push();
  stroke('red');
  strokeWeight(3);
  line(half_point, WINDOW_BORDER, half_point, CUSTOM_HEIGHT - WINDOW_BORDER);
  pop();
}

function drawLinesOfTwoCH(){

}

function draw() {  


  background(0);

  drawCHs();
  drawMiddleLine();

}