let pointsSet = new PointSet([]);
let convexHull = new PointSet([]);
let currPoint = null;
let prevVertex = null;
let num_of_points = 10;

let completed = false;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 10;
  CUSTOM_HEIGHT = windowHeight - 230;
  initializeCorners();

  description = createElement('h3', 'Para iniciar la visualización presione el botón iniciar.');
  inputDescription = createElement('h4', 'S: ');
  outputDescription = createElement('h4', 'conv(S): ');
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeButton();
}

function initializeButton() {
  button = createButton("Iniciar");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
}

async function step() {
  // Initialize points set
  if (pointsSet.size() === 0) {
    pointsSet = new PointSet(getRandomPointsInArea(num_of_points, UP_LEFT_CORNER, DOWN_RIGHT_CORNER));
    description.html("Generamos un conjunto de puntos aleatorio.");
  }
  // Steps of the Graham scan algorithm
  else if (!completed) {
    // add first point
    if (convexHull.size() === 0) {
      convexHull.push(pointsSet.getLowestPoint());
      description.html("Agregamos el punto inferior al conjunto de salida.");
    }
    // add the next corresponding point to the convex hull
    else {
      prevVertex = convexHull.points[convexHull.size() - 1];
      let rightmostVertex = null;
      for (let point of pointsSet.points) {
        currPoint = point
        button.attribute('disabled', '');
        await sleep(50);
        button.removeAttribute('disabled');
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
      if (rightmostVertex == convexHull.points[0]) {
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
    convexHull = new PointSet([]);
    pointsSet = new PointSet([]);
    description.html('Para iniciar la visualización presione el botón iniciar.');
  }
  
  inputDescription.html('S: ' + pointsSet);
  outputDescription.html('conv(S): ' + convexHull);
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(230);
  // Convex hull arrows
  convexHull.drawArrowsBetweenPoints(completed,"green");
  if (pointsSet.size() != 0) {
    pointsSet.drawPoints(256);
  }

  convexHull.drawPoints("blue");
  if( currPoint != null){
    drawArrow(prevVertex, currPoint, "red");
  }
}
