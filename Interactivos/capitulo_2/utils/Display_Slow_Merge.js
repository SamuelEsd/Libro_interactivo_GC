let left_pointsSet = new PointSet([]);
let right_pointsSet = new PointSet([]);
let left_convexHull = new PointSet([]);
let right_convexHull = new PointSet([]);

let points_to_process = new PointSet([]);
let curr_point_left = new PointSet([]);
let curr_point_right = new PointSet([]);

let upper_tangent = new PointSet([]);
let lower_tangent = new PointSet([]);
let intersecting_points = new PointSet([]);

let reset = false;
let start = true;
let middleLine_end;
let middleLine_start;

let highest_intersection;
let lowest_intersection;
let num_of_points = 10;
let displayTangents = false;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 200;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeCorners();
  middleLine_start = createVector(MIDDLE_WIDTH, WINDOW_BORDER);
  middleLine_end = createVector(MIDDLE_WIDTH, CUSTOM_HEIGHT - WINDOW_BORDER);

  button = createButton("");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
  description = createElement('h3', '');
  inputDescription = createElement('h4', '');
  outputDescription = createElement('h4', '');

  resetAlgorithm();
}

function resetAlgorithm() {
  left_pointsSet = new PointSet(getRandomPointsInArea(Math.floor(num_of_points/2), UP_LEFT_CORNER, DOWN_MIDDLE_CORNER));
  right_pointsSet = new PointSet(getRandomPointsInArea(Math.ceil(num_of_points/2), UP_MIDDLE_CORNER, DOWN_RIGHT_CORNER));
  
  left_convexHull = new PointSet(convexHullJM(left_pointsSet.points));
  right_convexHull = new PointSet(convexHullJM(right_pointsSet.points));

  upper_tangent.points = []
  lower_tangent.points = []

  highest_intersection = middleLine_start.y;
  lowest_intersection = middleLine_end.y;

  description.html('Para iniciar la visualización presione el botón iniciar.');
  button.html('Iniciar');
}

async function step() {
  // Initialize set of point to iterate
  if (start === true) {
    points_to_process = new PointSet(Array.from(left_convexHull.points));
    description.html("Iteramos sobre cada uno de los puntos pertenecientes al cierre convexo izquierdo.");
    button.html("Siguiente");
    start = false;
  }
  // Comparing each point on left to each point on right
  else if (points_to_process.size() > 0 || curr_point_left.size() > 0) {
    // Take next point on left to iterate over it
    if (curr_point_left.size() === 0) {
      curr_point_left.push(points_to_process.shift());
      description.html("Tomamos el siguiente punto a procesar.");
    }
    // Compare the left point with each point on right
    else {
      if (intersecting_points.size() > 0){
        intersecting_points.points = [];
        displayTangents = true;
        description.html("Tomaremos como tangentes a las líneas cuya intersección tenga el valor en \"y\" más grande o mas chico.");
        curr_point_left.shift();
        return;
      }
      for (let point of right_convexHull.points) {
        curr_point_right.push(point);

        let intersecting_point = intersect_point(middleLine_start, middleLine_end, curr_point_left.points[0], curr_point_right.points[0]);
        intersecting_points.push(intersecting_point);
       
        // if the line from left point to right point is a new tangent
        // update the tangent value
        if (intersecting_point.y < lowest_intersection){
          lowest_intersection = intersecting_point.y;
          lower_tangent.points = [curr_point_left.points[0],curr_point_right.points[0]];
        }
        if (intersecting_point.y > highest_intersection){
          highest_intersection = intersecting_point.y;
          upper_tangent.points = [curr_point_left.points[0],curr_point_right.points[0]];
        }

        button.attribute('disabled', '');
        await sleep(50);
        button.removeAttribute('disabled');
        curr_point_right.shift();
        description.html("Trazamos las lineas y calculamos sus intersecciones con la linea que separa a los cierres convexos.");
      }
    }
  }
  // finished
  else {
    // reset alg
    if (reset){
      resetAlgorithm();
      start = true;
      reset = false;
    }
    else{
      description.html('Ya no hay más puntos que procesar y tenemos las líneas tangentes a los cierres convexos')
      button.html('Reiniciar');
      reset = true;
    }
  }
  inputDescription.html('Puntos por procesar: ' + points_to_process);
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(0);
  // Draws the line from the left convex hull to the right convex hull
  if( curr_point_right.size() > 0){
    drawArrow(curr_point_left.points[0], curr_point_right.points[0], "red");
  }

  drawCHs();
  drawMiddleLine();
  curr_point_left.drawPoints("red");
}

function drawCHs(){
  left_convexHull.drawLinesBetweenPoints(true,"green");
  right_convexHull.drawLinesBetweenPoints(true,"green");

  lower_tangent.drawLinesBetweenPoints(false,"yellow",2);
  upper_tangent.drawLinesBetweenPoints(false,"yellow",2);

  left_pointsSet.drawPoints("blue");
  right_pointsSet.drawPoints("blue");
}

function drawMiddleLine(){
  push();
  stroke('red');
  strokeWeight(2);
  line(middleLine_start.x,middleLine_start.y,middleLine_end.x,middleLine_end.y);
  pop();
  intersecting_points.drawPointsNoId('yellow',3);
}