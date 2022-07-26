let pointsSet = null;
let convexHull = [];
let currPoint = null;
let prevVertex = null;
let num_of_points = 10;


let take_step = false;
let completed = false;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 10;
  CUSTOM_HEIGHT = windowHeight - 230;
  description = createElement('h3', 'Para iniciar la visualización presione el botón iniciar.');
  inputDescription = createElement('h4', 'S: ');
  outputDescription = createElement('h4', 'conv(S): ');
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeButton();
}

function initializePoints() {
  startingP = createVector(WINDOW_BORDER, WINDOW_BORDER);
  endingP = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  pointsSet = new PointSet(getRandomPointsInArea(num_of_points, startingP, endingP));
}

function initializeButton() {
  button = createButton("Siguiente");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
}

async function step() {
  // Initialize points set
  if (pointsSet === null) {
    initializePoints();
    description.html("Generamos un conjunto de puntos aleatorio.")
  }
  // Steps of the Graham scan algorithm
  else if (!completed) {
    // add first point
    if (convexHull.length == 0) {
      convexHull.push(pointsSet.getLowestPoint());
      description.html("Agregamos el punto inferior al conjunto de salida.")
    }
    // add the next corresponding point to the convex hull
    else {
      prevVertex = convexHull[convexHull.length - 1];
      let rightmostVertex = null;
      for (let point of pointsSet.points) {
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
    pointsSet = null;
    description.html('Para iniciar la visualización presione el botón iniciar.')
  }
  
  inputDescription.html('S: ' + pointsSet);
  //outputDescription.html('conv(S): ' + pointsToString(convexHull));
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(230);
  // Convex hull arrows
  drawArrows(convexHull, completed,"green");
  if (pointsSet != null) {
    pointsSet.drawPoints(256);
  }

  //drawPoints(convexHull, "blue");
  if( currPoint != null){
    drawArrow(prevVertex, currPoint, "red");
  }
}
