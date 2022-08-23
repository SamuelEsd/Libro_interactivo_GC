let pointsSet = new PointSet([]);
let convexHull = new PointSet([]);

let curr_index;
let curr_edge = new PointSet([]);
let p = new PointSet([]);

let tangent_a = new PointSet([]);
let tangent_b = new PointSet([]);

let isRightTurn = null;
let iterations = 0;
let arrowColor = null;
let lastTurn = null;
let index_a = null;
let index_b = null;

let reset = false;
let num_of_points = 10;

let rightTurnColor;
let leftTurnColor;

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
  rightTurnColor = color(0, 0, 256, 180);
  leftTurnColor = color(256, 256, 256, 180);

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
  removeExtras();

  iterations = 0;
  reset = false;
  lastTurn = null;
  index_a = null;
  index_b = null;

  description.html("Para iniciar la visualización presione el botón iniciar.");
  button.html("Iniciar");
}

function updateConvexHull() {
  new_convexHull = [];
  let addNode = true;
  for (let i = 0; i < convexHull.size(); i++) {
    if (i == index_b) {
      addNode = true;
    }
    if (addNode) {
      new_convexHull.push(convexHull.points[i]);
    }
    if (i == index_a) {
      new_convexHull.push(p.points[0]);
      addNode = false;
    }
  }
  convexHull.points = new_convexHull;
}

function removeExtras(){
  curr_edge.points = [];
  p.points = [];
  tangent_a.points = [];
  tangent_b.points = [];
  isRightTurn = null;
  arrowColor = null;
  iterations = 0;
}

function addRandomPoint() {
  let new_random_point = getRandomPointsInArea(
    1,
    UP_LEFT_CORNER,
    DOWN_RIGHT_CORNER
  )[0];
  new_random_point.z = convexHull.size() + 1;

  p.push(new_random_point);
  curr_index = 0;
}

async function step() {
  // When we have the tangents or we hav checked all the edges, we finish the algorithm
  if ((tangent_a.size() != 0 && tangent_b.size() != 0) || (iterations > convexHull.size() + 1)) {
    // reset alg
    if (reset) {
      resetAlgorithm();
      return;
    }
    // Finish convex hull
    if (iterations > convexHull.size() + 1) {
      description.html("Ya se revisaron todas las aristas y todas son vueltas izquierdas, entonces el punto estaba dentro del cierre convexo y este permanece igual.");
    }
    else {
      description.html("Ya se encontraron las tangentes y se puede formar el nuevo cierre convexo.");
      updateConvexHull();
    }
    if (convexHull.size() == 6){  
      button.html("Reiniciar");
      reset = true;
    }
    else{
      removeExtras();
    }
  }
  // start algorithm adding a random point
  else if (p.size() == 0) {
    addRandomPoint();
    description.html(
      "Agregamos un punto aleatorio."
    );
    button.html("Siguiente");
  }
  // Iterate over the next edge
  else if (curr_edge.size() == 0) {
    curr_edge.push(convexHull.points[curr_index]);
    curr_index = (curr_index + 1) % convexHull.size();
    curr_edge.push(convexHull.points[curr_index]);
    iterations++;

    description.html(
      "Tomaremos dos puntos del cierre convexo actual, para calcular que tipo de vuelta se dará."
    );
    inputDescription.html(convexHull);
    button.html("Siguiente");
  }
  // Check the direction of the turn of the point p and the current edge.
  else {
    // We need to get the current turn direction
    if (isRightTurn === null) {
      isRightTurn = turnDirection(curr_edge.points[0], curr_edge.points[1], p.points[0]) == 1;
      // Right Turn
      if (isRightTurn) {
        if (lastTurn != null && lastTurn != "right") {
          description.html(
            "El nuevo punto da vuelta derecha y la anterior fue izquierda, entonces el primer punto de la arista actual forma parte de una tangente."
          );
          tangent_a.push(p.points[0]);
          tangent_a.push(curr_edge.points[0]);
          index_a = (curr_index + (convexHull.size() - 1)) % convexHull.size();
        }
        else {
          description.html(
            "El nuevo punto da vuelta derecha."
          );
        }
        arrowColor = rightTurnColor;
        lastTurn = "right";
      }
      // Left Turn
      else {
        if (lastTurn != null && lastTurn == "right") {
          description.html(
            "El nuevo punto da vuelta izquierda y la anterior fue derecha, entonces el primer punto de la arista actual forma parte de una tangente."
          );
          tangent_b.push(p.points[0]);
          tangent_b.push(curr_edge.points[0]);
          index_b = (curr_index + (convexHull.size() - 1)) % convexHull.size();
        }
        else {
          description.html(
            "El nuevo punto da vuelta izquierda."
          );
        }
        arrowColor = leftTurnColor;
        lastTurn = "left";
      }
    }
    // We know current turn direction, we have to erase it in order to get the next one 
    else {
      curr_edge.points = [];
      isRightTurn = null;
      arrowColor = null;
    }
  }


  if (curr_edge.size() != 0) {
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
  drawTangents();
  drawCHs();
  drawPAndTurn();
}

function drawTangents() {
  if (tangent_a.size() != 0) {
    tangent_a.drawLinesBetweenPoints(false, "yellow", 3);
  }
  if (tangent_b.size() != 0) {
    tangent_b.drawLinesBetweenPoints(false, "yellow", 3);
  }
}

function drawCHs() {
  convexHull.drawLinesBetweenPoints(true, "green");
  convexHull.drawPoints("blue");
}

function drawPAndTurn() {
  p.drawPoints("orange");
  curr_edge.drawPoints("red");
  if (arrowColor != null) {
    drawDirectedLine(curr_edge.points[0], curr_edge.points[1], color(256, 12, 23, 180));
    drawArrow(curr_edge.points[1], p.points[0], arrowColor)
  }
}
