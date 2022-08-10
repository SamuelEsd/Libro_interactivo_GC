let left_pointsSet = new PointSet([]);
let right_pointsSet = new PointSet([]);

let left_convexHull = new PointSet([]);
let right_convexHull = new PointSet([]);

let num_of_points = 10;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 30;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);

  initializeCorners();
  left_pointsSet = new PointSet(getRandomPointsInArea(Math.floor(num_of_points/2), UP_LEFT_CORNER, DOWN_MIDDLE_CORNER));
  right_pointsSet = new PointSet(getRandomPointsInArea(Math.ceil(num_of_points/2), UP_MIDDLE_CORNER, DOWN_RIGHT_CORNER));
  
  left_convexHull = new PointSet(convexHullJM(left_pointsSet.points));
  right_convexHull = new PointSet(convexHullJM(right_pointsSet.points));
}

async function step() {
  // Initialize points set
  if (pointsSet.length == 0) {
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



function drawCHs(){
  left_convexHull.drawLinesBetweenPoints(true,"green");
  right_convexHull.drawLinesBetweenPoints(true,"green");

  left_pointsSet.drawPoints("blue");
  right_pointsSet.drawPoints("blue");
}

function drawMiddleLine(){
  push();
  stroke('red');
  strokeWeight(2);
  line(MIDDLE_WIDTH, WINDOW_BORDER, MIDDLE_WIDTH, CUSTOM_HEIGHT - WINDOW_BORDER);
  pop();
}

function drawLinesOfTwoCH(){

}

function draw() {
  background(0);

  drawCHs();
  drawMiddleLine();

}