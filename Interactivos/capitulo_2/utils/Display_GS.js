let pointsSet = new PointSet([]);
let pointsSorted = new PointSet([]);
let pointsLabel = new PointSet([]);
let convexHull = new PointSet([]);

let lowestPoint= null;
let currPoint = null;
let prevVertex = null;
let second_to_last = null;
let last = null;
let num_of_points = 10;

let take_step = false;
let completed = false;
let turnDisplayed = false;
let turnColor = null;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 10;
  CUSTOM_HEIGHT = windowHeight - 230;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeCorners();
  
  description = createElement('h3', 'Para iniciar la visualización presione el botón iniciar.');
  inputDescription = createElement('h4', 'S: ');
  outputDescription = createElement('h4', 'conv(S): ');
  initializeButton();
}

function initializeButton() {
  button = createButton("Iniciar");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
}

function addLowestPoint() {
  lowestPoint = pointsSet.getLowestPoint()
  convexHull.push(lowestPoint);
  description.html(`Agregamos el punto inferior (P${lowestPoint.z}) al conjunto de salida.`);
}

function sortPoints(){
  let pointsSortedArr = Array.from(pointsSet.points);
  sortCounterClockWise(pointsSortedArr,lowestPoint);
  pointsSorted = new PointSet(pointsSortedArr)
  description.html(`Ordenamos los puntos en contra de las manecillas del reloj, con respecto al punto inferior (P${lowestPoint.z}).`);
}

async function step() {
  // Initialize points set
  if (pointsSet.size() == 0) {
    pointsSet = new PointSet(getRandomPointsInArea(num_of_points, UP_LEFT_CORNER, DOWN_RIGHT_CORNER));
    description.html("Generamos un conjunto de puntos aleatorio.");
    button.html("Siguiente");
  }
  // Steps of the Graham scan algorithm
  else if (!completed) {
    // add first point
    if (convexHull.size() === 0) {
      addLowestPoint();
    }
    // sort the points with respect to the lowest point 
    else if (pointsSorted.size() === 0) {
      sortPoints();
      let first = pointsSorted.shift();
      pointsSorted.push(first);
      pointsLabel = new PointSet(Array.from(pointsSorted.points.slice(0,-1)));
    }
    // add second point
    else if (pointsSorted.size() !== 0 && convexHull.size() === 1) {
      current = pointsSorted.shift();
      convexHull.push(current);
      description.html(`Agregamos al primer punto (P${current.z}) de los que ordenamos, al conjunto de salida.`);
    }
    // add the next corresponding point to the convex hull
    else {
      
      second_to_last = convexHull.points[convexHull.size() - 2];
      last = convexHull.points[convexHull.size() - 1];
      current = pointsSorted.points[0]

      // End of the algorithm
      if (current === convexHull.points[0]){
        description.html(`Cuando terminamos de recorrer todos los puntos ordenados,
                          el algoritmo termina.`);
        completed = true;
        currPoint = null;
        prevVertex = null;
        button.html("Reiniciar");
        return;
      }

      let td = turnDirection(second_to_last, last, current);
      let isLeftTurn = td == -1;

      if (!turnDisplayed){
        let turnValue = ''
        if (isLeftTurn) {
          turnValue = 'izquierda (marcado con color azul).';
          turnColor = 'blue';
        } 
        else{
          turnValue = 'derecha (marcado con color negro).';
          turnColor = 'black';
        }
        description.html(`Comprobamos de que tipo de vuelta se trata. <br>
                          En este caso la vuelta es ${turnValue}`);
        turnDisplayed = true;
        return;
      }

      if (isLeftTurn) {
        pointsSorted.shift();
        convexHull.push(current);
        description.html(`Ya que la vuelta es izquierda agregamos al nuevo punto (P${current.z}).`);
        turnDisplayed = false;
      }
      else{
        convexHull.pop();
        description.html("Ya que la vuelta es derecha removemos al ultimo punto en conv(S) y volvemos a comprobar.");
        turnDisplayed = false;
      }
    }
  }
  // reset alg
  else {
    completed = false;
    convexHull = new PointSet([]);
    pointsSet = new PointSet([]);
    pointsSorted = new PointSet([]);
    pointsLabel = null;
    second_to_last = null;
    last = null;
    button.html("Iniciar");
    description.html('Para iniciar la visualización presione el botón iniciar.')
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
  // Red lines that shows order
  if ( pointsSorted.size() !== 0){
    pointsSorted.drawLinesFromPoint(lowestPoint);
  }
  // Convex hull arrows
  convexHull.drawArrowsBetweenPoints(completed,"green");
  // Turn arrow
  if ( turnDisplayed){
    drawArrow(convexHull.points[convexHull.size() - 1],pointsSorted.points[0], turnColor);
  }
  // Points in S
  pointsSet.drawPoints(256);
  // Points in conv(S)
  convexHull.drawPoints("blue");
  if( pointsLabel != null ){
    drawOrder(pointsLabel);
  }
}
