let pointsSet = new PointSet([]);
let convexHull = new PointSet([]);

let curr_index;
let curr_edge = new PointSet([]);
let p = new PointSet([]);

let tangent_a = new PointSet([]);
let tangent_b = new PointSet([]);

let isRightTurn = null;
let arrowColor = null;
let checkLeft;
let checkRight;
let changesOnLeft;
let changesOnRight;

let highest_intersection;
let lowest_intersection;
let num_of_points = 10;
let displayTangents = false;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 180;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeCorners();

  button = createButton("");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
  description = createElement("h3", "");
  inputDescription = createElement("h4", "");
  outputDescription = createElement("h4", "");

  resetAlgorithm();
}

function resetAlgorithm() {
  pointsSet = convexHullJM(
    getRandomPointsInArea(
      Math.floor(3),
      UP_LEFT_CORNER,
      DOWN_RIGHT_CORNER
    )
  );

  convexHull = new PointSet(convexHullJM(pointsSet));
  convexHull.setIds();

  tangent_a.points = [];
  tangent_b.points = [];

  description.html("Para iniciar la visualización y agregar un punto aleatorio presione el botón iniciar.");
  button.html("Iniciar");
}

async function step() {
  // When we have the tangents we finish the algorithm
  if (tangent_a.size() != 0 && tangent_b.size() != 0){
    // reset alg
    if (reset) {
      resetAlgorithm();
      reset = false;
    } else {
      description.html("La tangente inferior ha sido encontrada.");
      button.html("Reiniciar");
      reset = true;
    }
  }
  else if (p.size() == 0) {
    let new_random_point = getRandomPointsInArea(
      1,
      UP_LEFT_CORNER,
      DOWN_RIGHT_CORNER
    )[0];
    new_random_point.z = convexHull.size() + 1;

    p.push(new_random_point);
    curr_index = 0;

    description.html(
      "Tomaremos los dos primeros puntos del cierre convexo actual, para calcular que tipo de vuelta se dará."
    );
    button.html("Siguiente");

  }
  else if (curr_edge.size() == 0) {
    curr_edge.push(convexHull.points[curr_index]);
    curr_index = (curr_index + 1)%convexHull.size();
    curr_edge.push(convexHull.points[curr_index]);
    inputDescription.html(convexHull);

    description.html(
      "Tomamos los siguientes dos puntos del cierre convexo actual, para calcular que tipo de vuelta se dará."
    );
    button.html("Siguiente");
  }
  // if tangent point has been modified in at least one side, we need to check
  // if a lower tangen can be found.
  else {
    if (isRightTurn === null) {
      isRightTurn = turnDirection(curr_edge.points[0], curr_edge.points[1], p.points[0]) == 1;
      if (isRightTurn) {
        arrowColor = color(0, 0, 256, 180);
        description.html(
          "El nuevo punto da vuelta derecha."
        );
      }
      else { 
        arrowColor = color(0, 0, 0, 180);
        description.html(
          "El nuevo punto no da vuelta derecha."
        );
      }
    }
    else{
      curr_edge.points = [];
      isRightTurn = null;

    }
  }
  

  if (curr_edge.size() != 0){
    curr_edge_points = curr_edge.toString().split(" ");
    inputDescription.html(
      "Arista actual: (" +
        curr_edge_points[0] +
        "," +
        curr_edge_points[1] + ")"
    );
  }
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(0);
  drawCHs();
  drawP();
  drawTangents();
}

function drawTangents() {
  if (tangent_a.size() != 0){
    tangent_a.drawLinesBetweenPoints(false, "yellow", 2);
  }
  if (tangent_b.size() != 0) {
    tangent_b.drawLinesBetweenPoints(false, "yellow", 2);
  }
}

function drawCHs() {
  convexHull.drawLinesBetweenPoints(true, "green");
  convexHull.drawPoints("blue");
}

function drawP(){
  if (arrowColor != null){
    drawDirectedLine(curr_edge.points[0],curr_edge.points[1],color(256, 12, 23, 180));
    drawArrow(curr_edge.points[1],p.points[0],arrowColor)
  }
  curr_edge.drawPoints("red");
  p.drawPoints("orange");
}
