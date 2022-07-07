let pointsSet = [];
let pointsSorted = [];
let pointsLabel = [];
let convexHull = [];

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
  pointsSet = getRandomPointsInArea(num_of_points, startingP, endingP);
  description.html("Generamos un conjunto de puntos aleatorio.");
  button.html("Siguiente");
}

function addLowestPoint() {
  lowestPoint = pointsSet[0];
  for (let point of pointsSet) {
    if ( point.y > lowestPoint.y || (point.y == lowestPoint.y && point.x > lowestPoint.x)) {
      lowestPoint = point;
    }
  }
  convexHull.push(lowestPoint);
  description.html(`Agregamos el punto inferior (P${lowestPoint.z}) al conjunto de salida.`);
}

function sortPoints(){
  pointsSorted = Array.from(pointsSet);
  console.log(pointsSet);
  sortCounterClockWise(pointsSorted,lowestPoint);
  console.log(pointsSorted);
  description.html(`Ordenamos los puntos en contra de las manecillas del reloj, con respecto al punto inferior (P${lowestPoint.z}).`);
}

function initializeButton() {
  button = createButton("Iniciar");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
}

function pointsToString(points){
  let desc = '';
  for (let currPoint of points) {
    desc += `P${currPoint.z} `
  }
  return desc
}

async function step() {
  // Initialize points set
  if (pointsSet.length == 0) {
    initializePoints();
  }
  // Steps of the Graham scan algorithm
  else if (!completed) {
    // add first point
    if (convexHull.length === 0) {
      addLowestPoint();
    }
    // sort the points with respect to the lowest point 
    else if (pointsSorted.length === 0) {
      sortPoints();
      let first = pointsSorted.shift();
      pointsSorted.push(first);
      pointsLabel = Array.from(pointsSorted.slice(0,-1));
    }
    // add second point
    else if (pointsSorted.length !== 0 && convexHull.length === 1) {
      current = pointsSorted.shift();
      convexHull.push(current);
      description.html(`Agregamos al primer punto (P${current.z}) de los que ordenamos, al conjunto de salida.`);
    }
    // add the next corresponding point to the convex hull
    else {
      
      second_to_last = convexHull[convexHull.length - 2];
      last = convexHull[convexHull.length - 1];
      current = pointsSorted[0]

      // End of the algorithm
      if (current === convexHull[0]){
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
    convexHull = [];
    pointsSet = [];
    pointsSorted = [];
    pointsLabel = null;
    second_to_last = null;
    last = null;
    button.html("Iniciar");
    description.html('Para iniciar la visualización presione el botón iniciar.')
  }
  
  inputDescription.html('S: ' + pointsToString(pointsSet));
  outputDescription.html('conv(S): ' + pointsToString(convexHull));
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(230);
  // Red lines that shows order
  if ( pointsSorted.length !== 0){
    drawLinesFromPoint(pointsSorted , lowestPoint)
  }
  // Convex hull arrows
  drawArrows(convexHull, completed,"green");
  // Turn arrow
  if ( turnDisplayed){
    drawArrow(convexHull[convexHull.length - 1],pointsSorted[0], turnColor);
  }
  // Points in S
  drawPoints(pointsSet, 256);
  // Points in conv(S)
  drawPoints(convexHull, "blue");
  if( pointsLabel != null ){
    drawOrder(pointsLabel);
  }
}
